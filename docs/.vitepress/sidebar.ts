import type { DefaultTheme } from 'vitepress';

export const sidebar: DefaultTheme.Sidebar = {
  '/start/': [
    {
      text: '新生专题',
      items: [
        { text: '新生报到', link: '/start/' },
        { text: '军训专题', link: '/start/jx' },
        { text: '作息安排', link: '/start/sh' },
        { text: '学院信息', link: '/start/info' },
        { text: '学院组织', link: '/start/org' },
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
        { text: '辅导员', link: '/teacher/fdy' },
        { text: '硕士生导师', link: '/teacher/ssds' },
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
        { text: '专业课', link: '/course/zyk' },
        { text: '公共课', link: '/course/ggk' },
      ],
    },
  ],
  '/services/': [
    {
      text: '办事指南',
      items: [
        { text: '总览', link: '/services/' },
        { text: '奖助学金', link: '/services/scholarship' },
        { text: '保研', link: '/services/postgraduate' },
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
