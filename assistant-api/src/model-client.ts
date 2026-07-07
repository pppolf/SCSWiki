import type { ModelMessage } from './rag';

export type FetchLike = (url: string, init: RequestInit) => Promise<Response>;

export type ChatClientOptions = {
  apiKey: string;
  endpoint: string;
  fetchImpl?: FetchLike;
  maxTokens: number;
  model: string;
  temperature?: number;
};

export type EmbeddingClientOptions = {
  apiKey: string;
  batchSize: number;
  dimensions: number;
  endpoint: string;
  fetchImpl?: FetchLike;
  model: string;
};

type ChatCompletionResponse = {
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

type EmbeddingResponse = {
  data?: Array<{
    embedding?: number[];
    index?: number;
  }>;
  embedding?: number[];
};

export function createChatCompletionClient(options: ChatClientOptions) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const temperature = options.temperature ?? 0.2;

  async function complete(messages: ModelMessage[]) {
    const response = await requestWithTimeout(
      fetchImpl,
      options.endpoint,
      {
        body: JSON.stringify({
          max_tokens: options.maxTokens,
          messages,
          model: options.model,
          temperature,
          thinking: {
            type: 'disabled',
          },
        }),
        headers: buildJsonHeaders(options.apiKey, 'SCS_ASSISTANT_CHAT_API_KEY'),
        method: 'POST',
      },
      60_000,
    );

    if (!response.ok) {
      throw new Error(`Chat request failed with ${response.status}.`);
    }

    const data = (await response.json()) as ChatCompletionResponse;
    return data.choices?.[0]?.message?.content ?? '';
  }

  async function completeStream(messages: ModelMessage[], onDelta: (delta: string) => void) {
    const response = await requestWithTimeout(
      fetchImpl,
      options.endpoint,
      {
        body: JSON.stringify({
          max_tokens: options.maxTokens,
          messages,
          model: options.model,
          stream: true,
          temperature,
          thinking: {
            type: 'disabled',
          },
        }),
        headers: {
          ...buildJsonHeaders(options.apiKey, 'SCS_ASSISTANT_CHAT_API_KEY'),
          accept: 'text/event-stream',
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
      const data = (await response.json()) as ChatCompletionResponse;
      onDelta(data.choices?.[0]?.message?.content ?? '');
      return;
    }

    const reader = response.body?.getReader();

    if (!reader) {
      throw new Error('Chat stream response did not include a body.');
    }

    await readEventStream(reader, (frame) => {
      const delta = readChatStreamDelta(frame);

      if (delta === '[DONE]') {
        return false;
      }

      if (delta) {
        onDelta(delta);
      }

      return true;
    });
  }

  return {
    complete,
    completeStream,
  };
}

export function createEmbeddingClient(options: EmbeddingClientOptions) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const batchSize = Math.max(1, options.batchSize);

  async function embed(input: string) {
    const [embedding] = await embedBatch([input]);

    if (!embedding) {
      throw new Error('Embedding response did not include a vector.');
    }

    return embedding;
  }

  async function embedBatch(inputs: string[]) {
    if (inputs.length === 0) {
      return [];
    }

    if (inputs.length > batchSize) {
      throw new Error(`Embedding batch cannot exceed ${batchSize} inputs.`);
    }

    const response = await requestWithTimeout(fetchImpl, options.endpoint, {
      body: JSON.stringify({
        dimensions: options.dimensions,
        encoding_format: 'float',
        input: inputs,
        model: options.model,
      }),
      headers: buildJsonHeaders(options.apiKey, 'SCS_ASSISTANT_EMBEDDING_API_KEY'),
      method: 'POST',
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Embedding request failed: ${response.status} ${body}`);
    }

    const data = (await response.json()) as EmbeddingResponse;
    const embeddings =
      data.data
        ?.slice()
        .sort((left, right) => (left.index ?? 0) - (right.index ?? 0))
        .map((item) => item.embedding) ?? (data.embedding ? [data.embedding] : []);

    if (embeddings.length !== inputs.length || embeddings.some((embedding) => !embedding?.length)) {
      throw new Error('Embedding response did not include all requested vectors.');
    }

    return embeddings.map((embedding) => {
      if (!embedding) {
        throw new Error('Embedding response did not include a vector.');
      }

      if (embedding.length !== options.dimensions) {
        throw new Error(
          `Embedding response dimension mismatch: expected ${options.dimensions}, got ${embedding.length}.`,
        );
      }

      return embedding;
    });
  }

  return {
    embed,
    embedBatch,
  };
}

export function readChatStreamDelta(frame: string) {
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
    const parsed = JSON.parse(data) as ChatCompletionResponse;
    return parsed.choices?.[0]?.delta?.content ?? parsed.choices?.[0]?.message?.content ?? '';
  } catch {
    return '';
  }
}

async function readEventStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onFrame: (frame: string) => boolean,
) {
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

      if (!onFrame(frame)) {
        return;
      }

      frameEnd = buffer.indexOf('\n\n');
    }
  }
}

async function requestWithTimeout(
  fetchImpl: FetchLike,
  url: string,
  init: RequestInit,
  timeoutMs = 30_000,
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetchImpl(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function buildJsonHeaders(apiKey: string, envName: string) {
  if (!apiKey) {
    throw new Error(`${envName} is required.`);
  }

  return {
    authorization: `Bearer ${apiKey}`,
    'content-type': 'application/json',
  };
}
