import fs from 'node:fs/promises';
import path from 'node:path';
import { buildAssistantChunks, type AssistantIndex } from './assistant-index';

const embeddingEndpoint =
  process.env.SCS_ASSISTANT_EMBEDDING_URL ?? 'http://127.0.0.1:8081/v1/embeddings';
const embeddingModel = process.env.SCS_ASSISTANT_EMBEDDING_MODEL ?? 'bge-m3';
const outputPath = path.resolve(
  process.env.SCS_ASSISTANT_INDEX_OUT ??
    process.env.SCS_ASSISTANT_INDEX_PATH ??
    'assistant-data/scswiki-rag-index.json',
);

type EmbeddingResponse = {
  data?: Array<{
    embedding?: number[];
  }>;
  embedding?: number[];
};

async function createEmbedding(input: string) {
  const response = await fetchWithTimeout(embeddingEndpoint, {
    body: JSON.stringify({
      model: embeddingModel,
      input,
    }),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Embedding request failed: ${response.status} ${body}`);
  }

  const data = (await response.json()) as EmbeddingResponse;
  const embedding = data.data?.[0]?.embedding ?? data.embedding;

  if (!Array.isArray(embedding) || embedding.length === 0) {
    throw new Error('Embedding response did not include a vector.');
  }

  return embedding;
}

async function main() {
  const chunks = await buildAssistantChunks();
  const embeddedChunks = [];

  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];
    const embedding = await createEmbedding(chunk.text);
    embeddedChunks.push({
      ...chunk,
      embedding,
    });

    process.stdout.write(`Indexed ${index + 1}/${chunks.length}: ${chunk.title}\r`);
  }

  const assistantIndex: AssistantIndex = {
    version: 1,
    createdAt: new Date().toISOString(),
    embeddingModel,
    chunkCount: embeddedChunks.length,
    chunks: embeddedChunks,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(assistantIndex, null, 2)}\n`, 'utf8');
  process.stdout.write('\n');
  console.log(`Wrote ${embeddedChunks.length} assistant chunks to ${outputPath}.`);
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

await main();
