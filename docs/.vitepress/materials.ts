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
        resources: [
          {
            title: '2012级离散数学A卷',
            description: '2012级离散数学A卷汇总。',
            status: '已核验',
            files: [
              {
                title: '复习题',
                href: '/materials/discrete-mathematics/2012级离散数学A卷.pdf',
                format: 'PDF',
                role: '试卷',
              },
            ],
          },
          {
            title: '2013级离散数学A卷',
            description: '2013级离散数学A卷试题汇总。',
            status: '已核验',
            files: [
              {
                title: '2013级离散数学A卷',
                href: '/materials/discrete-mathematics/2013级离散数学A卷.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: '2013级离散数学A卷答案',
                href: '/materials/discrete-mathematics/2013级离散数学A卷参考答案及计分标准.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: '离散数学2019-2020学年第一学期期末试卷',
            description: '离散数学2019-2020学年第一学期期末试卷汇总。',
            status: '已核验',
            files: [
              {
                title: '期末试卷',
                href: '/materials/discrete-mathematics/离散数学2019-2020学年第一学期期末试卷.pdf',
                format: 'PDF',
                role: '试卷',
              },
            ],
          },
          {
            title: '2021秋离散数学复习题',
            description: '2021秋离散数学复习题汇总。',
            status: '已核验',
            files: [
              {
                title: '复习题',
                href: '/materials/discrete-mathematics/2021秋离散数学复习题.pdf',
                format: 'PDF',
                role: '试卷',
              },
            ],
          },
        ],
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
  'advanced-math': {
    title: '高等数学',
    directory: '/materials/advanced-math/',
    categories: [
      {
        title: '知识点笔记',
        description: '章节知识点、复习提纲和概念梳理。',
        resources: [
          {
            title: '高等数学复习要点',
            description: '高等数学上下复习要点汇总。',
            status: '已核验',
            files: [
              {
                title: '高等数学上复习要点',
                href: '/materials/advanced-math/高等数学上复习要点.pdf',
                format: 'PDF',
                role: '文档',
              },
              {
                title: '高等数学下复习要点',
                href: '/materials/advanced-math/高等数学下复习要点.pdf',
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
            title: '高等数学12级试卷',
            description: '高等数学12级试卷汇总。',
            status: '已核验',
            files: [
              {
                title: '高数试题A卷',
                href: '/materials/advanced-math/12级高数试题-A.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: '高数试题A卷答案',
                href: '/materials/advanced-math/12级高数-A-参考答案.pdf',
                format: 'PDF',
                role: '答案',
              },
              {
                title: '高数试题B卷',
                href: '/materials/advanced-math/12级高数试题-B.pdf',
                format: 'PDF',
                role: '试卷',
              },
            ],
          },
          {
            title: '高等数学A下册练习题',
            description: '高等数学A下册练习题汇总。',
            status: '已核验',
            files: [
              {
                title: '高数A下册练习题',
                href: '/materials/advanced-math/高数A下册练习题.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: '高数A下册答案',
                href: '/materials/advanced-math/高数A下册练习题(含答案).pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: '高等数学A练习试卷',
            description: '高等数学A练习试卷。',
            status: '已核验',
            files: [
              {
                title: '练习试卷',
                href: '/materials/advanced-math/高数A下练习试卷.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: '练习答案',
                href: '/materials/advanced-math/高数A下练习试卷_参考答案与详细解析.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: '高等数学A下册综合练习',
            description: '高等数学A下册综合练习汇总。',
            status: '已核验',
            files: [
              {
                title: '高数下册综合练习1',
                href: '/materials/advanced-math/高数下册综合练习1.pdf',
                format: 'PDF',
                role: '练习',
              },
              {
                title: '高数下册综合练习2',
                href: '/materials/advanced-math/高数下册综合练习2.pdf',
                format: 'PDF',
                role: '练习',
              },
            ],
          },
        ],
      },
    ],
  },
  c: {
    title: 'C语言程序设计',
    directory: '/materials/c/',
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
            title: 'C语言13级试卷',
            description: 'C语言13级试卷汇总。',
            status: '已核验',
            files: [
              {
                title: 'C语言A卷',
                href: '/materials/c/13级C语言试卷A卷.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言A卷答案',
                href: '/materials/c/13级C语言A卷答案.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: 'C语言试卷1',
            description: 'C语言试卷1汇总。',
            status: '已核验',
            files: [
              {
                title: 'C语言试卷1',
                href: '/materials/c/试题(A卷).pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言试卷1答案',
                href: '/materials/c/试题(A卷)答案及评分标准.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: 'C语言试卷2',
            description: 'C语言试卷2汇总。',
            status: '已核验',
            files: [
              {
                title: 'C语言试卷2',
                href: '/materials/c/试题(B卷).pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言试卷2答案',
                href: '/materials/c/试题(B卷)答案及评分标准.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: 'C语言试卷3',
            description: 'C语言试卷3汇总。',
            status: '已核验',
            files: [
              {
                title: 'C语言试卷3',
                href: '/materials/c/试题(C卷).pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言试卷3答案',
                href: '/materials/c/试题(C卷)答案及评分标准.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: 'C语言试卷4',
            description: 'C语言试卷4汇总。',
            status: '已核验',
            files: [
              {
                title: 'C语言试卷4',
                href: '/materials/c/试题(G卷).pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言试卷4答案',
                href: '/materials/c/试题(G卷)答案及评分标准.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: 'C语言试卷5',
            description: 'C语言试卷5汇总。',
            status: '已核验',
            files: [
              {
                title: 'C语言试卷5',
                href: '/materials/c/试题(H卷).pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言试卷5答案',
                href: '/materials/c/试题(H卷)答案及评分标准.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: 'C语言试卷6',
            description: 'C语言试卷6汇总。',
            status: '已核验',
            files: [
              {
                title: 'C语言试卷6',
                href: '/materials/c/试题(I卷).pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言试卷6答案',
                href: '/materials/c/试题(I卷)答案与评分标准.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: 'C语言试卷7',
            description: 'C语言试卷7汇总。',
            status: '已核验',
            files: [
              {
                title: 'C语言试卷7',
                href: '/materials/c/试题(K卷).pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言试卷7答案',
                href: '/materials/c/试题(K卷)答案及评分标准.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: 'C语言试卷8',
            description: 'C语言试卷8汇总。',
            status: '已核验',
            files: [
              {
                title: 'C语言试卷8',
                href: '/materials/c/试题(M卷).pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言试卷8答案',
                href: '/materials/c/试题(M卷)答案及评分标准.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: 'C语言试卷9',
            description: 'C语言试卷9汇总。',
            status: '已核验',
            files: [
              {
                title: 'C语言试卷9',
                href: '/materials/c/试题(N卷).pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言试卷9答案',
                href: '/materials/c/试题(N卷)答案及评分标准.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
        ],
      },
    ],
  },
  software: {
    title: '软件过程项目管理',
    directory: '/materials/software/',
    categories: [
      {
        title: '知识点笔记',
        description: '章节知识点、复习提纲和概念梳理。',
        resources: [
          {
            title: '软件过程项目管理复习要点',
            description: '软件过程项目管理复习要点汇总。',
            status: '已核验',
            files: [
              {
                title: '软件过程项目管理',
                href: '/materials/software/软件工程.pdf',
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
  physics: {
    title: '大学物理',
    directory: '/materials/physics/',
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
            title: '大学物理练习题',
            description: '大学物理练习题汇总，题册+答案',
            status: '已核验',
            files: [
              {
                title: '大学物理上册练习题',
                href: '/materials/physics/大学物理习题集上册.pdf',
                format: 'PDF',
                role: '练习题',
              },
              {
                title: '大学物理上册练习题（答案）',
                href: '/materials/physics/大学物理习题集上册_详细答案.pdf',
                format: 'PDF',
                role: '答案',
              },
              {
                title: '大学物理下册练习题',
                href: '/materials/physics/大学物理习题集下册.pdf',
                format: 'PDF',
                role: '练习题',
              },
              {
                title: '大学物理下册练习题（答案）',
                href: '/materials/physics/大学物理习题集下册_详细答案.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
        ],
      },
    ],
  },
  'linear-algebra': {
    title: '大学物理',
    directory: '/materials/linear-algebra/',
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
            title: '2025级线性代数期末复习大题',
            description: '2025级线性代数期末复习大题汇总',
            status: '已核验',
            files: [
              {
                title: '线代-同济-行列式',
                href: '/materials/linear-algebra/线代-同济-行列式.pdf',
                format: 'PDF',
                role: '课后习题',
              },
              {
                title: '线性代数-课-71页',
                href: '/materials/linear-algebra/线性代数-课-71页.pdf',
                format: 'PDF',
                role: '课后习题',
              },
              {
                title: '线性代数-课-163页',
                href: '/materials/linear-algebra/线性代数-课-163页.pdf',
                format: 'PDF',
                role: '课后习题',
              },
              {
                title: '线性代数-课-177页',
                href: '/materials/linear-algebra/线性代数-课-177页.pdf',
                format: 'PDF',
                role: '课后习题',
              },
              {
                title: '线性代数-课-188页',
                href: '/materials/linear-algebra/线性代数-课-188页.pdf',
                format: 'PDF',
                role: '课后习题',
              },
              {
                title: '线性代数-课-193页',
                href: '/materials/linear-algebra/线性代数-课-193页.pdf',
                format: 'PDF',
                role: '课后习题',
              },
            ],
          },
        ],
      },
    ],
  },
} satisfies Record<string, CourseMaterials>;
