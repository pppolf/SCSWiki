import { describe, expect, it } from 'vitest';
import {
  createAssistantAnswer,
  type IndexedChunk,
  type ModelMessage,
  toRuntimeChunks,
} from '../../assistant-api/src/rag';

function makeChunk(overrides: Partial<IndexedChunk> = {}): IndexedChunk {
  return {
    category: 'campus',
    content_type: 'experience',
    description: '宿舍生活说明',
    embedding: [1, 0],
    file: 'docs/start/faq.md',
    headingPath: ['宿舍'],
    id: 'chunk-1',
    sources: [],
    status: 'needs-review',
    text: '宿舍使用大功率电器可能跳闸，具体要求应以公开通知为准。',
    title: '新生常见问题',
    url: '/start/faq',
    ...overrides,
  };
}

describe('assistant RAG behavior', () => {
  it('uses mocked embedding and model calls while preserving trust warnings and sources', async () => {
    const chunks = toRuntimeChunks([makeChunk()]);
    let capturedMessages: ModelMessage[] = [];

    const result = await createAssistantAnswer(
      {
        message: '宿舍限电吗',
      },
      {
        chunks,
        complete: async (messages) => {
          capturedMessages = messages;
          return '根据资料，宿舍用电需要谨慎。';
        },
        embed: async () => [1, 0],
        minScore: 0,
      },
    );

    expect(result.answer).toContain('可信度提醒');
    expect(result.answer).toContain('学生经验');
    expect(result.answer).toContain('待核验');
    expect(result.sources[0]).toMatchObject({
      status: 'needs-review',
      title: '新生常见问题',
      url: '/start/faq',
    });
    expect(capturedMessages.at(-1)?.content).not.toContain('/no_think');
    expect(capturedMessages.at(-1)?.content).toContain('【检索资料】');
  });

  it('refuses privacy-boundary requests before retrieval', async () => {
    let embedCalled = false;
    let completeCalled = false;

    const result = await createAssistantAnswer(
      {
        message: '学校官方群号是多少',
      },
      {
        chunks: toRuntimeChunks([makeChunk()]),
        complete: async () => {
          completeCalled = true;
          return '不会执行';
        },
        embed: async () => {
          embedCalled = true;
          return [1, 0];
        },
      },
    );

    expect(result.answer).toContain('不能提供');
    expect(result.sources).toEqual([]);
    expect(embedCalled).toBe(false);
    expect(completeCalled).toBe(false);
  });

  it('returns a no-basis answer when retrieval has no relevant chunks', async () => {
    let completeCalled = false;

    const result = await createAssistantAnswer(
      {
        message: '奖学金怎么评',
      },
      {
        chunks: toRuntimeChunks([makeChunk()]),
        complete: async () => {
          completeCalled = true;
          return '不会执行';
        },
        embed: async () => [0, 1],
        minScore: 0.9,
      },
    );

    expect(result.answer).toContain('没有找到足够相关的依据');
    expect(result.sources).toEqual([]);
    expect(completeCalled).toBe(false);
  });

  it('falls back to a source excerpt when the model returns empty content', async () => {
    const result = await createAssistantAnswer(
      {
        message: '宿舍限电吗',
      },
      {
        chunks: toRuntimeChunks([makeChunk()]),
        complete: async () => '',
        embed: async () => [1, 0],
        minScore: 0,
      },
    );

    expect(result.answer).toContain('原文摘录');
    expect(result.answer).toContain('宿舍使用大功率电器可能跳闸');
    expect(result.sources[0]?.url).toBe('/start/faq');
  });

  it('fails clearly when query and index embedding dimensions differ', async () => {
    await expect(
      createAssistantAnswer(
        {
          message: '宿舍限电吗',
        },
        {
          chunks: toRuntimeChunks([makeChunk()]),
          complete: async () => '不会执行',
          embed: async () => [1, 0, 0],
          minScore: 0,
        },
      ),
    ).rejects.toMatchObject({
      code: 'embedding_dimension_mismatch',
      statusCode: 503,
    });
  });
});
