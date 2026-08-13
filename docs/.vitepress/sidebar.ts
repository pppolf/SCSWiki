import type { DefaultTheme } from 'vitepress';

export const sidebar: DefaultTheme.Sidebar = {
  '/start/': [
    {
      text: '新生专题',
      items: [
        { text: '2026 级新生报到', link: '/start/' },
        { text: '易班网上迎新', link: '/start/online-registration' },
        { text: '档案、组织关系与户口', link: '/start/records-and-household' },
        { text: '学杂费缴费', link: '/start/payment' },
        { text: '学生资助与助学贷款', link: '/start/financial-aid' },
        { text: '住宿物品与军训服装', link: '/start/accommodation' },
        { text: '报到安全', link: '/start/arrival-safety' },
        { text: '行署校区地图', link: '/start/xingshu-campus-map' },
        { text: '军训专题', link: '/start/jx' },
        { text: '作息安排', link: '/start/sh' },
        { text: '学院信息', link: '/start/info' },
        { text: '学院组织', link: '/start/org' },
        { text: '程序设计语言导览', link: '/start/programming-languages' },
        { text: '国（境）外交流', link: '/start/international-exchange' },
        { text: '常见问题', link: '/start/faq' },
      ],
    },
  ],
  '/study/': [
    {
      text: '专业学习',
      items: [
        { text: '总览', link: '/study/' },
        { text: 'C语言程序设计', link: '/study/c' },
        { text: 'C/C++ 入门', link: '/study/cpp-basics' },
        { text: 'Web 前端设计', link: '/study/web-frontend' },
        { text: '网络空间安全导论', link: '/study/cybersecurity-introduction' },
        { text: '计算思维', link: '/study/computational-thinking' },
        { text: '计算机基本技能', link: '/study/computer-basic-skills' },
        { text: '高等数学', link: '/study/advanced-mathematics' },
        { text: '线性代数', link: '/study/linear-algebra' },
        { text: '数据结构', link: '/study/ds' },
        { text: '离散数学', link: '/study/ls' },
        { text: '计算机组成原理', link: '/study/jz' },
        { text: '计算机网络', link: '/study/jw' },
        { text: '计算机操作系统', link: '/study/jc' },
      ],
    },
  ],
  '/development/': [
    {
      text: '开发专题',
      items: [
        { text: '总览', link: '/development/' },
        { text: 'Git 入门', link: '/development/git-basics' },
        { text: 'Linux 入门', link: '/development/linux-basics' },
        { text: '传统开发', link: '/development/tradition' },
        { text: 'AI赋能开发', link: '/development/ai' },
        { text: 'Agent开发', link: '/development/agent' },
      ],
    },
  ],
  '/competitions/': [
    {
      text: '学科竞赛',
      items: [
        { text: '总览', link: '/competitions/' },
        { text: '算法类竞赛', link: '/competitions/algorithm' },
        { text: '软件类竞赛', link: '/competitions/software' },
        { text: '电子类竞赛', link: '/competitions/electronic' },
        { text: '机器人竞赛', link: '/competitions/robot' },
        { text: '创新创业竞赛', link: '/competitions/cxcy' },
        { text: '师范生技能竞赛', link: '/competitions/normal' },
        { text: '数学类竞赛', link: '/competitions/math' },
      ],
    },
  ],
  '/campus/': [
    {
      text: '校园生活',
      items: [
        { text: '总览', link: '/campus/' },
        { text: '校园网络待核验模板', link: '/campus/network-template' },
        { text: '校园网络使用指南', link: '/campus/network' },
      ],
    },
  ],
  '/organization/': [
    {
      text: '学院组织',
      items: [
        { text: '简介', link: '/organization/' },
        { text: '学院领导班子', link: '/organization/ldbz' },
        { text: '两委会', link: '/organization/lwh' },
        { text: '学生社团', link: '/organization/xsst' },
        { text: '办公室/实验室', link: '/organization/lab' },
      ],
    },
  ],
  '/party/': [
    {
      text: '党建专题',
      items: [
        { text: '总览', link: '/party/' },
        { text: '入党流程', link: '/party/join' },
        { text: '评选制度', link: '/party/selection' },
      ],
    },
  ],
  '/teacher/': [
    {
      text: '老师专栏',
      items: [
        { text: '总览', link: '/teacher/' },
        { text: '教研室', link: '/teacher/jys' },
        { text: '学工团队', link: '/teacher/xgtd' },
        { text: '硕士生导师', link: '/teacher/ssds' },
        { text: '办公室/实验室', link: '/teacher/sys' },
        { text: '公共课', link: '/teacher/ggk' },
      ],
    },
  ],
  '/course/': [
    {
      text: '课程专栏',
      items: [
        { text: '总览', link: '/course/' },
        { text: '选课制度', link: '/course/xk' },
        { text: '计算机科学与技术（师范）', link: '/course/jk' },
        { text: '网络空间安全', link: '/course/wa' },
        { text: '软件工程', link: '/course/rg' },
      ],
    },
  ],
  '/materials/': [
    {
      text: '资料分享',
      items: [
        { text: '总览', link: '/materials/' },
        { text: '计算机组成原理', link: '/materials/computer-organization' },
        { text: '计算机网络原理', link: '/materials/computer-network' },
        { text: '数据库原理', link: '/materials/database-theory' },
        { text: '离散数学', link: '/materials/discrete-mathematics' },
        { text: '计算机操作系统', link: '/materials/computer-os' },
        { text: '高等数学', link: '/materials/advanced-math' },
        { text: 'C语言程序设计', link: '/materials/c' },
        { text: '软件过程项目管理', link: '/materials/software' },
        { text: '大学物理', link: '/materials/physics' },
        { text: '线性代数', link: '/materials/linear-algebra' },
        { text: 'Web前端程序设计', link: '/materials/web-frontend' },
        { text: 'Java Web应用开发', link: '/materials/javaweb' },
        { text: '单片机原理及应用', link: '/materials/microcontroller' },
        { text: '习近平新时代中国特色社会主义思想', link: '/materials/xjp' },
      ],
    },
  ],
  '/services/': [
    {
      text: '办事指南',
      items: [
        { text: '总览', link: '/services/' },
        { text: '体育课转修保健课', link: '/services/health-class' },
        { text: '奖助学金', link: '/services/scholarship' },
        { text: '保研（推荐免试研究生）', link: '/services/postgraduate' },
        { text: '卓越班', link: '/services/zyb' },
      ],
    },
  ],
  '/career/': [
    {
      text: '升学与就业',
      items: [
        { text: '总览', link: '/career/' },
        { text: '考研通用准备', link: '/career/postgraduate-exam' },
      ],
    },
  ],
  '/research/': [
    {
      text: '科研与实验室',
      items: [
        { text: '总览', link: '/research/' },
        { text: '实验室信息模板', link: '/research/lab-template' },
      ],
    },
  ],
  '/faq/': [
    {
      text: '常见问题',
      items: [
        { text: '总览', link: '/faq/' },
        { text: '内容纠错说明', link: '/faq/content-correction' },
      ],
    },
  ],
  '/about/': [
    {
      text: '关于与贡献',
      items: [
        { text: '项目介绍', link: '/about/' },
        { text: '使用说明', link: '/about/usage' },
        { text: '内容可信度说明', link: '/about/trust' },
        { text: '如何贡献', link: '/about/contribute' },
        { text: '隐私与内容边界', link: '/about/privacy-boundary' },
      ],
    },
  ],
  '/sponsor/': [
    {
      text: '赞助',
      items: [{ text: '简介', link: '/sponsor/' }],
    },
  ],
};
