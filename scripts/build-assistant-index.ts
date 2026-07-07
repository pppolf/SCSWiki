import fs from 'node:fs/promises';
import path from 'node:path';
import {
  buildAssistantChunks,
  type AssistantIndex,
  type EmbeddedAssistantChunk,
} from './assistant-index';
import { createEmbeddingClient } from '../assistant-api/src/model-client';

const embeddingEndpoint =
  process.env.SCS_ASSISTANT_EMBEDDING_URL ??
  'https://dashscope.aliyuncs.com/compatible-mode/v1/embeddings';
const embeddingModel = process.env.SCS_ASSISTANT_EMBEDDING_MODEL ?? 'text-embedding-v4';
const embeddingApiKey = process.env.SCS_ASSISTANT_EMBEDDING_API_KEY ?? '';
const embeddingDimensions = readNumberEnv('SCS_ASSISTANT_EMBEDDING_DIMENSIONS', 1024);
const embeddingBatchSize = Math.min(readNumberEnv('SCS_ASSISTANT_EMBEDDING_BATCH_SIZE', 10), 10);
const outputPath = path.resolve(
  process.env.SCS_ASSISTANT_INDEX_OUT ??
    process.env.SCS_ASSISTANT_INDEX_PATH ??
    'assistant-data/scswiki-rag-index.json',
);
const embeddingClient = createEmbeddingClient({
  apiKey: embeddingApiKey,
  batchSize: embeddingBatchSize,
  dimensions: embeddingDimensions,
  endpoint: embeddingEndpoint,
  model: embeddingModel,
});

async function main() {
  const chunks = await buildAssistantChunks();
  const embeddedChunks: EmbeddedAssistantChunk[] = [];

  for (let index = 0; index < chunks.length; index += embeddingBatchSize) {
    const batch = chunks.slice(index, index + embeddingBatchSize);
    const embeddings = await embeddingClient.embedBatch(batch.map((chunk) => chunk.text));

    batch.forEach((chunk, offset) => {
      const embedding = embeddings[offset];

      if (!embedding) {
        throw new Error(`Embedding response missed chunk ${index + offset + 1}.`);
      }

      embeddedChunks.push({
        ...chunk,
        embedding,
      });
    });

    process.stdout.write(
      `Indexed ${Math.min(index + batch.length, chunks.length)}/${chunks.length}: ${batch.at(-1)?.title ?? ''}\r`,
    );
  }

  const assistantIndex: AssistantIndex = {
    version: 1,
    createdAt: new Date().toISOString(),
    embeddingDimensions,
    embeddingModel,
    chunkCount: embeddedChunks.length,
    chunks: embeddedChunks,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(assistantIndex, null, 2)}\n`, 'utf8');
  process.stdout.write('\n');
  console.log(`Wrote ${embeddedChunks.length} assistant chunks to ${outputPath}.`);
}

function readNumberEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

await main();
