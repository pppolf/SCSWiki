export type ChatRole = 'assistant' | 'user';

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ModelMessage =
  | ChatMessage
  | {
      role: 'system';
      content: string;
    };

export type RagSource = {
  name: string;
  url: string;
};

export type IndexedChunk = {
  id: string;
  file: string;
  url: string;
  title: string;
  description: string;
  category: string;
  content_type: string;
  status: string;
  sources: RagSource[];
  headingPath: string[];
  text: string;
  embedding: number[];
};

export type RuntimeChunk = IndexedChunk & {
  norm: number;
};

export type ScoredChunk = RuntimeChunk & {
  score: number;
};

export type AssistantAnswerSource = {
  title: string;
  url: string;
  content_type: string;
  status: string;
  score: number;
  headingPath: string[];
  warnings: string[];
  sources: RagSource[];
};

export type AssistantAnswer = {
  answer: string;
  sources: AssistantAnswerSource[];
  warnings: string[];
};

export type CreateAssistantAnswerInput = {
  message: string;
  history?: unknown;
};

export type CreateAssistantAnswerDeps = {
  chunks: RuntimeChunk[];
  complete(messages: ModelMessage[]): Promise<string>;
  embed(input: string): Promise<number[]>;
  maxHistoryMessages?: number;
  maxMessageChars?: number;
  minScore?: number;
  topK?: number;
};

export type PrepareAssistantGenerationDeps = Omit<CreateAssistantAnswerDeps, 'complete'>;

export type PreparedAssistantGeneration = {
  chunks: ScoredChunk[];
  earlyAnswer?: AssistantAnswer;
  modelMessages: ModelMessage[];
  sources: AssistantAnswerSource[];
  warnings: string[];
};

const defaultMaxMessageChars = 500;
const defaultMaxHistoryMessages = 4;
const defaultTopK = 6;
const defaultMinScore = 0.15;

export class AssistantInputError extends Error {
  readonly code: string;
  readonly statusCode: number;

  constructor(code: string, message: string, statusCode = 400) {
    super(message);
    this.name = 'AssistantInputError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class AssistantDependencyError extends Error {
  readonly code: string;
  readonly statusCode: number;

  constructor(code: string, message: string, statusCode = 502) {
    super(message);
    this.name = 'AssistantDependencyError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export async function createAssistantAnswer(
  input: CreateAssistantAnswerInput,
  deps: CreateAssistantAnswerDeps,
): Promise<AssistantAnswer> {
  const prepared = await prepareAssistantGeneration(input, deps);

  if (prepared.earlyAnswer) {
    return prepared.earlyAnswer;
  }

  let answer: string;

  try {
    answer = sanitizeModelAnswer(await deps.complete(prepared.modelMessages));
  } catch {
    throw new AssistantDependencyError('model_unavailable', '生成模型服务暂时不可用。');
  }

  if (!answer) {
    answer = buildExtractiveFallback(prepared.chunks);
  }

  return {
    answer: formatAnswerWithWarnings(answer, prepared.warnings),
    sources: prepared.sources,
    warnings: prepared.warnings,
  };
}

export async function prepareAssistantGeneration(
  input: CreateAssistantAnswerInput,
  deps: PrepareAssistantGenerationDeps,
): Promise<PreparedAssistantGeneration> {
  const message = validateMessage(input.message, deps.maxMessageChars ?? defaultMaxMessageChars);
  const history = sanitizeHistory(
    input.history,
    deps.maxHistoryMessages ?? defaultMaxHistoryMessages,
  );
  const privacyReason = findPrivacyBoundaryReason(message);

  if (privacyReason) {
    return {
      chunks: [],
      earlyAnswer: {
        answer:
          `这个问题可能涉及${privacyReason}，SCSWiki 助手不能提供、猜测或整理这类信息。` +
          '请以学校或学院公开发布的正式渠道为准。',
        sources: [],
        warnings: ['隐私与内容边界：不提供真实个人联系方式、群号、学号或内部系统链接。'],
      },
      modelMessages: [],
      sources: [],
      warnings: ['隐私与内容边界：不提供真实个人联系方式、群号、学号或内部系统链接。'],
    };
  }

  let queryEmbedding: number[];

  try {
    queryEmbedding = await deps.embed(message);
  } catch {
    throw new AssistantDependencyError('embedding_unavailable', '向量检索服务暂时不可用。');
  }

  const chunks = selectTopChunks(queryEmbedding, deps.chunks, {
    limit: deps.topK ?? defaultTopK,
    minScore: deps.minScore ?? defaultMinScore,
  });

  if (chunks.length === 0) {
    return {
      chunks: [],
      earlyAnswer: {
        answer: '我在 SCSWiki 当前 Markdown 索引里没有找到足够相关的依据，暂时不能确定。',
        sources: [],
        warnings: [],
      },
      modelMessages: [],
      sources: [],
      warnings: [],
    };
  }

  const prompt = buildUserPrompt(message, chunks);
  const modelMessages: ModelMessage[] = [
    {
      role: 'system',
      content: systemPrompt,
    },
    ...history,
    {
      role: 'user',
      content: `/no_think\n\n${prompt}`,
    },
  ];
  const warnings = unique(chunks.flatMap((chunk) => buildTrustWarnings(chunk)));

  return {
    chunks,
    modelMessages,
    sources: buildAnswerSources(chunks),
    warnings,
  };
}

export function toRuntimeChunks(chunks: IndexedChunk[]) {
  return chunks
    .filter((chunk) => Array.isArray(chunk.embedding) && chunk.embedding.length > 0)
    .map((chunk) => ({
      ...chunk,
      norm: vectorNorm(chunk.embedding),
    }))
    .filter((chunk) => chunk.norm > 0);
}

export function selectTopChunks(
  queryEmbedding: number[],
  chunks: RuntimeChunk[],
  options: { limit: number; minScore: number },
) {
  return chunks
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding, chunk.norm),
    }))
    .filter((chunk) => chunk.score >= options.minScore)
    .sort((left, right) => right.score - left.score)
    .slice(0, options.limit);
}

export function cosineSimilarity(left: number[], right: number[], rightNorm = vectorNorm(right)) {
  if (left.length === 0 || right.length === 0 || left.length !== right.length) {
    return 0;
  }

  const leftNorm = vectorNorm(left);

  if (leftNorm === 0 || rightNorm === 0) {
    return 0;
  }

  let dot = 0;

  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
  }

  return dot / (leftNorm * rightNorm);
}

export function buildTrustWarnings(chunk: Pick<IndexedChunk, 'content_type' | 'status'>) {
  const warnings: string[] = [];

  if (chunk.content_type === 'experience') {
    warnings.push('引用了学生经验内容，不应视为学校正式规定');
  }

  if (chunk.status === 'needs-review') {
    warnings.push('引用了待核验页面，关键信息需要结合公开来源确认');
  }

  if (chunk.status === 'draft') {
    warnings.push('引用了草稿页面，内容可能尚未完成');
  }

  if (chunk.status === 'archived' || chunk.content_type === 'archived') {
    warnings.push('引用了归档内容，不应作为当前依据');
  }

  return warnings;
}

export function findPrivacyBoundaryReason(message: string) {
  const normalized = message.replace(/\s+/g, '');
  const patterns: Array<[RegExp, string]> = [
    [
      /(手机号|手机号码|电话号码|联系方式|微信号|QQ号|群号|学号|身份证号)/i,
      '个人联系方式或身份信息',
    ],
    [/(内部系统链接|内网链接|教务系统链接|后台地址|登录地址)/i, '内部系统链接'],
    [/(老师|教师|辅导员|同学|学生).{0,8}(电话|微信|QQ|手机号|联系方式)/i, '个人联系方式'],
    [
      /(官方群|QQ群|微信群).{0,10}(多少|是什么|是啥|给我|发我|加入|号码|号)/i,
      '群号或非公开联系方式',
    ],
  ];

  return patterns.find(([pattern]) => pattern.test(normalized))?.[1] ?? null;
}

export function buildUserPrompt(message: string, chunks: ScoredChunk[]) {
  const context = chunks
    .map((chunk, index) => {
      const heading = chunk.headingPath.length > 0 ? chunk.headingPath.join(' / ') : chunk.title;
      const sourceText =
        chunk.sources.length > 0
          ? chunk.sources.map((source) => `${source.name} ${source.url}`).join('；')
          : '无公开来源记录';
      const warnings = buildTrustWarnings(chunk);
      const warningText = warnings.length > 0 ? warnings.join('；') : '无额外提醒';

      return [
        `【${index + 1}】${chunk.title}`,
        `页面：${chunk.url}`,
        `位置：${heading}`,
        `内容类型：${chunk.content_type}`,
        `页面状态：${chunk.status}`,
        `来源记录：${sourceText}`,
        `可信度提醒：${warningText}`,
        '摘录：',
        chunk.text,
      ].join('\n');
    })
    .join('\n\n---\n\n');

  return [
    '请只根据下面的【检索资料】回答用户问题。',
    '如果资料不足以回答，请直接说明 SCSWiki 当前没有足够依据，不要编造。',
    '回答末尾用短句提示用户查看引用页面；不要提供真实个人联系方式、群号、学号或内部系统链接。',
    '',
    '【检索资料】',
    context,
    '',
    '【用户问题】',
    message,
  ].join('\n');
}

export function sanitizeHistory(history: unknown, maxHistoryMessages = defaultMaxHistoryMessages) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((message): message is ChatMessage => {
      if (!message || typeof message !== 'object') {
        return false;
      }

      const role = Reflect.get(message, 'role');
      const content = Reflect.get(message, 'content');
      return (role === 'assistant' || role === 'user') && typeof content === 'string';
    })
    .slice(-maxHistoryMessages)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, 800),
    }));
}

export function buildAnswerSources(chunks: ScoredChunk[]) {
  const sourcesByUrl = new Map<string, AssistantAnswerSource>();

  for (const chunk of chunks) {
    const existing = sourcesByUrl.get(chunk.url);

    if (existing && existing.score >= chunk.score) {
      continue;
    }

    sourcesByUrl.set(chunk.url, {
      title: chunk.title,
      url: chunk.url,
      content_type: chunk.content_type,
      status: chunk.status,
      score: Number(chunk.score.toFixed(3)),
      headingPath: chunk.headingPath,
      warnings: buildTrustWarnings(chunk),
      sources: chunk.sources,
    });
  }

  return [...sourcesByUrl.values()];
}

function validateMessage(message: unknown, maxChars: number) {
  if (typeof message !== 'string') {
    throw new AssistantInputError('invalid_message', 'message must be a string.');
  }

  const trimmed = message.trim();

  if (!trimmed) {
    throw new AssistantInputError('empty_message', 'message cannot be empty.');
  }

  if (trimmed.length > maxChars) {
    throw new AssistantInputError('message_too_long', `message cannot exceed ${maxChars} chars.`);
  }

  return trimmed;
}

export function sanitizeModelAnswer(answer: string) {
  return answer
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<\/?think>/gi, '')
    .trim();
}

export function formatAnswerWithWarnings(answer: string, warnings: string[]) {
  if (warnings.length === 0) {
    return answer;
  }

  return `可信度提醒：${warnings.join('；')}\n\n${answer}`;
}

export function buildExtractiveFallback(chunks: ScoredChunk[]) {
  if (chunks.length === 0) {
    return '模型暂时没有返回最终答案，请稍后再试。';
  }

  const excerpts: string[] = [];
  let totalLength = 0;

  for (const chunk of chunks.slice(0, 3)) {
    const heading = [chunk.title, ...chunk.headingPath].filter(Boolean).join(' / ');
    const text = chunk.text.trim();
    const next = `### ${heading}\n\n${text}`;

    if (totalLength + next.length > 2600 && excerpts.length > 0) {
      break;
    }

    excerpts.push(next);
    totalLength += next.length;
  }

  return [
    '模型暂时没有返回最终答案。我先给出 SCSWiki 中最相关的原文摘录供你参考：',
    '',
    excerpts.join('\n\n---\n\n'),
    '',
    '请结合下方来源页面继续核对完整上下文。',
  ].join('\n');
}

function vectorNorm(vector: number[]) {
  return Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
}

function unique(values: string[]) {
  return [...new Set(values)];
}

const systemPrompt = [
  '你是 SCSWiki 的公开智能助手，面向西华师范大学计算机学院学生。',
  '你必须优先保护内容可信度、隐私和可维护性。',
  '只根据本轮检索资料回答；资料不足时说不确定。',
  '学校政策、人员、联系方式、课程规则、办事流程等高风险内容必须保持谨慎。',
  '遇到学生经验、待核验、草稿或归档内容，要明确说明可信度边界。',
  '不要输出真实个人联系方式、群号、学号、手机号、内部系统链接或隐私信息。',
  '使用简体中文，语气直接、准确、面向学生。',
].join('\n');
