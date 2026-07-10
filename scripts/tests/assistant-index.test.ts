import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildAssistantChunks,
  buildAssistantChunksForPage,
  cleanAssistantMarkdown,
  pageUrlFromFile,
  parseAssistantMarkdown,
} from '../assistant-index';

describe('assistant markdown index extraction', () => {
  it('uses only the top-level front matter as page metadata', () => {
    const docsRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'scswiki-assistant-index-'));
    const file = path.join(docsRoot, 'start', 'faq.md');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const raw = [
      '---',
      'title: 真实页面',
      'description: 真实描述',
      'category: start',
      'audience:',
      '  - 新生',
      'content_type: experience',
      'status: needs-review',
      'maintainers:',
      '  - SCSWiki 维护组',
      'sources: []',
      '---',
      '',
      '<ContentMeta />',
      '',
      '# 正文标题',
      '',
      '```markdown',
      '---',
      'title: 示例模板',
      'status: active',
      '---',
      '```',
    ].join('\n');

    const page = parseAssistantMarkdown(raw, file, docsRoot);

    expect(page?.title).toBe('真实页面');
    expect(page?.description).toBe('真实描述');
    expect(page?.status).toBe('needs-review');
    expect(page?.markdown).toContain('title: 示例模板');
  });

  it('creates stable clean URLs and chunk metadata', () => {
    const docsRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'scswiki-assistant-index-'));
    const file = path.join(docsRoot, 'study', 'index.md');
    const page = parseAssistantMarkdown(
      [
        '---',
        'title: 专业学习总览',
        'description: 学习路线',
        'category: study',
        'audience:',
        '  - 学生',
        'content_type: verified',
        'status: active',
        'maintainers:',
        '  - SCSWiki 维护组',
        'sources: []',
        '---',
        '',
        '# 专业学习总览',
        '',
        '先建立开发环境，再学习 C/C++ 和数据结构。',
      ].join('\n'),
      file,
      docsRoot,
    );

    expect(pageUrlFromFile(file, docsRoot)).toBe('/study/');
    expect(page).not.toBeNull();

    const chunks = buildAssistantChunksForPage(page!, {
      maxChars: 120,
      targetChars: 80,
    });

    expect(chunks[0]).toMatchObject({
      category: 'study',
      content_type: 'verified',
      status: 'active',
      title: '专业学习总览',
      url: '/study/',
    });
    expect(chunks[0].headingPath).toEqual(['专业学习总览']);
  });

  it('removes standalone Vue component tags from searchable text', () => {
    expect(
      cleanAssistantMarkdown('<ContentMeta />\n\n<MaterialResourceList course="c" />\n\n正文'),
    ).toBe('正文');
  });

  it('indexes only pages with active status', async () => {
    const docsRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'scswiki-assistant-index-'));
    const makePage = (title: string, status: 'active' | 'needs-review') =>
      [
        '---',
        `title: ${title}`,
        `description: ${title}描述`,
        'category: study',
        'audience:',
        '  - 学生',
        'content_type: verified',
        `status: ${status}`,
        'maintainers:',
        '  - SCSWiki 维护组',
        'sources: []',
        '---',
        '',
        `# ${title}`,
        '',
        `${title}正文。`,
      ].join('\n');

    fs.writeFileSync(path.join(docsRoot, 'active.md'), makePage('有效页面', 'active'));
    fs.writeFileSync(
      path.join(docsRoot, 'needs-review.md'),
      makePage('待核验页面', 'needs-review'),
    );

    const chunks = await buildAssistantChunks({ docsRoot });

    expect(chunks.map((chunk) => chunk.title)).toEqual(['有效页面']);
    expect(chunks.every((chunk) => chunk.status === 'active')).toBe(true);
  });
});
