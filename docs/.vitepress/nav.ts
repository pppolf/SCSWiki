import type { DefaultTheme } from 'vitepress';

export const nav: DefaultTheme.NavItem[] = [
  { text: '首页', link: '/' },
  { text: '新生专题', link: '/start/', activeMatch: '^/start/' },
  { text: '专业学习', link: '/study/', activeMatch: '^/study/' },
  { text: '学科竞赛', link: '/competitions/', activeMatch: '^/competitions/' },
  { text: '学院组织', link: '/organization/', activeMatch: '^/organization/' },
  { text: '老师专栏', link: '/teacher/', activeMatch: '^/teacher/' },
  { text: '课程专栏', link: '/course/', activeMatch: '^/course/' },
  { text: '资料分享', link: '/materials/', activeMatch: '^/materials/' },
  { text: '党建专题', link: '/party/', activeMatch: '^/party/' },
  { text: '办事指南', link: '/services/', activeMatch: '^/services/' },
  { text: '校园生活', link: '/campus/', activeMatch: '^/campus/' },
  { text: '关于与贡献', link: '/about/', activeMatch: '^/about/' },
  { text: '常见问题', link: '/faq/', activeMatch: '^/faq/' },
  { text: '赞助', link: '/sponsor/', activeMatch: '^/sponsor/' },
];
