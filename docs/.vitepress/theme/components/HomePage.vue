<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { withBase } from 'vitepress';
import { siteSections } from '../../site-map';

type Contributor = {
  avatar_url: string;
  contributions?: number;
  html_url: string;
  login: string;
};

type HomeLink = {
  description: string;
  href: string;
  title: string;
};

const repositoryUrl = 'https://github.com/CWNU-Open-Source-Community/SCSWiki';
const contributorsUrl = `${repositoryUrl}/graphs/contributors`;
const qqGroupNumber = '1036399266';
const qqGroupUrl = 'https://qm.qq.com/q/GKen4KYYaC';
const fallbackContributors: Contributor[] = [
  {
    avatar_url: 'https://github.com/pppolf.png?size=96',
    html_url: 'https://github.com/pppolf',
    login: 'pppolf',
  },
];

const contributors = ref<Contributor[]>(fallbackContributors);

const quickLinks: HomeLink[] = [
  {
    description: '报到准备、缴费资助与新生问答',
    href: '/start/',
    title: '新生报到',
  },
  {
    description: '培养方案、选课与课程建设信息',
    href: '/course/',
    title: '培养方案与选课',
  },
  {
    description: '课程复习材料与资料使用边界',
    href: '/materials/',
    title: '课程资料',
  },
];

const trustItems = [
  {
    description: '涉及政策、流程、时间、人员、联系方式、课程规则等内容，不把学生经验写成正式规定。',
    title: '高风险信息先核验',
  },
  {
    description: '缺少可靠来源时，页面应保留为 needs-review 或模板状态，等待公开资料补齐。',
    title: '待核验内容明确标记',
  },
  {
    description: '不公开真实个人联系方式、学号、手机号、群号、内部系统链接或隐私信息。',
    title: '隐私信息不进入页面',
  },
];

const visibleContributors = computed(() => contributors.value.slice(0, 8));

const openSearch = () => {
  if (typeof document === 'undefined') {
    return;
  }

  const searchButton = document.querySelector<HTMLElement>('.DocSearch-Button');
  searchButton?.click();
};

onMounted(async () => {
  try {
    const response = await fetch(withBase('/contributors.json'));

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as Contributor[];
    if (Array.isArray(data) && data.length > 0) {
      contributors.value = data.filter((item) => item.login && item.avatar_url && item.html_url);
    }
  } catch {
    contributors.value = fallbackContributors;
  }
});
</script>

<template>
  <main class="scs-home">
    <section class="scs-home-hero" aria-labelledby="home-title">
      <div class="scs-home-hero__inner">
        <div class="scs-hero-copy">
          <div class="scs-kicker">非官方 · 学生维护 · 来源优先</div>
          <h1 id="home-title">SCSWiki</h1>
          <p class="scs-hero-lead">
            西华师范大学计算机学院学生维护的非官方知识库，按六类快速查资料、办事务。
          </p>
          <p class="scs-hero-support">
            政策与流程请以学校或学院公开通知为准。交流与反馈：
            <a
              class="scs-qq-group-link"
              :href="qqGroupUrl"
              :aria-label="`通过 QQ 加入交流群 ${qqGroupNumber}`"
              title="点击通过 QQ 加入群"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673"
                />
              </svg>
              QQ群：{{ qqGroupNumber }}
            </a>
            。
          </p>
          <div class="scs-actions" aria-label="主要入口">
            <button class="scs-button primary" type="button" @click="openSearch">搜索文档</button>
            <a class="scs-button secondary" :href="withBase('/start/')">新生入口</a>
          </div>
        </div>

        <aside class="scs-hero-panel" aria-label="常用入口">
          <img class="scs-hero-mark" :src="withBase('/logo.svg')" alt="" aria-hidden="true" />
          <div class="scs-panel-label">常用入口</div>
          <div class="scs-quick-list">
            <a
              v-for="item in quickLinks"
              :key="item.href"
              class="scs-quick-link"
              :href="withBase(item.href)"
            >
              <strong>{{ item.title }}</strong>
              <span>{{ item.description }}</span>
            </a>
          </div>
          <a class="scs-panel-link" :href="withBase('/faq/content-correction')">
            反馈错误或过期内容
          </a>
        </aside>
      </div>
    </section>

    <section
      id="site-map"
      class="scs-section scs-section--site-map"
      aria-labelledby="content-title"
    >
      <div class="scs-section-heading scs-section-heading--split">
        <div>
          <span>Explore SCSWiki</span>
          <h2 id="content-title">先选一类，再找具体内容</h2>
        </div>
        <p>常用内容都归入以下六类；也可以用顶部搜索直接定位页面。</p>
      </div>

      <div class="scs-grid" aria-label="六类内容入口">
        <article
          v-for="section in siteSections"
          :key="section.primaryHref"
          class="scs-card"
          :class="{ featured: section.index === '01' }"
        >
          <span class="scs-card-topline">
            <span class="scs-card-index" aria-hidden="true">{{ section.index }}</span>
          </span>
          <a class="scs-card-heading" :href="withBase(section.primaryHref)">
            <strong>{{ section.title }}</strong>
            <span class="scs-card-arrow" aria-hidden="true">→</span>
          </a>
          <p class="scs-card-description">{{ section.description }}</p>
          <nav class="scs-card-links" :aria-label="`${section.title}子栏目`">
            <a v-for="link in section.links" :key="link.href" :href="withBase(link.href)">
              {{ link.title }}
            </a>
          </nav>
        </article>
      </div>
    </section>

    <section class="scs-section scs-section--trust" aria-labelledby="trust-title">
      <div class="scs-section-heading">
        <span>Trust Boundary</span>
        <h2 id="trust-title">把可信度写在页面里</h2>
      </div>

      <div class="scs-trust-grid">
        <div v-for="item in trustItems" :key="item.title" class="scs-trust-item">
          <strong>{{ item.title }}</strong>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </section>

    <section class="scs-community-section" aria-label="开源维护">
      <div class="scs-community-copy">
        <span>Open Source</span>
        <strong>由同学持续维护，也欢迎你修正它。</strong>
        <p>
          发现内容错误、来源缺失或页面过期时，可以通过仓库 Issue、Pull Request
          或页面底部编辑入口参与维护。
        </p>
      </div>
      <div class="scs-github-strip" aria-label="GitHub 贡献者">
        <span>Contributors</span>
        <a
          v-for="contributor in visibleContributors"
          :key="contributor.login"
          class="scs-avatar-link"
          :href="contributor.html_url"
          :aria-label="`${contributor.login} 的 GitHub 主页`"
          :title="`${contributor.login}${contributor.contributions ? ` · ${contributor.contributions} commits` : ''}`"
        >
          <img :src="contributor.avatar_url" :alt="contributor.login" />
        </a>
        <a class="scs-repo-link" :href="contributorsUrl">查看 GitHub 贡献者</a>
        <a class="scs-repo-link subtle" :href="repositoryUrl">仓库</a>
      </div>
    </section>
  </main>
</template>
