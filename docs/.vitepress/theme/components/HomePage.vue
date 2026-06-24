<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { withBase } from 'vitepress';

type Contributor = {
  avatar_url: string;
  contributions?: number;
  html_url: string;
  login: string;
};

const repositoryUrl = 'https://github.com/pppolf/SCSWiki';
const contributorsUrl = `${repositoryUrl}/graphs/contributors`;
const fallbackContributors: Contributor[] = [
  {
    avatar_url: 'https://github.com/pppolf.png?size=96',
    html_url: 'https://github.com/pppolf',
    login: 'pppolf',
  },
];

const contributors = ref<Contributor[]>(fallbackContributors);

const visibleContributors = computed(() => contributors.value.slice(0, 8));

onMounted(async () => {
  try {
    const response = await fetch(
      'https://api.github.com/repos/pppolf/SCSWiki/contributors?per_page=8',
      {
        headers: {
          Accept: 'application/vnd.github+json',
        },
      },
    );

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
      <div class="scs-hero-copy">
        <div class="scs-kicker">非官方 · 学生维护 · 来源优先</div>
        <h1 id="home-title">SCSWiki</h1>
        <p>
          面向西华师范大学计算机学院学生的知识库。这里沉淀可复用的学习路径、开发工具、竞赛实践和内容核验模板，让新生、在读同学与维护者更快找到可靠起点。
        </p>
        <div class="scs-actions" aria-label="主要入口">
          <a class="scs-button primary" :href="withBase('/start/')">新生从这里开始</a>
          <a class="scs-button secondary" :href="withBase('/about/trust')">查看可信度说明</a>
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
      </div>
    </section>

    <section class="scs-metrics" aria-label="站点维护原则">
      <div>
        <strong>4 类内容</strong>
        <span>官方来源、已核验、学生经验、历史归档</span>
      </div>
      <div>
        <strong>0 隐私泄露</strong>
        <span>不公开个人联系方式、学号、群号和内部链接</span>
      </div>
      <div>
        <strong>定期复核</strong>
        <span>页面保留核验日期、建议复核时间和维护者</span>
      </div>
    </section>

    <section class="scs-section" aria-labelledby="content-title">
      <div class="scs-section-heading">
        <span>Knowledge Map</span>
        <div id="content-title" class="scs-heading-title" role="heading" aria-level="2">
          常用内容入口
        </div>
      </div>

      <div class="scs-grid" aria-label="内容分类">
        <a class="scs-card featured" :href="withBase('/start/')">
          <span class="scs-hot-badge">Hot</span>
          <span class="scs-card-index">01</span>
          <strong>新生专题🔥</strong>
          <span>从信息核验、学习准备和常见问题开始。</span>
        </a>
        <a class="scs-card" :href="withBase('/study/')">
          <span class="scs-card-index">02</span>
          <strong>专业学习</strong>
          <span>沉淀通用学习方法和课程外基础能力。</span>
        </a>
        <a class="scs-card" :href="withBase('/development/')">
          <span class="scs-card-index">03</span>
          <strong>开发环境</strong>
          <span>整理 Git、Linux、编辑器等通用工具。</span>
        </a>
        <a class="scs-card" :href="withBase('/competitions/')">
          <span class="scs-card-index">04</span>
          <strong>竞赛实践</strong>
          <span>提供算法竞赛与项目实践的入门路径。</span>
        </a>
        <a class="scs-card" :href="withBase('/research/lab-template')">
          <span class="scs-card-index">05</span>
          <strong>科研实验室</strong>
          <span>提供待核验模板，不虚构招收规则。</span>
        </a>
        <a class="scs-card" :href="withBase('/campus/')">
          <span class="scs-card-index">06</span>
          <strong>校园生活</strong>
          <span>学校特定信息需来源核验后再发布。</span>
        </a>
        <a class="scs-card" :href="withBase('/services/')">
          <span class="scs-card-index">07</span>
          <strong>办事指南</strong>
          <span>流程类内容默认待核验并要求正式来源。</span>
        </a>
        <a class="scs-card" :href="withBase('/career/')">
          <span class="scs-card-index">08</span>
          <strong>升学就业</strong>
          <span>记录通用准备事项和资料边界。</span>
        </a>
        <a class="scs-card" :href="withBase('/faq/content-correction')">
          <span class="scs-card-index">09</span>
          <strong>问题反馈</strong>
          <span>说明如何反馈错误、过期和缺失内容。</span>
        </a>
      </div>
    </section>
  </main>
</template>
