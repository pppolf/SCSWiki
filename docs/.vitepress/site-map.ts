export type SiteSectionLink = {
  href: string;
  title: string;
};

export type SiteSection = {
  activeMatch: string;
  description: string;
  index: string;
  links: SiteSectionLink[];
  primaryHref: string;
  title: string;
};

export const siteSections: SiteSection[] = [
  {
    activeMatch: '^/start/',
    description: '从报到准备到入学适应，按新生真实任务组织信息。',
    index: '01',
    links: [
      { href: '/start/', title: '新生总览' },
      { href: '/start/online-registration', title: '报到与迎新' },
      { href: '/start/payment', title: '学杂费缴费' },
      { href: '/start/financial-aid', title: '学生资助' },
      { href: '/start/faq', title: '新生问答' },
    ],
    primaryHref: '/start/',
    title: '新生指南',
  },
  {
    activeMatch: '^/(study|course|materials)/',
    description: '整合专业学习、培养方案、选课与课程资料。',
    index: '02',
    links: [
      { href: '/study/', title: '专业学习' },
      { href: '/course/', title: '培养方案与选课' },
      { href: '/materials/', title: '课程资料' },
    ],
    primaryHref: '/study/',
    title: '学业与课程',
  },
  {
    activeMatch: '^/(competitions|development|research|career)/',
    description: '连接竞赛、开发、科研实践与升学就业。',
    index: '03',
    links: [
      { href: '/competitions/', title: '学科竞赛' },
      { href: '/development/', title: '开发与工具' },
      { href: '/research/', title: '科研与项目' },
      { href: '/career/', title: '升学与就业' },
    ],
    primaryHref: '/competitions/',
    title: '成长与实践',
  },
  {
    activeMatch: '^/(campus|services|party)/',
    description: '集中校园生活、日常办事和党团事务入口。',
    index: '04',
    links: [
      { href: '/campus/', title: '校园生活' },
      { href: '/services/', title: '办事指南' },
      { href: '/party/', title: '党团事务' },
    ],
    primaryHref: '/campus/',
    title: '校园与办事',
  },
  {
    activeMatch: '^/(organization|teacher)/',
    description: '查询学院概况、组织架构与教师课程参考。',
    index: '05',
    links: [
      { href: '/organization/', title: '学院概况与组织' },
      { href: '/teacher/', title: '教师专栏' },
    ],
    primaryHref: '/organization/',
    title: '学院信息',
  },
  {
    activeMatch: '^/(about|faq|sponsor)/',
    description: '了解内容边界，并参与纠错、贡献和赞助。',
    index: '06',
    links: [
      { href: '/about/', title: '项目介绍' },
      { href: '/about/trust', title: '可信度与内容边界' },
      { href: '/about/contribute', title: '参与贡献' },
      { href: '/faq/', title: '帮助与纠错' },
      { href: '/sponsor/', title: '赞助鸣谢' },
    ],
    primaryHref: '/about/',
    title: '关于本站',
  },
];
