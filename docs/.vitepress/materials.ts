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
            title: '华科计算机组成原理实验参考资源',
            description: '包含 MIPS CPU、单总线 CPU、存储系统和运算器设计等实验参考文件。',
            status: '待核验',
            files: [
              {
                title: '实验参考资源包',
                href: '/materials/computer-organization/hust-experiment-resources.zip',
                format: 'ZIP',
                role: '实验参考',
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
                href: '/materials/computer-organization/review-questions-2022.pdf',
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
                href: '/materials/computer-organization/practice-exam.pdf',
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
    title: '计算机网络原理',
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
                href: '/materials/computer-network/review-notes.pdf',
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
                href: '/materials/computer-network/question-bank.pdf',
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
                href: '/materials/database-theory/software-engineering-2024-cohort-exam-a.pdf',
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
            title: '2012级离散数学 A 卷',
            description: '2012级离散数学 A 卷。',
            status: '已核验',
            files: [
              {
                title: '2012级离散数学 A 卷',
                href: '/materials/discrete-mathematics/exam-2012-cohort-a.pdf',
                format: 'PDF',
                role: '试卷',
              },
            ],
          },
          {
            title: '2013级离散数学 A 卷',
            description: '2013级离散数学 A 卷及评分标准。',
            status: '已核验',
            files: [
              {
                title: '2013级离散数学 A 卷',
                href: '/materials/discrete-mathematics/exam-2013-cohort-a.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: '2013级离散数学 A 卷评分标准',
                href: '/materials/discrete-mathematics/exam-2013-cohort-a-answer.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: '离散数学 2019-2020 学年第一学期期末试卷',
            description: '离散数学 2019-2020 学年第一学期期末试卷。',
            status: '已核验',
            files: [
              {
                title: '期末试卷',
                href: '/materials/discrete-mathematics/final-exam-2019-2020-1.pdf',
                format: 'PDF',
                role: '试卷',
              },
            ],
          },
          {
            title: '2021年春季离散数学复习题',
            description: '2021年春季离散数学期末复习题。',
            status: '已核验',
            files: [
              {
                title: '2021年春季复习题',
                href: '/materials/discrete-mathematics/review-questions-2021-spring.pdf',
                format: 'PDF',
                role: '练习题',
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
                href: '/materials/computer-os/exam-review-notes.pdf',
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
                href: '/materials/advanced-math/review-notes-volume-1.pdf',
                format: 'PDF',
                role: '文档',
              },
              {
                title: '高等数学下复习要点',
                href: '/materials/advanced-math/review-notes-volume-2.pdf',
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
            title: '2012级高等数学试卷',
            description: '2012级高等数学 A、B 卷及 A 卷参考答案。',
            status: '已核验',
            files: [
              {
                title: '高等数学 A 卷',
                href: '/materials/advanced-math/exam-2012-cohort-a.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: '高等数学 A 卷参考答案',
                href: '/materials/advanced-math/exam-2012-cohort-a-answer.pdf',
                format: 'PDF',
                role: '答案',
              },
              {
                title: '高等数学 B 卷',
                href: '/materials/advanced-math/exam-2012-cohort-b.pdf',
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
                href: '/materials/advanced-math/calculus-a-volume-2-exercises.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: '高数A下册答案',
                href: '/materials/advanced-math/calculus-a-volume-2-exercises-with-answers.pdf',
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
                href: '/materials/advanced-math/calculus-a-volume-2-practice-exam.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: '练习答案',
                href: '/materials/advanced-math/calculus-a-volume-2-practice-exam-answer.pdf',
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
                href: '/materials/advanced-math/calculus-volume-2-comprehensive-exercises-01.pdf',
                format: 'PDF',
                role: '练习',
              },
              {
                title: '高数下册综合练习2',
                href: '/materials/advanced-math/calculus-volume-2-comprehensive-exercises-02.pdf',
                format: 'PDF',
                role: '练习',
              },
            ],
          },
          {
            title: '高等数学期末模拟练习',
            description: '高等数学期末模拟练习汇总。',
            status: '已核验',
            files: [
              {
                title: '高等数学期末模拟练习',
                href: '/materials/advanced-math/final-mock-exercises.pdf',
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
            title: '2012级 C语言 A 卷',
            description: '2012级 C语言 A 卷及参考答案。',
            status: '已核验',
            files: [
              {
                title: 'C语言 A 卷',
                href: '/materials/c/exam-2012-cohort-a.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言 A 卷参考答案',
                href: '/materials/c/exam-2012-cohort-a-answer.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: 'C语言 A 卷',
            description: 'C语言 A 卷及评分标准。',
            status: '已核验',
            files: [
              {
                title: 'C语言 A 卷',
                href: '/materials/c/exam-a.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言 A 卷评分标准',
                href: '/materials/c/exam-a-answer.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: 'C语言 B 卷',
            description: 'C语言 B 卷及评分标准。',
            status: '已核验',
            files: [
              {
                title: 'C语言 B 卷',
                href: '/materials/c/exam-b.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言 B 卷评分标准',
                href: '/materials/c/exam-b-answer.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: 'C语言 C 卷',
            description: 'C语言 C 卷及评分标准。',
            status: '已核验',
            files: [
              {
                title: 'C语言 C 卷',
                href: '/materials/c/exam-c.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言 C 卷评分标准',
                href: '/materials/c/exam-c-answer.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: 'C语言 G 卷',
            description: 'C语言 G 卷及评分标准。',
            status: '已核验',
            files: [
              {
                title: 'C语言 G 卷',
                href: '/materials/c/exam-g.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言 G 卷评分标准',
                href: '/materials/c/exam-g-answer.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: 'C语言 H 卷',
            description: 'C语言 H 卷及评分标准。',
            status: '已核验',
            files: [
              {
                title: 'C语言 H 卷',
                href: '/materials/c/exam-h.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言 H 卷评分标准',
                href: '/materials/c/exam-h-answer.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: 'C语言 I 卷',
            description: 'C语言 I 卷及评分标准。',
            status: '已核验',
            files: [
              {
                title: 'C语言 I 卷',
                href: '/materials/c/exam-i.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言 I 卷评分标准',
                href: '/materials/c/exam-i-answer.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: 'C语言 K 卷',
            description: 'C语言 K 卷及评分标准。',
            status: '已核验',
            files: [
              {
                title: 'C语言 K 卷',
                href: '/materials/c/exam-k.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言 K 卷评分标准',
                href: '/materials/c/exam-k-answer.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: 'C语言 M 卷',
            description: 'C语言 M 卷及评分标准。',
            status: '已核验',
            files: [
              {
                title: 'C语言 M 卷',
                href: '/materials/c/exam-m.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言 M 卷评分标准',
                href: '/materials/c/exam-m-answer.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
          {
            title: 'C语言 N 卷',
            description: 'C语言 N 卷及评分标准。',
            status: '已核验',
            files: [
              {
                title: 'C语言 N 卷',
                href: '/materials/c/exam-n.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: 'C语言 N 卷评分标准',
                href: '/materials/c/exam-n-answer.pdf',
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
                href: '/materials/software/review-notes.pdf',
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
                href: '/materials/physics/exercise-book-volume-1.pdf',
                format: 'PDF',
                role: '练习题',
              },
              {
                title: '大学物理上册练习题（答案）',
                href: '/materials/physics/exercise-book-volume-1-answer.pdf',
                format: 'PDF',
                role: '答案',
              },
              {
                title: '大学物理下册练习题',
                href: '/materials/physics/exercise-book-volume-2.pdf',
                format: 'PDF',
                role: '练习题',
              },
              {
                title: '大学物理下册练习题（答案）',
                href: '/materials/physics/exercise-book-volume-2-answer.pdf',
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
    title: '线性代数',
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
            title: '线性代数课后习题解答选页',
            description: '教材课后习题手写解答选页，按原教材页码整理。',
            status: '已核验',
            files: [
              {
                title: '同济教材行列式习题解答',
                href: '/materials/linear-algebra/tongji-determinant-exercises.pdf',
                format: 'PDF',
                role: '习题解答',
              },
              {
                title: '教材第 71 页习题解答',
                href: '/materials/linear-algebra/textbook-exercises-page-071.pdf',
                format: 'PDF',
                role: '习题解答',
              },
              {
                title: '教材第 163 页习题解答',
                href: '/materials/linear-algebra/textbook-exercises-page-163.pdf',
                format: 'PDF',
                role: '习题解答',
              },
              {
                title: '教材第 177 页习题解答',
                href: '/materials/linear-algebra/textbook-exercises-page-177.pdf',
                format: 'PDF',
                role: '习题解答',
              },
              {
                title: '教材第 188 页习题解答',
                href: '/materials/linear-algebra/textbook-exercises-page-188.pdf',
                format: 'PDF',
                role: '习题解答',
              },
              {
                title: '教材第 193 页习题解答',
                href: '/materials/linear-algebra/textbook-exercises-page-193.pdf',
                format: 'PDF',
                role: '习题解答',
              },
            ],
          },
        ],
      },
    ],
  },
  javaweb: {
    title: 'Java Web应用开发',
    directory: '/materials/javaweb/',
    categories: [
      {
        title: '知识点笔记',
        description: '章节知识点、复习提纲和概念梳理。',
        resources: [
          {
            title: 'Java Web 课程知识点资料',
            description: 'Java Web 全课程讲义、知识点清单与开卷速查资料。',
            status: '已核验',
            files: [
              {
                title: 'Java Web 期末开卷知识点清单',
                href: '/materials/javaweb/open-book-exam-quick-reference.pdf',
                format: 'PDF',
                role: '知识点清单',
              },
              {
                title: 'Java Web 全课程零基础学习讲义',
                href: '/materials/javaweb/beginner-course-guide.pdf',
                format: 'PDF',
                role: '课程讲义',
              },
              {
                title: 'Java Web 全课程知识点清单',
                href: '/materials/javaweb/course-knowledge-checklist.pdf',
                format: 'PDF',
                role: '知识点清单',
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
            title: 'Java Web 习题与答题资料',
            description: '前 12 章习题答案、大题预测与答题模板。',
            status: '待核验',
            files: [
              {
                title: 'Java Web 1-12 章大题预测与答题模板',
                href: '/materials/javaweb/chapters-01-12-predicted-questions.pdf',
                format: 'PDF',
                role: '预测题',
              },
              {
                title: 'Java Web 前 12 章课后习题答案',
                href: '/materials/javaweb/chapters-01-12-exercise-answers.pdf',
                format: 'PDF',
                role: '习题答案',
              },
            ],
          },
        ],
      },
    ],
  },
  microcontroller: {
    title: '单片机原理及应用',
    directory: '/materials/microcontroller/',
    categories: [
      {
        title: '知识点笔记',
        description: '章节知识点、复习提纲和概念梳理。',
        resources: [
          {
            title: 'STM32 课程复习资料',
            description: 'STM32 微控制器章节知识点、考点解析与代码示例。',
            status: '待核验',
            files: [
              {
                title: 'STM32 微控制器期末考试与学习指南',
                href: '/materials/microcontroller/stm32-final-exam-study-guide.pdf',
                format: 'PDF',
                role: '复习讲义',
              },
            ],
          },
        ],
      },
      {
        title: '实验资料',
        description: '实验答案、实验环境、实验报告参考结构和调试记录。',
        resources: [
          {
            title: 'STM32 实验复习资料',
            description: 'STM32 实验一至实验九总结、代码解析与复习题整理。',
            status: '待核验',
            files: [
              {
                title: 'STM32 实验复习与期末开卷考试宝典',
                href: '/materials/microcontroller/stm32-lab-final-exam-study-guide.pdf',
                format: 'PDF',
                role: '实验复习',
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
            title: '嵌入式系统基础与实践习题资料',
            description: '教材第 1 至 10 章课后习题、答案与考点解析。',
            status: '待核验',
            files: [
              {
                title: '嵌入式系统基础与实践课后习题及期末开卷宝典',
                href: '/materials/microcontroller/embedded-systems-exercises-study-guide.pdf',
                format: 'PDF',
                role: '习题答案',
              },
            ],
          },
        ],
      },
    ],
  },
  xjp: {
    title: '习近平新时代中国特色社会主义思想',
    directory: '/materials/xjp/',
    categories: [
      {
        title: '知识点笔记',
        description: '章节笔记、复习提纲和知识点清单。',
        resources: [
          {
            title: '习近平新时代中国特色社会主义思想章节知识点',
            description: '按章节整理的课程知识点 PDF，共 17 份。',
            status: '已授权公开',
            files: [
              {
                title: '第一章',
                href: '/materials/xjp/chapter-01.pdf',
                format: 'PDF',
                role: '章节资料',
              },
              {
                title: '第二章',
                href: '/materials/xjp/chapter-02.pdf',
                format: 'PDF',
                role: '章节资料',
              },
              {
                title: '第三章',
                href: '/materials/xjp/chapter-03.pdf',
                format: 'PDF',
                role: '章节资料',
              },
              {
                title: '第四章',
                href: '/materials/xjp/chapter-04.pdf',
                format: 'PDF',
                role: '章节资料',
              },
              {
                title: '第五章',
                href: '/materials/xjp/chapter-05.pdf',
                format: 'PDF',
                role: '章节资料',
              },
              {
                title: '第六章',
                href: '/materials/xjp/chapter-06.pdf',
                format: 'PDF',
                role: '章节资料',
              },
              {
                title: '第七章',
                href: '/materials/xjp/chapter-07.pdf',
                format: 'PDF',
                role: '章节资料',
              },
              {
                title: '第八章',
                href: '/materials/xjp/chapter-08.pdf',
                format: 'PDF',
                role: '章节资料',
              },
              {
                title: '第九章',
                href: '/materials/xjp/chapter-09.pdf',
                format: 'PDF',
                role: '章节资料',
              },
              {
                title: '第十章',
                href: '/materials/xjp/chapter-10.pdf',
                format: 'PDF',
                role: '章节资料',
              },
              {
                title: '第十一章',
                href: '/materials/xjp/chapter-11.pdf',
                format: 'PDF',
                role: '章节资料',
              },
              {
                title: '第十二章',
                href: '/materials/xjp/chapter-12.pdf',
                format: 'PDF',
                role: '章节资料',
              },
              {
                title: '第十三章',
                href: '/materials/xjp/chapter-13.pdf',
                format: 'PDF',
                role: '章节资料',
              },
              {
                title: '第十四章',
                href: '/materials/xjp/chapter-14.pdf',
                format: 'PDF',
                role: '章节资料',
              },
              {
                title: '第十五章',
                href: '/materials/xjp/chapter-15.pdf',
                format: 'PDF',
                role: '章节资料',
              },
              {
                title: '第十六章',
                href: '/materials/xjp/chapter-16.pdf',
                format: 'PDF',
                role: '章节资料',
              },
              {
                title: '第十七章',
                href: '/materials/xjp/chapter-17.pdf',
                format: 'PDF',
                role: '章节资料',
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
            title: '习近平新时代中国特色社会主义思想期末练习题',
            description: '课程期末练习题 PDF。',
            status: '已授权公开',
            files: [
              {
                title: '期末练习题',
                href: '/materials/xjp/final-practice.pdf',
                format: 'PDF',
                role: '练习题',
              },
            ],
          },
        ],
      },
    ],
  },
} satisfies Record<string, CourseMaterials>;
