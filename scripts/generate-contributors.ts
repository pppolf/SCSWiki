import { access, mkdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

type GitHubContributor = {
  avatar_url?: string;
  contributions?: number;
  html_url?: string;
  login?: string;
};

type Contributor = {
  avatar_url: string;
  contributions?: number;
  html_url: string;
  login: string;
};

const repository = process.env.GITHUB_REPOSITORY ?? 'pppolf/SCSWiki';
const outputPath = path.join(process.cwd(), 'docs', 'public', 'contributors.json');
const apiUrl = `https://api.github.com/repos/${repository}/contributors?per_page=8`;

function normalizeContributors(items: GitHubContributor[]): Contributor[] {
  return items
    .filter(
      (
        item,
      ): item is Required<Pick<GitHubContributor, 'avatar_url' | 'html_url' | 'login'>> &
        GitHubContributor => Boolean(item.avatar_url && item.html_url && item.login),
    )
    .map((item) => ({
      avatar_url: item.avatar_url,
      contributions: item.contributions,
      html_url: item.html_url,
      login: item.login,
    }));
}

async function hasExistingOutput() {
  try {
    await access(outputPath);
    return true;
  } catch {
    return false;
  }
}

async function generateContributors() {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'SCSWiki contributor generator',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(apiUrl, { headers });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub contributors request failed: ${response.status} ${body}`);
  }

  const data = (await response.json()) as GitHubContributor[];
  const contributors = normalizeContributors(data);

  if (contributors.length === 0) {
    throw new Error('GitHub contributors response did not contain usable contributor data');
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(`${outputPath}.tmp`, `${JSON.stringify(contributors, null, 2)}\n`, 'utf8');
  await rename(`${outputPath}.tmp`, outputPath);
}

try {
  await generateContributors();
  console.log(`Generated ${outputPath}`);
} catch (error) {
  if (await hasExistingOutput()) {
    console.warn(error instanceof Error ? error.message : error);
    console.warn(`Keeping existing ${outputPath}`);
  } else {
    throw error;
  }
}
