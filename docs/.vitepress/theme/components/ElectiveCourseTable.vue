<script setup lang="ts">
import { computed, ref } from 'vue';
import { withBase } from 'vitepress';
import electiveData from '../../data/electives-2025-2026-2.json';

type Course = {
  number: number;
  name: string;
  code: string;
  credits: number | string;
  platform: string;
  school: string;
  teacher: string;
  description: string;
  campus: string;
  type: string;
  url: string;
};

const allOption = '全部';
const courses = electiveData.courses as Course[];
const query = ref('');
const typeFilter = ref(allOption);
const campusFilter = ref(allOption);

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

const typeOptions = computed(() => [allOption, ...unique(courses.map((course) => course.type))]);
const campusOptions = computed(() => [
  allOption,
  ...unique(courses.map((course) => course.campus)),
]);

const onlineCount = computed(() => courses.filter((course) => course.type === '线上').length);
const offlineCount = computed(() => courses.filter((course) => course.type === '线下').length);

const filteredCourses = computed(() => {
  const keyword = query.value.trim().toLowerCase();

  return courses.filter((course) => {
    const matchesType = typeFilter.value === allOption || course.type === typeFilter.value;
    const matchesCampus = campusFilter.value === allOption || course.campus === campusFilter.value;
    const text = [
      course.name,
      course.code,
      course.platform,
      course.school,
      course.teacher,
      course.campus,
      course.description,
    ]
      .join(' ')
      .toLowerCase();

    return matchesType && matchesCampus && (!keyword || text.includes(keyword));
  });
});
</script>

<template>
  <section class="elective-course-panel" aria-labelledby="elective-course-title">
    <div class="elective-course-panel__header">
      <div>
        <p class="elective-course-panel__kicker">{{ electiveData.term }}</p>
        <h2 id="elective-course-title">通识教育选修课开课信息</h2>
        <p>
          数据来自教务处通知附件
          1，本站仅做字段清洗和查询展示；选课、上课时间地点和最终名单以教务系统为准。
        </p>
      </div>
      <a class="elective-course-panel__download" :href="withBase(electiveData.localDownloadPath)">
        下载原始 XLSX
      </a>
    </div>

    <div class="elective-course-stats" aria-label="开课统计">
      <div>
        <strong>{{ courses.length }}</strong>
        <span>全部课程</span>
      </div>
      <div>
        <strong>{{ onlineCount }}</strong>
        <span>线上课程</span>
      </div>
      <div>
        <strong>{{ offlineCount }}</strong>
        <span>线下课程</span>
      </div>
    </div>

    <div class="elective-course-controls">
      <label>
        <span>搜索</span>
        <input v-model="query" type="search" placeholder="课程名 / 代码 / 平台 / 学校 / 负责人" />
      </label>
      <label>
        <span>授课类型</span>
        <select v-model="typeFilter">
          <option v-for="option in typeOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label>
      <label>
        <span>校区</span>
        <select v-model="campusFilter">
          <option v-for="option in campusOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label>
    </div>

    <p class="elective-course-panel__result">
      当前显示 {{ filteredCourses.length }} / {{ courses.length }} 门课程。
    </p>

    <div v-if="filteredCourses.length > 0" class="elective-course-table-wrap">
      <table class="elective-course-table">
        <thead>
          <tr>
            <th>课程</th>
            <th>代码 / 学分</th>
            <th>类型</th>
            <th>平台 / 开课学校</th>
            <th>校区</th>
            <th>课程简介</th>
            <th>入口</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in filteredCourses" :key="course.number">
            <td>
              <strong>{{ course.name || '（原表未填写）' }}</strong>
              <span v-if="!course.name" class="elective-course-table__muted"
                >官方附件未填写课程名称</span
              >
            </td>
            <td>
              <span>{{ course.code || '未填写' }}</span>
              <span class="elective-course-table__muted">{{ course.credits }} 学分</span>
            </td>
            <td>
              <span class="elective-course-table__tag">{{ course.type }}</span>
            </td>
            <td>
              <span>{{ course.platform || '线下课程' }}</span>
              <span class="elective-course-table__muted">{{
                course.school || '本校线下开课'
              }}</span>
            </td>
            <td>{{ course.campus || '未填写' }}</td>
            <td>
              <details class="elective-course-desc">
                <summary>查看简介</summary>
                <p>{{ course.description || '官方附件未填写课程简介。' }}</p>
              </details>
            </td>
            <td>
              <a v-if="course.url" :href="course.url" target="_blank" rel="noreferrer">课程页</a>
              <span v-else class="elective-course-table__muted">无线上入口</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="elective-course-panel__empty">没有匹配的课程。换个关键词或筛选条件试试。</p>
  </section>
</template>

<style scoped>
.elective-course-panel {
  border: 1px solid var(--scs-line);
  border-radius: 6px;
  margin: 22px 0 30px;
  overflow: hidden;
}

.elective-course-panel__header {
  align-items: flex-start;
  background: var(--scs-soft-bg);
  display: flex;
  gap: 16px;
  justify-content: space-between;
  padding: 16px;
}

.elective-course-panel__header h2 {
  border: 0;
  margin: 0;
  padding: 0;
}

.elective-course-panel__header p {
  color: var(--scs-muted);
  margin: 8px 0 0;
}

.elective-course-panel__kicker {
  color: var(--scs-active) !important;
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 6px !important;
}

.elective-course-panel__download {
  border: 1px solid var(--scs-line);
  border-radius: 4px;
  flex: 0 0 auto;
  padding: 7px 10px;
  text-decoration: none;
}

.elective-course-stats {
  display: grid;
  gap: 1px;
  grid-template-columns: repeat(3, 1fr);
  background: var(--scs-line);
}

.elective-course-stats div {
  background: var(--vp-c-bg);
  padding: 12px 16px;
}

.elective-course-stats strong,
.elective-course-stats span {
  display: block;
}

.elective-course-stats strong {
  color: var(--scs-text);
  font-size: 24px;
  line-height: 1.2;
}

.elective-course-stats span {
  color: var(--scs-muted);
  font-size: 13px;
}

.elective-course-controls {
  display: grid;
  gap: 12px;
  grid-template-columns: minmax(220px, 1fr) minmax(130px, 180px) minmax(130px, 180px);
  padding: 16px;
}

.elective-course-controls label {
  color: var(--scs-muted);
  display: grid;
  font-size: 13px;
  font-weight: 700;
  gap: 6px;
}

.elective-course-controls input,
.elective-course-controls select {
  background: var(--vp-c-bg);
  border: 1px solid var(--scs-line);
  border-radius: 4px;
  color: var(--scs-text);
  font: inherit;
  min-height: 36px;
  padding: 6px 9px;
}

.elective-course-panel__result,
.elective-course-panel__empty {
  color: var(--scs-muted);
  margin: 0;
  padding: 0 16px 16px;
}

.elective-course-table-wrap {
  border-top: 1px solid var(--scs-line);
  overflow-x: auto;
}

.elective-course-table {
  min-width: 980px;
}

.elective-course-table th,
.elective-course-table td {
  vertical-align: top;
}

.elective-course-table td:nth-child(1) {
  width: 220px;
}

.elective-course-table td:nth-child(4) {
  width: 190px;
}

.elective-course-table td:nth-child(6) {
  width: 250px;
}

.elective-course-table strong,
.elective-course-table span {
  display: block;
}

.elective-course-table__muted {
  color: var(--scs-muted);
  font-size: 13px;
  margin-top: 4px;
}

.elective-course-table__tag {
  background: color-mix(in srgb, var(--scs-active), transparent 88%);
  border-radius: 999px;
  color: var(--scs-active);
  display: inline-block !important;
  font-size: 13px;
  font-weight: 700;
  padding: 2px 9px;
}

.elective-course-desc summary {
  color: var(--scs-active);
  cursor: pointer;
  font-weight: 700;
}

.elective-course-desc p {
  color: var(--scs-text);
  margin: 8px 0 0;
}

@media (max-width: 720px) {
  .elective-course-panel__header {
    display: grid;
  }

  .elective-course-panel__download {
    justify-self: start;
  }

  .elective-course-stats,
  .elective-course-controls {
    grid-template-columns: 1fr;
  }
}
</style>
