import type { DefaultTheme } from 'vitepress';

export const sidebar: DefaultTheme.Sidebar = {
  '/start/': [
    {
      text: '新生专题',
      items: [
        { text: '新生报到', link: '/start/' },
        { text: '军训专题', link: '/start/military-training'},
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
        { text: 'C/C++ 入门', link: '/study/cpp-basics' },
      ],
    },
  ],
  '/development/': [
    {
      text: '开发环境',
      items: [
        { text: '总览', link: '/development/' },
        { text: 'Git 入门', link: '/development/git-basics' },
        { text: 'Linux 入门', link: '/development/linux-basics' },
      ],
    },
  ],
  '/competitions/': [
    {
      text: '竞赛与实践',
      items: [
        { text: '总览', link: '/competitions/' },
        { text: '算法竞赛入门', link: '/competitions/algorithm' },
      ],
    },
  ],
  '/research/': [
    {
      text: '科研与实验室',
      items: [{ text: '信息模板', link: '/research/lab-template' }],
    },
  ],
  '/campus/': [
    {
      text: '校园生活',
      items: [
        { text: '总览', link: '/campus/' },
        { text: '校园网络待核验模板', link: '/campus/network-template' },
      ],
    },
  ],
  '/services/': [
    {
      text: '办事指南',
      items: [{ text: '总览', link: '/services/' }],
    },
  ],
  '/career/': [
    {
      text: '升学与就业',
      items: [{ text: '总览', link: '/career/' }],
    },
  ],
  '/faq/': [
    {
      text: '常见问题',
      items: [{ text: '内容纠错说明', link: '/faq/content-correction' }],
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
};
