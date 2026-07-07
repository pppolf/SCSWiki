import { describe, expect, it } from 'vitest';
import {
  createChatCompletionClient,
  createEmbeddingClient,
  type FetchLike,
} from '../../assistant-api/src/model-client';

function makeVector(seed: number, dimensions = 1024) {
  return Array.from({ length: dimensions }, (_, index) => seed + index / dimensions);
}

describe('assistant model clients', () => {
  it('sends DeepSeek chat requests with auth and disabled thinking', async () => {
    const calls: Array<{ init: RequestInit; url: string }> = [];
    const fetchImpl: FetchLike = async (url, init) => {
      calls.push({ init, url });
      return new Response(JSON.stringify({ choices: [{ message: { content: '回答' } }] }), {
        headers: { 'content-type': 'application/json' },
      });
    };
    const client = createChatCompletionClient({
      apiKey: 'chat-key',
      endpoint: 'https://api.deepseek.com/chat/completions',
      fetchImpl,
      maxTokens: 512,
      model: 'deepseek-v4-flash',
    });

    const answer = await client.complete([{ content: '你好', role: 'user' }]);
    const body = JSON.parse(String(calls[0]?.init.body)) as {
      max_tokens: number;
      model: string;
      thinking: { type: string };
    };
    const headers = calls[0]?.init.headers as Record<string, string>;

    expect(answer).toBe('回答');
    expect(calls[0]?.url).toBe('https://api.deepseek.com/chat/completions');
    expect(headers.authorization).toBe('Bearer chat-key');
    expect(body).toMatchObject({
      max_tokens: 512,
      model: 'deepseek-v4-flash',
      thinking: { type: 'disabled' },
    });
  });

  it('streams DeepSeek-compatible deltas', async () => {
    const encoder = new TextEncoder();
    const fetchImpl: FetchLike = async () =>
      new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(
              encoder.encode(
                [
                  'data: {"choices":[{"delta":{"content":"你"}}]}',
                  '',
                  'data: {"choices":[{"delta":{"content":"好"}}]}',
                  '',
                  'data: [DONE]',
                  '',
                ].join('\n'),
              ),
            );
            controller.close();
          },
        }),
        {
          headers: { 'content-type': 'text/event-stream' },
        },
      );
    const client = createChatCompletionClient({
      apiKey: 'chat-key',
      endpoint: 'https://api.deepseek.com/chat/completions',
      fetchImpl,
      maxTokens: 512,
      model: 'deepseek-v4-flash',
    });
    let content = '';

    await client.completeStream([{ content: '你好', role: 'user' }], (delta) => {
      content += delta;
    });

    expect(content).toBe('你好');
  });

  it('sends DashScope embedding requests with text-embedding-v4 dimensions', async () => {
    const calls: Array<{ init: RequestInit; url: string }> = [];
    const fetchImpl: FetchLike = async (url, init) => {
      calls.push({ init, url });
      return new Response(
        JSON.stringify({
          data: [
            { embedding: makeVector(1), index: 0 },
            { embedding: makeVector(2), index: 1 },
          ],
        }),
        {
          headers: { 'content-type': 'application/json' },
        },
      );
    };
    const client = createEmbeddingClient({
      apiKey: 'embedding-key',
      batchSize: 10,
      dimensions: 1024,
      endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/embeddings',
      fetchImpl,
      model: 'text-embedding-v4',
    });

    const embeddings = await client.embedBatch(['问题一', '问题二']);
    const body = JSON.parse(String(calls[0]?.init.body)) as {
      dimensions: number;
      encoding_format: string;
      input: string[];
      model: string;
    };
    const headers = calls[0]?.init.headers as Record<string, string>;

    expect(embeddings).toHaveLength(2);
    expect(embeddings[0]).toHaveLength(1024);
    expect(calls[0]?.url).toBe('https://dashscope.aliyuncs.com/compatible-mode/v1/embeddings');
    expect(headers.authorization).toBe('Bearer embedding-key');
    expect(body).toMatchObject({
      dimensions: 1024,
      encoding_format: 'float',
      input: ['问题一', '问题二'],
      model: 'text-embedding-v4',
    });
  });
});
