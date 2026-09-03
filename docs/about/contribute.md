---
title: 如何贡献
description: 通过 Issue 或 Pull Request 参与 SCSWiki
category: about
audience:
  - 贡献者
content_type: verified
status: active
maintainers:
  - SCSWiki 维护组
sources:
  - name: GitHub Docs：使用 Fork
    url: https://docs.github.com/en/pull-requests/how-tos/work-with-forks
  - name: GitHub Docs：连接到 GitHub
    url: https://docs.github.com/en/get-started/git-basics/set-up-git
  - name: GitHub Docs：创建 Pull Request
    url: https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request
---

<ContentMeta />

# 如何贡献

你可以通过 Issue 提交内容错误、过期反馈或新内容建议，也可以通过 Pull Request（PR）直接完善页面。第一次使用 Git 时，建议先阅读 [Git 入门](/development/git-basics)。

:::: tip 选择合适的方式

- 只想报告问题、暂时不方便修改：提交 Issue，写清页面地址、问题和可核验来源。
- 已经准备好修改：Fork 仓库，在独立分支完成改动并创建 PR。
- 涉及学校政策、费用、时间或个人信息：先确认公开来源和时效，不确定时宁可标记待核验。

::::

## 一、登录 GitHub 并创建 Fork

登录 [GitHub](https://github.com/)，然后进入 [SCSWiki 官方仓库](https://github.com/CWNU-Open-Source-Community/SCSWiki)。

点击页面右上角的 **Fork**，再选择 **Create fork**，在自己的 GitHub 账号下创建一份仓库副本。创建完成后请检查：

- 页面顶部的仓库所有者是你的 GitHub 用户名；
- 页面显示它 Fork 自 `CWNU-Open-Source-Community/SCSWiki`。

## 二、安装工具并运行项目

### 1. 准备 Git、Node.js 和编辑器

本项目需要：

- Git，安装和首次设置见 [Git 入门](/development/git-basics)；
- Node.js `>=20.11.0`，可从 [Node.js 官方下载页](https://nodejs.org/en/download) 安装；
- 一个文本编辑器，下面以 [VS Code](https://code.visualstudio.com/Download) 为例，也可以使用其他编辑器。

安装 Node.js 后请重新打开终端；如果使用 VS Code，也请重启 VS Code，再检查版本：

```bash
git --version
node --version
```

### 2. 克隆自己的 Fork

先选择一个不属于其他 Git 仓库的目录，用来保存项目。

下面命令中的 `YOUR-USERNAME` 必须替换为你的 GitHub 用户名，不能原样复制：

```bash
git clone https://github.com/YOUR-USERNAME/SCSWiki.git
cd SCSWiki
```

克隆完成后，使用 VS Code 打开 `SCSWiki` 目录。

### 3. 安装依赖

仓库在 `package.json` 中指定 pnpm `9.15.4`。优先通过 Corepack 启用该版本，再安装依赖：

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm --version
pnpm install
```

如果终端提示找不到 `corepack`，可以改用下面的固定版本安装方式，然后再运行 `pnpm install`：

```bash
npm install --global pnpm@9.15.4
```

两种 pnpm 安装方式选择一种即可。若全局安装提示权限不足，请优先使用 Corepack 或参考 pnpm 官方安装说明，不要切换到 `root` 用户运行项目命令。

### 4. 启动本地预览

```bash
pnpm dev
```

打开终端实际显示的本地地址，通常是 `http://localhost:5173`；如果端口被占用，开发服务器会使用其他端口。

开发服务器会持续占用当前终端。预览期间请保持它运行，并在 VS Code 中新建第二个终端执行后续命令；不再需要预览时，可回到该终端按 `Ctrl+C` 停止。

## 三、配置远程仓库并同步主分支

查看当前远程仓库：

```bash
git remote -v
```

刚克隆自己的 Fork 时，输出通常类似：

```text
origin  https://github.com/YOUR-USERNAME/SCSWiki.git (fetch)
origin  https://github.com/YOUR-USERNAME/SCSWiki.git (push)
```

`origin` 指向你自己的 Fork。再添加官方仓库为 `upstream`，这一步只需执行一次：

```bash
git remote add upstream https://github.com/CWNU-Open-Source-Community/SCSWiki.git
git remote -v
```

如果出现 `remote upstream already exists`，不要重复添加，先检查现有地址是否正确。

### GitHub 认证方式

同步公开仓库不需要先配置 SSH。向自己的 Fork 推送时，可以使用 HTTPS，也可以自行选择 SSH：

- 使用 HTTPS 时，GitHub 不接受账户密码进行 Git 操作。首次推送通常会通过浏览器、Git Credential Manager 或令牌完成认证。
- 使用 SSH 时，请按照 [GitHub 官方说明](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) 生成并添加密钥，不要用 `sudo` 或切换到 `root` 用户操作。
- 不要把密码、访问令牌或私钥写进远程地址、源码、截图或聊天记录；共用电脑上不要长期保存凭据。

每次开始新任务前，同步官方 `main`：

```bash
git switch main
git fetch upstream
git merge --ff-only upstream/main
git push origin main
```

`git fetch` 只获取远程状态；`--ff-only` 可以避免同步时意外产生合并提交。若合并失败，先运行 `git status` 查看原因，不要直接强制推送。

## 四、创建任务分支并完成修改

先确认要处理的 Issue、页面错误或内容任务，不要直接把教程中的演示文字提交到仓库。下面假设任务是更新已有的校园网络说明。

创建并检查任务分支：

```bash
git switch -c docs/update-campus-network
git branch --show-current
```

分支名应简短描述本次任务，例如：

```text
docs/update-campus-network   文档修改
fix/broken-campus-link       修复错误
feat/new-search-filter       新功能
refactor/sidebar-data        重构
chore/update-tooling         工程配置
```

然后在编辑器中打开本次任务对应的真实文件，按照 Issue 或核验结果修改并保存。本例对应 `docs/campus/network.md`。

如果要新增页面，还应：

1. 先确认目标目录中没有同名文件或相同 URL；
2. 参考同目录页面补全 Front Matter、`<ContentMeta />`、来源和核验状态；
3. 按项目现有结构更新 `docs/.vitepress/sidebar.ts`；
4. 不编造学校政策，不写入账号、联系方式等个人敏感信息；
5. 参考仓库根目录的 [内容贡献规范](https://github.com/CWNU-Open-Source-Community/SCSWiki/blob/main/CONTENT_GUIDE.md)。

回到本地预览地址检查页面内容、链接和侧边栏。若示例中约定更新校园网络页，则访问 `/campus/network`。

## 五、检查、提交并推送

下面仍以“已经修改并保存 `docs/campus/network.md`”为例。其他任务必须把路径和分支名替换为自己的实际内容。

```bash
git status
git diff -- docs/campus/network.md
pnpm check
git add docs/campus/network.md
git diff --staged
git commit -m "docs: 更新校园网络说明"
git status
git push -u origin docs/update-campus-network
```

注意：

- `pnpm check` 包含类型检查、Markdown 检查、格式检查、内容校验、链接检查、测试和生产构建。
- `git add` 后应写出本次实际修改的一个或多个文件路径；新增页面时通常还要暂存相应的侧边栏文件。
- 不把 `git add .` 当作默认操作，避免夹带 `.env`、临时文件、密码或无关改动。
- `git diff --staged` 展示真正会进入提交的内容，务必逐项检查；若进入分页界面，按 `q` 退出。
- 一组改动只需执行一次 `git commit`。提交信息可使用中文或英文，重点是简短说明“做了什么”。

常见提交类型：

- `docs:` 文档修改；
- `fix:` 修复问题；
- `feat:` 添加功能；
- `refactor:` 重构；
- `test:` 测试；
- `chore:` 工程配置；
- `style:` 格式调整。

第一次推送使用 `git push -u origin 分支名`；同一个 PR 后续有新提交时，执行普通的 `git push` 即可。

## 六、创建 Pull Request

打开自己的 GitHub Fork。推送成功后，页面通常会显示 **Compare & pull request**，点击后确认：

```text
base repository: CWNU-Open-Source-Community/SCSWiki
base branch: main
head repository: 你的 Fork
compare branch: 本次任务分支
```

PR 标题应直接说明改动，例如 `docs: 更新校园网络说明`。描述可以参考：

```markdown
## 修改内容

- 更新校园网络说明
- 修正过期内容并补充来源

## 修改原因

说明原页面存在的问题，以及本次修改如何解决。

## 信息来源

- 学校公开通知：
- 学院公开通知：
- 其他核验方式：

## 本地检查

- [x] `pnpm check`
- [x] 检查桌面端和移动端页面
- [x] 未包含个人隐私或凭据信息
- [x] 对时效性内容标明来源和核验状态

## 截图

如涉及页面样式，请附上修改前后截图。
```

只勾选自己实际完成的检查，然后点击 **Create pull request**。PR 创建后可在 SCSWiki 交流群通知维护者审核。

收到评审意见后，继续在同一分支修改、检查、提交并推送，原 PR 会自动更新，不需要重新创建。

## 七、PR 合并后同步与清理

确认 PR 已合并后，回到本地仓库同步主分支：

```bash
git switch main
git fetch upstream
git merge --ff-only upstream/main
git push origin main
```

先尝试删除已经完成的本地任务分支：

```bash
git branch -d docs/update-campus-network
```

如果 PR 使用 Squash Merge 合并，`git branch -d` 可能因无法确认合并关系而安全拒绝。先在 GitHub 确认 PR 已合并，并核对分支没有需要保留的提交；不确定时先保留分支。

确认 PR 已合并且分支内容无需保留后，再删除 Fork 上的远程任务分支：

```bash
git push origin --delete docs/update-campus-network
```

以后每次贡献都重复“同步 `main` → 创建任务分支 → 修改和预览 → 检查 → 精确暂存 → 提交并推送 → 创建 PR”这个闭环。
