import fs from 'node:fs/promises';
import http, { type IncomingMessage, type ServerResponse } from 'node:http';
import path from 'node:path';
import {
  AssistantDependencyError,
  AssistantInputError,
  buildExtractiveFallback,
  createAssistantAnswer,
  prepareAssistantGeneration,
  type IndexedChunk,
  type ModelMessage,
  toRuntimeChunks,
  type RuntimeChunk,
} from './rag';

type AssistantIndexFile = {
  version: 1;
  createdAt: string;
  embeddingModel: string;
  chunkCount: number;
  chunks: IndexedChunk[];
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const host = process.env.SCS_ASSISTANT_HOST ?? '127.0.0.1';
const port = readNumberEnv('SCS_ASSISTANT_PORT', 8787);
const chatEndpoint =
  process.env.SCS_ASSISTANT_CHAT_URL ?? 'http://127.0.0.1:8080/v1/chat/completions';
const chatModel = process.env.SCS_ASSISTANT_CHAT_MODEL ?? 'scswiki-qwen';
const embeddingEndpoint =
  process.env.SCS_ASSISTANT_EMBEDDING_URL ?? 'http://127.0.0.1:8081/v1/embeddings';
const embeddingModel = process.env.SCS_ASSISTANT_EMBEDDING_MODEL ?? 'bge-m3';
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
let indexInfo: Omit<AssistantIndexFile, 'chunks'> | null = null;
let indexMtimeMs = 0;

const rateLimits = new Map<string, RateLimitBucket>();

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
          endpoint: embeddingEndpoint,
          model: embeddingModel,
        },
        index: {
          loaded: runtimeChunks.length > 0,
          path: indexPath,
          chunks: runtimeChunks.length,
          createdAt: indexInfo?.createdAt ?? null,
          embeddingModel: indexInfo?.embeddingModel ?? null,
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
  const response = await fetchWithTimeout(embeddingEndpoint, {
    body: JSON.stringify({
      input,
      model: embeddingModel,
    }),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Embedding request failed with ${response.status}.`);
  }

  const data = (await response.json()) as {
    data?: Array<{ embedding?: number[] }>;
    embedding?: number[];
  };
  const embedding = data.data?.[0]?.embedding ?? data.embedding;

  if (!Array.isArray(embedding) || embedding.length === 0) {
    throw new Error('Embedding response did not include a vector.');
  }

  return embedding;
}

async function createCompletion(messages: ModelMessage[]) {
  const response = await fetchWithTimeout(
    chatEndpoint,
    {
      body: JSON.stringify({
        chat_template_kwargs: {
          enable_thinking: false,
        },
        max_tokens: maxTokens,
        messages,
        model: chatModel,
        temperature: 0.2,
      }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    },
    60_000,
  );

  if (!response.ok) {
    throw new Error(`Chat request failed with ${response.status}.`);
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
        reasoning_content?: string;
      };
    }>;
  };

  return data.choices?.[0]?.message?.content ?? '';
}

async function createCompletionStream(messages: ModelMessage[], onDelta: (delta: string) => void) {
  const response = await fetchWithTimeout(
    chatEndpoint,
    {
      body: JSON.stringify({
        chat_template_kwargs: {
          enable_thinking: false,
        },
        max_tokens: maxTokens,
        messages,
        model: chatModel,
        stream: true,
        temperature: 0.2,
      }),
      headers: {
        accept: 'text/event-stream',
        'content-type': 'application/json',
      },
      method: 'POST',
    },
    90_000,
  );

  if (!response.ok) {
    throw new Error(`Chat stream request failed with ${response.status}.`);
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('text/event-stream')) {
    const data = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
          reasoning_content?: string;
        };
      }>;
    };
    onDelta(data.choices?.[0]?.message?.content ?? '');
    return;
  }

  const reader = response.body?.getReader();

  if (!reader) {
    throw new Error('Chat stream response did not include a body.');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    buffer = buffer.replace(/\r\n/g, '\n');
    let frameEnd = buffer.indexOf('\n\n');

    while (frameEnd !== -1) {
      const frame = buffer.slice(0, frameEnd);
      buffer = buffer.slice(frameEnd + 2);
      const delta = readChatStreamDelta(frame);

      if (delta === '[DONE]') {
        return;
      }

      if (delta) {
        onDelta(delta);
      }

      frameEnd = buffer.indexOf('\n\n');
    }
  }
}

async function loadIndex() {
  try {
    const stats = await fs.stat(indexPath);
    const raw = await fs.readFile(indexPath, 'utf8');
    const index = JSON.parse(raw) as AssistantIndexFile;

    runtimeChunks = toRuntimeChunks(index.chunks);
    indexInfo = {
      chunkCount: index.chunkCount,
      createdAt: index.createdAt,
      embeddingModel: index.embeddingModel,
      version: index.version,
    };
    indexMtimeMs = stats.mtimeMs;
  } catch (error) {
    runtimeChunks = [];
    indexInfo = null;
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

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 30_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
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

function readChatStreamDelta(frame: string) {
  const data = frame
    .split(/\r?\n/)
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trimStart())
    .join('\n')
    .trim();

  if (!data) {
    return '';
  }

  if (data === '[DONE]') {
    return '[DONE]';
  }

  try {
    const parsed = JSON.parse(data) as {
      choices?: Array<{
        delta?: {
          content?: string;
          reasoning_content?: string;
        };
        message?: {
          content?: string;
          reasoning_content?: string;
        };
      }>;
    };

    return parsed.choices?.[0]?.delta?.content ?? parsed.choices?.[0]?.message?.content ?? '';
  } catch {
    return '';
  }
}

function sanitizeStreamDelta(delta: string) {
  return delta.replace(/<\/?think>/gi, '');
}

function readNumberEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function getBodyProperty(body: unknown, key: string) {
  if (!body || typeof body !== 'object') {
    return undefined;
  }

  return Reflect.get(body, key);
}
