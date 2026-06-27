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
      <div class="scs-hero-copy">
        <div class="scs-kicker">非官方 · 学生维护 · 来源优先</div>
        <h1 id="home-title">SCSWiki</h1>
        <p>
          SCSWiki
          是一个学生维护的非官方西华师范大学计算机学院知识库，目标是把可复用的学习经验、工具入门、内容模板和贡献规范整理到一个可搜索、可审阅、可持续维护的地方，让新生、在读同学更快找到可靠起点。
        </p>
        <p>
          本站不代表学校或学院立场。任何涉及政策、流程、时间、人员、联系方式、课程规则或奖助认定的信息，都必须回到学校或学院公开正式通知核验。了解更多请加入QQ群：1036399266。
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
        <span>不公开个人联系方式、学号和内部链接</span>
      </div>
      <div>
        <strong>定期复核</strong>
        <span>页面会定期核验内容和维护者</span>
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
        <a class="scs-card" :href="withBase('/competitions/')">
          <span class="scs-card-index">03</span>
          <strong>学科竞赛</strong>
          <span>汇总计算机学院支持参加的学科竞赛。</span>
        </a>
        <a class="scs-card" :href="withBase('/organization/')">
          <span class="scs-card-index">04</span>
          <strong>学院组织</strong>
          <span>学院各组织详细介绍，信息来源计算机学院官网。</span>
        </a>
        <a class="scs-card" :href="withBase('/party/')">
          <span class="scs-card-index">05</span>
          <strong>党建专题</strong>
          <span>关于入党方面的问题。</span>
        </a>
        <a class="scs-card" :href="withBase('/campus/')">
          <span class="scs-card-index">06</span>
          <strong>校园生活</strong>
          <span>学校特定信息需来源核验后再发布。</span>
        </a>
        <a class="scs-card" :href="withBase('/teacher/')">
          <span class="scs-card-index">07</span>
          <strong>老师专题</strong>
          <span>关于各科老师的评价。</span>
        </a>
        <a class="scs-card" :href="withBase('/course/')">
          <span class="scs-card-index">08</span>
          <strong>课程专题</strong>
          <span>学院的课程建设制度。</span>
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
