import { toRuntimeChunks, type IndexedChunk, type RuntimeChunk } from './rag';

export type AssistantIndexFile = {
  version: 1;
  createdAt: string;
  embeddingDimensions?: number;
  embeddingModel: string;
  chunkCount: number;
  chunks: IndexedChunk[];
};

export type AssistantIndexInfo = Omit<AssistantIndexFile, 'chunks'> & {
  embeddingDimensions: number | null;
};

export type AssistantIndexError = {
  code: string;
  message: string;
};

export type AssistantIndexExpectations = {
  expectedEmbeddingDimensions: number;
  expectedEmbeddingModel: string;
};

export function prepareAssistantIndex(
  index: AssistantIndexFile,
  expectations: AssistantIndexExpectations,
): {
  chunks: RuntimeChunk[];
  error: AssistantIndexError | null;
  info: AssistantIndexInfo;
} {
  const chunks = toRuntimeChunks(index.chunks.filter((chunk) => chunk.status === 'active'));
  const actualDimensions = inferEmbeddingDimensions(index, chunks);
  const info: AssistantIndexInfo = {
    chunkCount: index.chunkCount,
    createdAt: index.createdAt,
    embeddingDimensions: actualDimensions,
    embeddingModel: index.embeddingModel,
    version: index.version,
  };
  const dimensions = new Set(chunks.map((chunk) => chunk.embedding.length));

  if (index.version !== 1) {
    return {
      chunks: [],
      error: {
        code: 'index_version_unsupported',
        message: `Assistant index version ${index.version} is not supported.`,
      },
      info,
    };
  }

  if (index.embeddingModel !== expectations.expectedEmbeddingModel) {
    return {
      chunks: [],
      error: {
        code: 'index_embedding_model_mismatch',
        message:
          `Assistant index was built with ${index.embeddingModel}, ` +
          `but the API expects ${expectations.expectedEmbeddingModel}. Run pnpm assistant:index again.`,
      },
      info,
    };
  }

  if (dimensions.size > 1) {
    return {
      chunks: [],
      error: {
        code: 'index_embedding_dimensions_inconsistent',
        message: 'Assistant index contains embeddings with inconsistent dimensions.',
      },
      info,
    };
  }

  if (actualDimensions !== null && actualDimensions !== expectations.expectedEmbeddingDimensions) {
    return {
      chunks: [],
      error: {
        code: 'index_embedding_dimensions_mismatch',
        message:
          `Assistant index uses ${actualDimensions}-dimensional embeddings, ` +
          `but the API expects ${expectations.expectedEmbeddingDimensions}. Run pnpm assistant:index again.`,
      },
      info,
    };
  }

  return {
    chunks,
    error: null,
    info,
  };
}

function inferEmbeddingDimensions(index: AssistantIndexFile, chunks: RuntimeChunk[]) {
  if (typeof index.embeddingDimensions === 'number' && index.embeddingDimensions > 0) {
    return index.embeddingDimensions;
  }

  return chunks[0]?.embedding.length ?? null;
}
