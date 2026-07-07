import fs from 'node:fs/promises';
import http, { type IncomingMessage, type ServerResponse } from 'node:http';
import path from 'node:path';
import {
  AssistantDependencyError,
  AssistantInputError,
  buildExtractiveFallback,
  createAssistantAnswer,
  prepareAssistantGeneration,
  type ModelMessage,
  type RuntimeChunk,
} from './rag';
import {
  prepareAssistantIndex,
  type AssistantIndexError,
  type AssistantIndexFile,
  type AssistantIndexInfo,
} from './index-file';
import { createChatCompletionClient, createEmbeddingClient } from './model-client';

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const host = process.env.SCS_ASSISTANT_HOST ?? '127.0.0.1';
const port = readNumberEnv('SCS_ASSISTANT_PORT', 8787);
const chatEndpoint =
  process.env.SCS_ASSISTANT_CHAT_URL ?? 'https://api.deepseek.com/chat/completions';
const chatModel = process.env.SCS_ASSISTANT_CHAT_MODEL ?? 'deepseek-v4-flash';
const chatApiKey = process.env.SCS_ASSISTANT_CHAT_API_KEY ?? '';
const embeddingEndpoint =
  process.env.SCS_ASSISTANT_EMBEDDING_URL ??
  'https://dashscope.aliyuncs.com/compatible-mode/v1/embeddings';
const embeddingModel = process.env.SCS_ASSISTANT_EMBEDDING_MODEL ?? 'text-embedding-v4';
const embeddingApiKey = process.env.SCS_ASSISTANT_EMBEDDING_API_KEY ?? '';
const embeddingDimensions = readNumberEnv('SCS_ASSISTANT_EMBEDDING_DIMENSIONS', 1024);
const embeddingBatchSize = readNumberEnv('SCS_ASSISTANT_EMBEDDING_BATCH_SIZE', 10);
const embeddingTimeoutMs = readNumberEnv('SCS_ASSISTANT_EMBEDDING_TIMEOUT_MS', 30_000);
const embeddingRetries = readNonNegativeNumberEnv('SCS_ASSISTANT_EMBEDDING_RETRIES', 1);
const indexPath = path.resolve(
  process.env.SCS_ASSISTANT_INDEX_PATH ?? 'assistant-data/scswiki-rag-index.json',
);
const allowedOrigins = new Set(
  (
    process.env.SCS_ASSISTANT_ALLOWED_ORIGINS ??
    'https://scswiki.com,https://www.scswiki.com,http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);
const rateLimitWindowMs = readNumberEnv('SCS_ASSISTANT_RATE_LIMIT_WINDOW_MS', 60_000);
const rateLimitMax = readNumberEnv('SCS_ASSISTANT_RATE_LIMIT_MAX', 10);
const maxTokens = readNumberEnv('SCS_ASSISTANT_MAX_TOKENS', 2048);

let runtimeChunks: RuntimeChunk[] = [];
let indexInfo: AssistantIndexInfo | null = null;
let indexError: AssistantIndexError | null = null;
let indexMtimeMs = 0;

const rateLimits = new Map<string, RateLimitBucket>();
const chatClient = createChatCompletionClient({
  apiKey: chatApiKey,
  endpoint: chatEndpoint,
  maxTokens,
  model: chatModel,
});
const embeddingClient = createEmbeddingClient({
  apiKey: embeddingApiKey,
  batchSize: embeddingBatchSize,
  dimensions: embeddingDimensions,
  endpoint: embeddingEndpoint,
  maxRetries: embeddingRetries,
  model: embeddingModel,
  timeoutMs: embeddingTimeoutMs,
});

await loadIndex();

const server = http.createServer((request, response) => {
  void handleRequest(request, response);
});

server.listen(port, host, () => {
  console.log(`SCSWiki assistant API listening on http://${host}:${port}`);
});

async function handleRequest(request: IncomingMessage, response: ServerResponse) {
  const corsOrigin = getAllowedCorsOrigin(request);

  if (corsOrigin === false) {
    sendJson(response, 403, {
      error: { code: 'origin_not_allowed', message: 'Origin not allowed.' },
    });
    return;
  }

  if (request.method === 'OPTIONS') {
    sendOptions(response, corsOrigin);
    return;
  }

  if (request.method === 'GET' && request.url === '/health') {
    sendJson(
      response,
      200,
      {
        api: {
          ok: true,
        },
        llm: {
          endpoint: chatEndpoint,
          model: chatModel,
        },
        embedding: {
          dimensions: embeddingDimensions,
          endpoint: embeddingEndpoint,
          model: embeddingModel,
        },
        index: {
          loaded: runtimeChunks.length > 0,
          path: indexPath,
          chunks: runtimeChunks.length,
          createdAt: indexInfo?.createdAt ?? null,
          embeddingDimensions: indexInfo?.embeddingDimensions ?? null,
          embeddingModel: indexInfo?.embeddingModel ?? null,
          error: indexError,
        },
      },
      corsOrigin,
    );
    return;
  }

  if (request.method === 'POST' && request.url === '/api/assistant/chat') {
    await handleChat(request, response, corsOrigin);
    return;
  }

  sendJson(response, 404, { error: { code: 'not_found', message: 'Not found.' } }, corsOrigin);
}

async function handleChat(
  request: IncomingMessage,
  response: ServerResponse,
  corsOrigin: string | null,
) {
  const clientId = getClientId(request);

  if (!consumeRateLimit(clientId)) {
    sendJson(
      response,
      429,
      { error: { code: 'rate_limited', message: 'Too many requests. Please try again later.' } },
      corsOrigin,
    );
    return;
  }

  await reloadIndexIfChanged();

  if (indexError) {
    sendJson(response, 503, { error: indexError }, corsOrigin);
    return;
  }

  if (runtimeChunks.length === 0) {
    sendJson(
      response,
      503,
      {
        error: {
          code: 'index_unavailable',
          message: 'Assistant index is not available. Run pnpm assistant:index first.',
        },
      },
      corsOrigin,
    );
    return;
  }

  let body: unknown;

  try {
    body = JSON.parse(await readBody(request));
  } catch {
    sendJson(
      response,
      400,
      { error: { code: 'invalid_json', message: 'Invalid JSON body.' } },
      corsOrigin,
    );
    return;
  }

  if (
    request.headers.accept?.includes('text/event-stream') ||
    getBodyProperty(body, 'stream') === true
  ) {
    await handleChatStream(body, response, corsOrigin);
    return;
  }

  try {
    const result = await createAssistantAnswer(
      {
        history: getBodyProperty(body, 'history'),
        message: getBodyProperty(body, 'message'),
      },
      {
        chunks: runtimeChunks,
        complete: createCompletion,
        embed: createEmbedding,
      },
    );

    sendJson(response, 200, result, corsOrigin);
  } catch (error) {
    if (error instanceof AssistantInputError || error instanceof AssistantDependencyError) {
      sendJson(
        response,
        error.statusCode,
        {
          error: {
            code: error.code,
            message: error.message,
          },
        },
        corsOrigin,
      );
      return;
    }

    sendJson(
      response,
      500,
      { error: { code: 'internal_error', message: 'Assistant API failed.' } },
      corsOrigin,
    );
  }
}

async function handleChatStream(
  body: unknown,
  response: ServerResponse,
  corsOrigin: string | null,
) {
  startSse(response, corsOrigin);

  try {
    writeSse(response, 'status', { message: 'retrieving' });

    const prepared = await prepareAssistantGeneration(
      {
        history: getBodyProperty(body, 'history'),
        message: getBodyProperty(body, 'message'),
      },
      {
        chunks: runtimeChunks,
        embed: createEmbedding,
      },
    );

    if (prepared.earlyAnswer) {
      writeSse(response, 'delta', { delta: prepared.earlyAnswer.answer });
      writeSse(response, 'done', {
        sources: prepared.earlyAnswer.sources,
        warnings: prepared.earlyAnswer.warnings,
      });
      response.end();
      return;
    }

    let emittedContent = false;

    if (prepared.warnings.length > 0) {
      emittedContent = true;
      writeSse(response, 'delta', {
        delta: `可信度提醒：${prepared.warnings.join('；')}\n\n`,
      });
    }

    writeSse(response, 'status', { message: 'generating' });

    try {
      await createCompletionStream(prepared.modelMessages, (delta) => {
        const cleanDelta = sanitizeStreamDelta(delta);

        if (!cleanDelta) {
          return;
        }

        emittedContent = true;
        writeSse(response, 'delta', { delta: cleanDelta });
      });
    } catch {
      throw new AssistantDependencyError('model_unavailable', '生成模型服务暂时不可用。');
    }

    if (!emittedContent) {
      writeSse(response, 'delta', {
        delta: buildExtractiveFallback(prepared.chunks),
      });
    }

    writeSse(response, 'done', {
      sources: prepared.sources,
      warnings: prepared.warnings,
    });
  } catch (error) {
    const statusError =
      error instanceof AssistantInputError || error instanceof AssistantDependencyError
        ? error
        : new AssistantDependencyError('internal_error', 'Assistant API failed.', 500);

    writeSse(response, 'error', {
      code: statusError.code,
      message: statusError.message,
    });
  } finally {
    response.end();
  }
}

async function createEmbedding(input: string) {
  return embeddingClient.embed(input);
}

async function createCompletion(messages: ModelMessage[]) {
  return chatClient.complete(messages);
}

async function createCompletionStream(messages: ModelMessage[], onDelta: (delta: string) => void) {
  await chatClient.completeStream(messages, onDelta);
}

async function loadIndex() {
  try {
    const stats = await fs.stat(indexPath);
    const raw = await fs.readFile(indexPath, 'utf8');
    const index = JSON.parse(raw) as AssistantIndexFile;
    const prepared = prepareAssistantIndex(index, {
      expectedEmbeddingDimensions: embeddingDimensions,
      expectedEmbeddingModel: embeddingModel,
    });

    runtimeChunks = prepared.chunks;
    indexInfo = prepared.info;
    indexError = prepared.error;
    indexMtimeMs = stats.mtimeMs;

    if (indexError) {
      console.warn(`Assistant index is not usable: ${indexError.message}`);
    }
  } catch (error) {
    runtimeChunks = [];
    indexInfo = null;
    indexError = null;
    indexMtimeMs = 0;
    console.warn(`Assistant index is not loaded: ${(error as Error).message}`);
  }
}

async function reloadIndexIfChanged() {
  try {
    const stats = await fs.stat(indexPath);

    if (stats.mtimeMs !== indexMtimeMs) {
      await loadIndex();
    }
  } catch {
    if (indexMtimeMs !== 0) {
      await loadIndex();
    }
  }
}

async function readBody(request: IncomingMessage, maxBytes = 64 * 1024) {
  const chunks: Buffer[] = [];
  let length = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    length += buffer.length;

    if (length > maxBytes) {
      throw new Error('Request body is too large.');
    }

    chunks.push(buffer);
  }

  return Buffer.concat(chunks).toString('utf8');
}

function consumeRateLimit(clientId: string) {
  const now = Date.now();
  const current = rateLimits.get(clientId);

  if (!current || current.resetAt <= now) {
    rateLimits.set(clientId, {
      count: 1,
      resetAt: now + rateLimitWindowMs,
    });
    return true;
  }

  if (current.count >= rateLimitMax) {
    return false;
  }

  current.count += 1;
  return true;
}

function getClientId(request: IncomingMessage) {
  const forwardedFor = request.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string' && forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return request.socket.remoteAddress ?? 'unknown';
}

function getAllowedCorsOrigin(request: IncomingMessage) {
  const origin = request.headers.origin;

  if (!origin) {
    return null;
  }

  return allowedOrigins.has(origin) ? origin : false;
}

function sendOptions(response: ServerResponse, corsOrigin: string | null) {
  applyCors(response, corsOrigin);
  response.writeHead(204, {
    'access-control-allow-headers': 'accept,content-type',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-max-age': '86400',
  });
  response.end();
}

function sendJson(
  response: ServerResponse,
  statusCode: number,
  body: unknown,
  corsOrigin: string | null = null,
) {
  applyCors(response, corsOrigin);
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(body));
}

function applyCors(response: ServerResponse, corsOrigin: string | null) {
  response.setHeader('vary', 'origin');

  if (corsOrigin) {
    response.setHeader('access-control-allow-origin', corsOrigin);
  }
}

function startSse(response: ServerResponse, corsOrigin: string | null) {
  applyCors(response, corsOrigin);
  response.writeHead(200, {
    'cache-control': 'no-cache, no-transform',
    connection: 'keep-alive',
    'content-type': 'text/event-stream; charset=utf-8',
    'x-accel-buffering': 'no',
  });
  response.flushHeaders?.();
}

function writeSse(response: ServerResponse, event: string, data: unknown) {
  response.write(`event: ${event}\n`);
  response.write(`data: ${JSON.stringify(data)}\n\n`);
}

function sanitizeStreamDelta(delta: string) {
  return delta.replace(/<\/?think>/gi, '');
}

function readNumberEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function readNonNegativeNumberEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value >= 0 ? value : fallback;
}

function getBodyProperty(body: unknown, key: string) {
  if (!body || typeof body !== 'object') {
    return undefined;
  }

  return Reflect.get(body, key);
}
