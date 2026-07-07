import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { type FrontMatter, validateFrontMatter } from './content-schema';

export type AssistantSource = {
  name: string;
  url: string;
};

export type AssistantPage = {
  file: string;
  url: string;
  title: string;
  description: string;
  category: FrontMatter['category'];
  content_type: FrontMatter['content_type'];
  status: FrontMatter['status'];
  sources: AssistantSource[];
  markdown: string;
};

export type AssistantChunk = Omit<AssistantPage, 'file' | 'markdown'> & {
  id: string;
  file: string;
  headingPath: string[];
  text: string;
};

export type EmbeddedAssistantChunk = AssistantChunk & {
  embedding: number[];
};

export type AssistantIndex = {
  version: 1;
  createdAt: string;
  embeddingDimensions?: number;
  embeddingModel: string;
  chunkCount: number;
  chunks: EmbeddedAssistantChunk[];
};

export type BuildChunksOptions = {
  docsRoot?: string;
  targetChars?: number;
  maxChars?: number;
};

type Section = {
  headingPath: string[];
  text: string;
};

const defaultTargetChars = 700;
const defaultMaxChars = 900;

export function pageUrlFromFile(file: string, docsRoot = path.resolve('docs')) {
  const relativePath = path.relative(docsRoot, file).split(path.sep).join('/');
  const withoutExtension = relativePath.replace(/\.md$/i, '');

  if (withoutExtension === 'index') {
    return '/';
  }

  if (withoutExtension.endsWith('/index')) {
    return `/${withoutExtension.slice(0, -'/index'.length)}/`;
  }

  return `/${withoutExtension}`;
}

export function cleanAssistantMarkdown(markdown: string) {
  return markdown
    .replace(/^\s*<ContentMeta\s*\/>\s*$/gim, '')
    .replace(/^\s*<[A-Z][\w.-]*(?:\s+[^>]*)?\/>\s*$/gm, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function parseAssistantMarkdown(raw: string, file: string, docsRoot = path.resolve('docs')) {
  const parsed = matter(raw);

  if (parsed.data.meta_exempt === true) {
    return null;
  }

  const validation = validateFrontMatter(parsed.data);

  if (!validation.success) {
    const issues = validation.error.issues
      .map((issue) => `${issue.path.join('.') || 'frontmatter'}: ${issue.message}`)
      .join('; ');
    throw new Error(`${path.relative(process.cwd(), file)} has invalid front matter: ${issues}`);
  }

  const frontMatter = validation.data;
  const markdown = cleanAssistantMarkdown(parsed.content);

  if (!markdown) {
    return null;
  }

  return {
    file,
    url: pageUrlFromFile(file, docsRoot),
    title: frontMatter.title,
    description: frontMatter.description,
    category: frontMatter.category,
    content_type: frontMatter.content_type,
    status: frontMatter.status,
    sources: frontMatter.sources,
    markdown,
  } satisfies AssistantPage;
}

export async function findAssistantMarkdownFiles(docsRoot = path.resolve('docs')) {
  return fg('**/*.md', {
    absolute: true,
    cwd: docsRoot,
    ignore: ['.vitepress/**', '404.md'],
  });
}

export async function readAssistantPages(docsRoot = path.resolve('docs')) {
  const files = await findAssistantMarkdownFiles(docsRoot);
  const pages: AssistantPage[] = [];

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf8');
    const page = parseAssistantMarkdown(raw, file, docsRoot);

    if (page) {
      pages.push(page);
    }
  }

  return pages;
}

export function buildAssistantChunksForPage(
  page: AssistantPage,
  options: Pick<BuildChunksOptions, 'targetChars' | 'maxChars'> = {},
) {
  const targetChars = options.targetChars ?? defaultTargetChars;
  const maxChars = options.maxChars ?? defaultMaxChars;
  const sections = splitIntoSections(page.markdown);
  const chunks: AssistantChunk[] = [];

  sections.forEach((section) => {
    splitText(section.text, targetChars, maxChars).forEach((text, index) => {
      const headingPath = section.headingPath.length > 0 ? section.headingPath : [page.title];
      const contextTitle = [page.title, ...section.headingPath].filter(Boolean).join(' / ');
      const chunkText = `${contextTitle}\n${text}`.trim();
      const id = crypto
        .createHash('sha1')
        .update(`${page.url}:${headingPath.join('/')}:${index}:${chunkText}`)
        .digest('hex')
        .slice(0, 16);

      chunks.push({
        id,
        file: page.file,
        url: page.url,
        title: page.title,
        description: page.description,
        category: page.category,
        content_type: page.content_type,
        status: page.status,
        sources: page.sources,
        headingPath,
        text: chunkText,
      });
    });
  });

  return chunks;
}

export async function buildAssistantChunks(options: BuildChunksOptions = {}) {
  const docsRoot = options.docsRoot ?? path.resolve('docs');
  const pages = await readAssistantPages(docsRoot);
  return pages.flatMap((page) => buildAssistantChunksForPage(page, options));
}

function splitIntoSections(markdown: string) {
  const lines = markdown.split('\n');
  const sections: Section[] = [];
  const headingStack: string[] = [];
  let current: Section = { headingPath: [], text: '' };

  for (const line of lines) {
    const heading = /^(#{1,3})\s+(.+?)\s*$/.exec(line);

    if (heading) {
      pushSection(sections, current);
      const depth = heading[1].length;
      headingStack[depth - 1] = cleanHeadingText(heading[2]);
      headingStack.length = depth;
      current = {
        headingPath: headingStack.filter(Boolean),
        text: cleanHeadingText(heading[2]),
      };
      continue;
    }

    current.text += `${current.text ? '\n' : ''}${line}`;
  }

  pushSection(sections, current);
  return sections.length > 0 ? sections : [{ headingPath: [], text: markdown.trim() }];
}

function pushSection(sections: Section[], section: Section) {
  const text = normalizeWhitespace(section.text);

  if (text) {
    sections.push({
      headingPath: section.headingPath,
      text,
    });
  }
}

function cleanHeadingText(text: string) {
  return text
    .replace(/\s*\{#[^}]+\}\s*$/g, '')
    .replace(/[`*_~]/g, '')
    .replace(/\[(.*?)\]\([^)]*\)/g, '$1')
    .trim();
}

function normalizeWhitespace(text: string) {
  return text
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function splitText(text: string, targetChars: number, maxChars: number) {
  if (text.length <= maxChars) {
    return [text];
  }

  const chunks: string[] = [];
  const paragraphs = text.split(/\n{2,}/).map((paragraph) => paragraph.trim());
  let current = '';

  for (const paragraph of paragraphs) {
    if (!paragraph) {
      continue;
    }

    if (paragraph.length > maxChars) {
      if (current) {
        chunks.push(current);
        current = '';
      }

      chunks.push(...splitLongParagraph(paragraph, targetChars, maxChars));
      continue;
    }

    const next = current ? `${current}\n\n${paragraph}` : paragraph;

    if (next.length > maxChars && current.length >= Math.min(targetChars, maxChars)) {
      chunks.push(current);
      current = paragraph;
    } else {
      current = next;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks.length > 0 ? chunks : [text.slice(0, maxChars)];
}

function splitLongParagraph(paragraph: string, targetChars: number, maxChars: number) {
  const chunks: string[] = [];
  const sentences = paragraph
    .split(/(?<=[。！？!?；;])\s*/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  let current = '';

  for (const sentence of sentences) {
    const next = current ? `${current}${sentence}` : sentence;

    if (next.length > maxChars && current.length >= Math.min(targetChars, maxChars)) {
      chunks.push(current);
      current = sentence;
    } else {
      current = next;
    }
  }

  if (current) {
    chunks.push(current);
  }

  if (chunks.some((chunk) => chunk.length > maxChars)) {
    return hardSplit(paragraph, maxChars);
  }

  return chunks.length > 0 ? chunks : hardSplit(paragraph, maxChars);
}

function hardSplit(text: string, maxChars: number) {
  const chunks: string[] = [];

  for (let index = 0; index < text.length; index += maxChars) {
    chunks.push(text.slice(index, index + maxChars));
  }

  return chunks;
}
