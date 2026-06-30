export type MaterialFile = {
  title: string;
  href: string;
  format: string;
  role?: string;
};

export type MaterialResource = {
  title: string;
  description: string;
  status: string;
  files: MaterialFile[];
};

export type MaterialCategory = {
  title: string;
  description: string;
  resources: MaterialResource[];
};

export type CourseMaterials = {
  title: string;
  directory: string;
  categories: MaterialCategory[];
};

export const courseMaterials = {
  'computer-organization': {
    title: '计算机组成原理',
    directory: '/materials/computer-organization/',
    categories: [
      {
        title: '知识点笔记',
        description: '章节知识点、复习提纲和概念梳理。',
        resources: [],
      },
      {
        title: '实验资料',
        description: '实验答案、实验环境、实验报告参考结构和调试记录。',
        resources: [
          {
            title: '计算机组成原理头歌平台实验答案',
            description: '计算机组成原理头歌平台实验答案。',
            status: '已核验',
            files: [
              {
                title: '实验答案',
                href: '/materials/computer-organization/计算机组成原理.zip',
                format: 'ZIP',
                role: '实验',
              },
            ],
          },
        ],
      },
      {
        title: '试题资料',
        description: '试卷、练习题和对应答案放在同一个资料组中。',
        resources: [
          {
            title: '2022 年计组复习题',
            description: '2022 年计算机组成原理复习题库。',
            status: '已核验',
            files: [
              {
                title: '复习题',
                href: '/materials/computer-organization/2022年计组复习题.pdf',
                format: 'PDF',
                role: '试题',
              },
            ],
          },
          {
            title: '计算机组成原理练习试卷',
            description: '计算机组成原理课程练习资料。',
            status: '已核验',
            files: [
              {
                title: '练习试卷',
                href: '/materials/computer-organization/计算机组成原理练习试卷.pdf',
                format: 'PDF',
                role: '试卷',
              },
            ],
          },
        ],
      },
    ],
  },
  'computer-network': {
    title: '计算机网络',
    directory: '/materials/computer-network/',
    categories: [
      {
        title: '知识点笔记',
        description: '章节知识点、复习提纲和概念梳理。',
        resources: [
          {
            title: '计算机网络原理复习文档',
            description: '计算机网络原理复习文档。',
            status: '已核验',
            files: [
              {
                title: '计算机网络原理复习文档',
                href: '/materials/computer-network/计算机网络原理复习文档.pdf',
                format: 'PDF',
                role: '文档',
              },
            ],
          },
        ],
      },
      {
        title: '实验资料',
        description: '实验答案、实验环境、实验报告参考结构和调试记录。',
        resources: [],
      },
      {
        title: '试题资料',
        description: '试卷、练习题和对应答案放在同一个资料组中。',
        resources: [
          {
            title: '计算机网络原理题库',
            description: '计算机网络原理复习题库。',
            status: '已核验',
            files: [
              {
                title: '计算机网络原理题库',
                href: '/materials/computer-network/计网题库.pdf',
                format: 'PDF',
                role: '题库',
              },
            ],
          },
        ],
      },
    ],
  },
  'database-theory': {
    title: '数据库原理',
    directory: '/materials/database-theory/',
    categories: [
      {
        title: '知识点笔记',
        description: '章节知识点、复习提纲和概念梳理。',
        resources: [],
      },
      {
        title: '实验资料',
        description: '实验答案、实验环境、实验报告参考结构和调试记录。',
        resources: [],
      },
      {
        title: '试题资料',
        description: '试卷、练习题和对应答案放在同一个资料组中。',
        resources: [
          {
            title: '2024 级数据库原理期末试题',
            description: '软件工程专业数据库原理期末试题。',
            status: '已核验',
            files: [
              {
                title: '期末试题',
                href: '/materials/database-theory/A-2024-软件工程-数据库原理-期末试题.pdf',
                format: 'PDF',
                role: '试卷',
              },
            ],
          },
        ],
      },
    ],
  },
  'discrete-mathematics': {
    title: '离散数学',
    directory: '/materials/discrete-mathematics/',
    categories: [
      {
        title: '知识点笔记',
        description: '章节知识点、复习提纲和概念梳理。',
        resources: [
          {
            title: '离散数学资料',
            description: '离散数学课程学习资料。',
            status: '已核验',
            files: [
              {
                title: '学习资料',
                href: '/materials/discrete-mathematics/离散数学.pdf',
                format: 'PDF',
                role: '文档',
              },
            ],
          },
        ],
      },
      {
        title: '实验资料',
        description: '实验答案、实验环境、实验报告参考结构和调试记录。',
        resources: [],
      },
      {
        title: '试题资料',
        description: '试卷、练习题和对应答案放在同一个资料组中。',
        resources: [],
      },
    ],
  },
  'computer-os': {
    title: '计算机操作系统',
    directory: '/materials/computer-os/',
    categories: [
      {
        title: '知识点笔记',
        description: '章节知识点、复习提纲和概念梳理。',
        resources: [
          {
            title: '计算机操作系统考点重点',
            description: '计算机操作系统考点重点资料。',
            status: '已核验',
            files: [
              {
                title: '考点重点资料',
                href: '/materials/computer-os/操作系统考点重点.pdf',
                format: 'PDF',
                role: '文档',
              },
            ],
          },
        ],
      },
      {
        title: '实验资料',
        description: '实验答案、实验环境、实验报告参考结构和调试记录。',
        resources: [],
      },
      {
        title: '试题资料',
        description: '试卷、练习题和对应答案放在同一个资料组中。',
        resources: [],
      },
    ],
  },
} satisfies Record<string, CourseMaterials>;
