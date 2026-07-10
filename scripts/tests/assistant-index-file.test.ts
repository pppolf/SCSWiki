import { describe, expect, it } from 'vitest';
import { prepareAssistantIndex, type AssistantIndexFile } from '../../assistant-api/src/index-file';

function makeIndex(overrides: Partial<AssistantIndexFile> = {}): AssistantIndexFile {
  return {
    chunkCount: 1,
    chunks: [
      {
        category: 'campus',
        content_type: 'verified',
        description: '说明',
        embedding: [1, 0],
        file: 'docs/start/faq.md',
        headingPath: ['常见问题'],
        id: 'chunk-1',
        sources: [],
        status: 'active',
        text: '正文',
        title: '常见问题',
        url: '/start/faq',
      },
    ],
    createdAt: '2026-07-07T00:00:00.000Z',
    embeddingDimensions: 2,
    embeddingModel: 'text-embedding-v4',
    version: 1,
    ...overrides,
  };
}

describe('assistant index validation', () => {
  it('accepts an index built with the configured embedding model and dimensions', () => {
    const result = prepareAssistantIndex(makeIndex(), {
      expectedEmbeddingDimensions: 2,
      expectedEmbeddingModel: 'text-embedding-v4',
    });

    expect(result.error).toBeNull();
    expect(result.chunks).toHaveLength(1);
    expect(result.info.embeddingDimensions).toBe(2);
  });

  it('rejects an index built with a different embedding model', () => {
    const result = prepareAssistantIndex(makeIndex({ embeddingModel: 'bge-m3' }), {
      expectedEmbeddingDimensions: 2,
      expectedEmbeddingModel: 'text-embedding-v4',
    });

    expect(result.error?.code).toBe('index_embedding_model_mismatch');
    expect(result.chunks).toEqual([]);
  });

  it('rejects an index with different embedding dimensions', () => {
    const result = prepareAssistantIndex(makeIndex({ embeddingDimensions: 3 }), {
      expectedEmbeddingDimensions: 2,
      expectedEmbeddingModel: 'text-embedding-v4',
    });

    expect(result.error?.code).toBe('index_embedding_dimensions_mismatch');
    expect(result.chunks).toEqual([]);
  });

  it('drops non-active chunks when loading an existing index', () => {
    const activeChunk = makeIndex().chunks[0];
    const result = prepareAssistantIndex(
      makeIndex({
        chunkCount: 2,
        chunks: [
          activeChunk,
          {
            ...activeChunk,
            id: 'chunk-needs-review',
            status: 'needs-review',
            text: '这段内容不应进入检索。',
          },
        ],
      }),
      {
        expectedEmbeddingDimensions: 2,
        expectedEmbeddingModel: 'text-embedding-v4',
      },
    );

    expect(result.error).toBeNull();
    expect(result.chunks.map((chunk) => chunk.id)).toEqual(['chunk-1']);
  });
});
