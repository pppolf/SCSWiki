---
title: 计算机组成原理资料
description: 计算机组成原理课程相关学习资料整理
category: materials
audience:
  - 学生
content_type: experience
status: active
maintainers:
  - SCSWiki 维护组
sources: []
---

<ContentMeta />

# 计算机组成原理资料

本页用于整理计算机组成原理课程的学习资料。资料内容以同学贡献为主，仅供学习参考；课程范围、实验要求、作业要求和考试安排请以任课教师当学期说明为准。

## 资料目录

<MaterialResourceList course="computer-organization" />

## 维护方式

每门课程使用一页内容和一个附件目录：

```text
docs/materials/computer-organization.md
docs/public/materials/computer-organization/
```

资料清单统一维护在：

```text
docs/.vitepress/materials.ts
```

每门课按分类维护。常用分类包括：

- 知识点笔记：章节笔记、复习提纲、知识点清单。
- 实验资料：实验环境、实验说明、调试记录。
- 试题资料：试卷、练习题和答案。试卷与答案应放在同一个资料组里。

新增资料时，先把文件放到对应课程目录，再在 `courseMaterials` 中增加一条记录：

```ts
{
  'computer-organization': {
    title: '计算机组成原理',
    directory: '/materials/computer-organization/',
    categories: [
      {
        title: '试题资料',
        description: '试卷、练习题和对应答案放在同一个资料组中。',
        resources: [
          {
            title: '2024 年期末练习',
            description: '期末练习试卷与参考答案。',
            status: '待核验',
            files: [
              {
                title: '试卷',
                href: '/materials/computer-organization/final-practice-2024.pdf',
                format: 'PDF',
                role: '试卷',
              },
              {
                title: '参考答案',
                href: '/materials/computer-organization/final-practice-2024-answer.pdf',
                format: 'PDF',
                role: '答案',
              },
            ],
          },
        ],
      },
    ],
  },
}
```

只有 PDF 支持在线预览。DOCX、PPTX、XLSX、ZIP 等格式可以上传，但页面只提供下载。

## 上传前检查

- 不包含姓名、学号、手机号、班级群号等个人信息。
- 不包含未授权教材扫描件、教师课件原文件或未公开试卷。
- 不包含课程平台、教务系统、班级群等内部链接。
- 文件名使用英文小写短横线，便于长期维护。
