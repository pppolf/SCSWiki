# SCSWiki

面向西华师范大学计算机学院学生的非官方知识库。

[![CI](https://github.com/pppolf/SCSWiki/actions/workflows/ci.yml/badge.svg)](https://github.com/pppolf/SCSWiki/actions/workflows/ci.yml)
[![Deploy Pages](https://github.com/pppolf/SCSWiki/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/pppolf/SCSWiki/actions/workflows/deploy-pages.yml)
[![License: MIT](https://img.shields.io/badge/Code-MIT-blue.svg)](./LICENSE)
[![Content: CC BY-SA 4.0](https://img.shields.io/badge/Content-CC%20BY--SA%204.0-green.svg)](./LICENSE-CONTENT)

**线上访问：** [scswiki.com](https://scswiki.com/)

SCSWiki 试图把散落在学生之间的学习经验、工具入门、资料索引、办事提醒和贡献规范沉淀成一个可检索、可维护、可追溯的公共知识空间。它不是学校或学院的正式发布渠道，也不替代任何官方通知；涉及政策、流程、时间、地点、人员、考试、奖助、培养方案等高风险内容时，均应以公开正式来源为准。

## 项目定位

- **学生优先**：内容面向在校学生，尤其照顾新生从入学、学习到项目实践的真实路径。
- **可信优先**：通过 Front Matter、来源字段、页面状态和内容类型区分正式来源、经验内容、待核验内容与归档内容。
- **维护优先**：使用 VitePress、TypeScript、内容校验脚本、内部链接检查和 CI 流水线降低长期维护成本。
- **隐私优先**：不收录真实个人联系方式、学号、手机号、群号、内部系统链接或未经授权的课程材料。

## 内容体系

站点内容按学生常见场景组织，覆盖但不限于：

- 入门导航、常见问题和组织信息。
- 课程学习、开发工具与基础能力建设。
- 教师、实验室、升学、奖助等公开信息索引。
- 学习资料的合规整理与来源审查。
- 面向贡献者的写作规范、模板和自动化检查。

普通内容页需要声明 `title`、`description`、`category`、`audience`、`content_type`、`status`、`maintainers` 和 `sources`。缺少可靠来源的学校特定信息，应保持为 `status: needs-review`，不得包装成确定事实。

## 技术栈

- VitePress
- Vue 3
- TypeScript
- pnpm
- Vitest
- markdownlint
- GitHub Actions
- GitHub Pages

## 本地开发

环境要求：

- Node.js `>=20.11.0`
- pnpm `>=9`

常用命令：

```bash
pnpm install
pnpm dev
pnpm check
pnpm build
pnpm preview
```

`pnpm check` 会依次运行类型检查、Markdown 检查、格式检查、内容校验、资料合规检查、内部链接检查、单元测试和生产构建。提交前请优先保证该命令通过。

## 目录结构

```text
.
├─ docs/                    # VitePress 站点内容
├─ docs/.vitepress/          # 站点配置、导航、侧边栏和主题扩展
├─ docs/public/              # 静态资源与自定义域名 CNAME
├─ scripts/                  # 内容验证、资料检查、链接检查和测试脚本
├─ .github/                  # Issue Forms、PR 模板、CODEOWNERS 和 Actions
├─ CONTENT_GUIDE.md          # 内容可信度与写作规范
└─ CONTRIBUTING.md           # 贡献指南
```

## 部署

站点通过 GitHub Actions 构建并部署到 GitHub Pages。当前自定义域名由 `docs/public/CNAME` 配置为：

```text
scswiki.com
```

部署流水线会安装依赖、生成贡献者信息、运行 `pnpm check`，并上传 `docs/.vitepress/dist` 作为 Pages 产物。默认 `VITEPRESS_BASE=/`，适用于自定义域名部署。

## 贡献

欢迎提交内容修正、过期信息反馈、资料来源补充和工程改进。

- 不熟悉 Git：通过 Issue Forms 说明问题、页面 URL、建议修改和可公开访问的来源。
- 熟悉 Git：Fork 仓库，创建分支，修改后运行 `pnpm check`，再提交 Pull Request。

贡献前请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 与 [CONTENT_GUIDE.md](./CONTENT_GUIDE.md)。任何贡献都不应包含个人隐私、内部系统信息、未授权版权材料或无法公开核验的敏感内容。

## 许可证

- 代码：MIT License，见 [LICENSE](./LICENSE)。
- 文档内容：CC BY-SA 4.0，见 [LICENSE-CONTENT](./LICENSE-CONTENT)。

学校名称、校徽、学院标志或第三方商标不因本仓库许可证而获得再许可。
