<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { withBase } from 'vitepress';

type Contributor = {
  avatar_url: string;
  contributions?: number;
  html_url: string;
  login: string;
};

type HomeLink = {
  badge?: string;
  description: string;
  featured?: boolean;
  href: string;
  index?: string;
  title: string;
};

type JourneyGroup = {
  description: string;
  links: Pick<HomeLink, 'href' | 'title'>[];
  title: string;
};

const repositoryUrl = 'https://github.com/pppolf/SCSWiki';
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

const heroMetrics = [
  {
    label: '学校相关内容先看公开正式来源',
    value: '来源优先',
  },
  {
    label: '不展示个人联系方式、学号和内部链接',
    value: '隐私边界',
  },
  {
    label: '页面状态、维护者和来源可追踪',
    value: '可维护',
  },
];

const quickLinks: HomeLink[] = [
  {
    description: '入学准备、信息核验和常见问题',
    href: '/start/',
    title: '新生专题',
  },
  {
    description: '期末资料、复习材料与使用边界',
    href: '/materials/',
    title: '资料分享',
  },
  {
    description: '内容可信度、隐私和维护规则',
    href: '/about/trust',
    title: '可信度说明',
  },
];

const journeyGroups: JourneyGroup[] = [
  {
    description: '先解决信息核验、入学准备和校园生活的基础问题。',
    links: [
      { href: '/start/', title: '新生总览' },
      { href: '/start/faq', title: '新生常见问题' },
      { href: '/campus/', title: '校园生活' },
    ],
    title: '刚入学',
  },
  {
    description: '围绕课程、基础能力和资料，把学习路线先搭起来。',
    links: [
      { href: '/study/', title: '专业学习' },
      { href: '/course/', title: '课程专题' },
      { href: '/materials/', title: '课程资料' },
    ],
    title: '要学习',
  },
  {
    description: '查竞赛、发展方向、工具入门和长期能力建设。',
    links: [
      { href: '/competitions/', title: '学科竞赛' },
      { href: '/development/', title: '开发入门' },
      { href: '/career/', title: '发展规划' },
    ],
    title: '想拓展',
  },
  {
    description: '发现错误、过期信息或缺少页面时，按维护流程反馈。',
    links: [
      { href: '/faq/content-correction', title: '问题反馈' },
      { href: '/about/contribute', title: '参与贡献' },
      { href: '/about/privacy-boundary', title: '隐私边界' },
    ],
    title: '要修正',
  },
];

const contentCards: HomeLink[] = [
  {
    badge: '推荐',
    description: '从信息核验、学习准备和常见问题开始。',
    featured: true,
    href: '/start/',
    index: '01',
    title: '新生专题',
  },
  {
    description: '沉淀通用学习方法、课程外基础能力和工具入门。',
    href: '/study/',
    index: '02',
    title: '专业学习',
  },
  {
    description: '汇总适合同学参考的竞赛入口、方向和经验。',
    href: '/competitions/',
    index: '03',
    title: '学科竞赛',
  },
  {
    description: '整理学院组织相关介绍，学校特定信息以公开来源为准。',
    href: '/organization/',
    index: '04',
    title: '学院组织',
  },
  {
    description: '入党流程、材料和注意事项，需按正式通知核验。',
    href: '/party/',
    index: '05',
    title: '党建专题',
  },
  {
    description: '课程复习材料的分享入口，并保留版权和适用边界。',
    href: '/materials/',
    index: '06',
    title: '课程资料分享',
  },
  {
    description: '授课相关信息入口，区分公开资料、经验和待核验内容。',
    href: '/teacher/',
    index: '07',
    title: '老师专栏',
  },
  {
    description: '课程建设、选课和公共课等与培养相关的整理。',
    href: '/course/',
    index: '08',
    title: '课程专题',
  },
  {
    description: '奖助、升学等办事信息入口，优先链接正式来源。',
    href: '/services/',
    index: '09',
    title: '办事指南',
  },
  {
    description: '网络、生活和校园使用经验的待核验整理。',
    href: '/campus/',
    index: '10',
    title: '校园生活',
  },
  {
    description: '反馈错误、过期内容、缺失资料和来源问题。',
    href: '/faq/content-correction',
    index: '11',
    title: '问题反馈',
  },
  {
    description: '了解项目规则，并通过 Issue 或 Pull Request 参与维护。',
    href: '/about/contribute',
    index: '12',
    title: '参与贡献',
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
            面向西华师范大学计算机学院学生的非官方知识库，把学习经验、资料入口、办事说明和贡献规范整理成可搜索、可审阅、可持续维护的文档。
          </p>
          <p class="scs-hero-support">
            本站不代表学校或学院立场。涉及政策、流程、时间、人员、联系方式、课程规则或奖助认定的信息，请以学校或学院公开正式通知为准。了解更多请加入
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
            <a class="scs-button ghost" :href="withBase('/about/trust')">可信度说明</a>
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

    <section class="scs-metrics" aria-label="站点维护原则">
      <div v-for="metric in heroMetrics" :key="metric.value">
        <strong>{{ metric.value }}</strong>
        <span>{{ metric.label }}</span>
      </div>
    </section>

    <section class="scs-section scs-section--journey" aria-labelledby="journey-title">
      <div class="scs-section-heading">
        <span>Find by Situation</span>
        <h2 id="journey-title">按当前问题找入口</h2>
      </div>

      <div class="scs-journey-grid">
        <section v-for="group in journeyGroups" :key="group.title" class="scs-journey">
          <div>
            <strong>{{ group.title }}</strong>
            <p>{{ group.description }}</p>
          </div>
          <div class="scs-journey-links">
            <a v-for="link in group.links" :key="link.href" :href="withBase(link.href)">
              {{ link.title }}
            </a>
          </div>
        </section>
      </div>
    </section>

    <section class="scs-section" aria-labelledby="content-title">
      <div class="scs-section-heading">
        <span>Knowledge Map</span>
        <h2 id="content-title">常用内容入口</h2>
      </div>

      <div class="scs-grid" aria-label="内容分类">
        <a
          v-for="card in contentCards"
          :key="card.href"
          class="scs-card"
          :class="{ featured: card.featured }"
          :href="withBase(card.href)"
        >
          <span class="scs-card-topline">
            <span class="scs-card-index">{{ card.index }}</span>
            <span v-if="card.badge" class="scs-card-badge">{{ card.badge }}</span>
          </span>
          <strong>{{ card.title }}</strong>
          <span>{{ card.description }}</span>
        </a>
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
