import { defineConfig } from 'vitepress';
import katex from 'markdown-it-katex';
import { nav } from './nav';
import { sidebar } from './sidebar';

const base = process.env.VITEPRESS_BASE ?? '/';

export default defineConfig({
  title: 'SCSWiki',
  description: '西华师范大学计算机学院学生知识库（非官方）',
  lang: 'zh-CN',
  base,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: false,
  markdown: {
    config(md) {
      md.use(katex, {
        throwOnError: false,
      });
    },
  },
  themeConfig: {
    nav,
    sidebar,
    outline: {
      level: [2, 3],
      label: '本页目录',
    },
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                displayDetails: '显示详情',
                resetButtonTitle: '清除搜索',
                backButtonTitle: '关闭搜索',
                noResultsText: '没有找到结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '回车',
                  navigateText: '切换',
                  navigateUpKeyAriaLabel: '上箭头',
                  navigateDownKeyAriaLabel: '下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'Esc',
                },
              },
            },
          },
        },
      },
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    lastUpdated: {
      text: '页面最后提交时间',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    },
    editLink: {
      pattern: 'https://github.com/pppolf/SCSWiki/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
    footer: {
      message: '学生维护的非官方知识库。学校特定信息请以正式通知为准。',
      copyright: 'Code: MIT. Content: CC BY-SA 4.0.',
    },
  },
});
