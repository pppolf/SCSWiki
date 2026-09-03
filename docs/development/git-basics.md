---
title: Git 入门
description: 从安装和配置 Git 到完成一次安全提交并创建 Pull Request
category: development
audience:
  - 本科生
  - SCSWiki 贡献者
content_type: verified
status: active
maintainers:
  - SCSWiki 维护组
sources:
  - name: Git 官方安装指南
    url: https://git-scm.com/downloads
  - name: Pro Git：初次运行 Git 前的配置
    url: https://git-scm.com/book/zh/v2/起步-初次运行-Git-前的配置
  - name: Pro Git：记录每次更新到仓库
    url: https://git-scm.com/book/zh/v2/Git-基础-记录每次更新到仓库
  - name: GitHub Docs：使用 Fork
    url: https://docs.github.com/en/pull-requests/how-tos/work-with-forks
---

<ContentMeta />

# Git 入门

Git 是运行在本机上的版本控制工具，用来记录代码和文档的变更历史。GitHub、Gitee 等则是托管远程仓库和开展协作的平台。

:::: tip 学完本页，你可以

- 安装 Git 并完成首次身份设置；
- 解释工作区、暂存区、本地仓库和远程仓库的区别；
- 在独立分支中检查改动、完成提交并安全撤销暂存；
- 把分支推送到自己的 Fork，并向 SCSWiki 创建 Pull Request。

::::

## 安装 Git

先打开终端并运行：

```bash
git --version
```

如果能看到类似 `git version 2.x.x` 的输出，说明 Git 已经安装。若提示找不到命令，请按操作系统选择一种安装方式。

### Windows

可以在 PowerShell 或“命令提示符”中使用 Windows 程序包管理器安装：

```powershell
winget install --id Git.Git -e --source winget
```

如果电脑没有 `winget`，可从 [Git for Windows](https://git-scm.com/install/windows) 下载安装程序。初次使用可以保留安装器的默认选项；安装完成后关闭并重新打开终端。

### macOS

安装 Apple 命令行工具：

```bash
xcode-select --install
```

如果已经安装 Homebrew，也可以运行：

```bash
brew install git
```

### Linux

Debian 或 Ubuntu：

```bash
sudo apt update
sudo apt install git
```

Fedora：

```bash
sudo dnf install git
```

Arch Linux：

```bash
sudo pacman -S git
```

安装完成后再次运行 `git --version`。`sudo` 只用于安装系统软件，不要在项目目录中使用 `sudo git add` 或 `sudo git commit`。

:::: info 命令环境

本页的 Git 命令可以在 PowerShell、Git Bash、macOS 终端和常见 Linux Shell 中运行。`touch`、`rm`、`cat` 等普通文件命令在不同终端中的行为可能不同，因此本页不依赖它们创建或删除文件。

::::

## 首次设置

每次提交都会记录作者名和邮箱。请把下面的示例文字替换为自己的信息，不要原样复制：

```bash
git config --global user.name "你的姓名或公开昵称"
git config --global user.email "你的公开邮箱或 GitHub noreply 邮箱"
git config --global init.defaultBranch main
```

- `user.name` 是提交记录中的作者名，不要求与 GitHub 用户名相同。
- 邮箱会写入提交记录。如果不想公开私人邮箱，可按 [GitHub 的说明](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address) 使用平台提供的 `noreply` 邮箱。
- `--global` 表示作者信息等 Git 配置对当前操作系统账户下的所有仓库生效；进入仓库后可改用 `--local` 只配置当前仓库。

作者信息与 GitHub 登录凭据是两回事。在机房或共用电脑上，除了避免留下全局作者信息，还要退出浏览器账号，并单独清除凭据管理器中的登录信息；`--local` 不能代替这些操作。

只检查刚才设置的三项，避免在截图或求助时暴露其他自定义配置：

```bash
git config --global --get user.name
git config --global --get user.email
git config --global --get init.defaultBranch
```

## Git 在保存什么

Git 的核心流程可以理解为：

```text
工作区（当前检出的项目文件）
  ↓ git add
暂存区（下次提交的选择）
  ↓ git commit
本地仓库（本机提交历史）
  ↓ git push
远程仓库（GitHub / Gitee）
```

- **工作区**：当前实际看到和编辑的整套项目文件；用 `git status` 和 `git diff` 检查其中的变化。
- **暂存区**：下一次提交将采用的内容快照；用 `git add` 选择，用 `git diff --staged` 检查。
- **本地仓库**：已经创建的本地提交历史；用 `git commit` 保存，用 `git log` 查看。
- **远程仓库**：上传到 GitHub 等平台的提交和分支；用 `git fetch` 获取，用 `git push` 推送。

`git add` 是“选择下次提交的内容”，`git commit` 只创建本地提交；只有 `git push` 才会把本地提交发送到远程。Pull Request（PR）则是在托管平台上请求把一个分支的改动合并到另一个分支。

文件执行 `git add` 后仍然存在于工作区；如果暂存后又继续编辑，同一文件可以同时包含已暂存和未暂存的修改。

## 完成第一次本地提交

建议先新建一个空的一次性练习目录熟悉流程，不要在已有项目中执行下面的 `git init`，也不要直接拿课程作业或重要文件试验。

```bash
mkdir git-practice
cd git-practice
git init
git status
```

接着用任意文本编辑器在 `git-practice` 目录中创建 `README.md`，写入一两行学习目标并保存，然后执行：

```bash
git status
git add README.md
git diff --staged
git commit -m "添加学习说明"
git status
git log -5 --oneline
```

完成后应看到：

1. `git log -5 --oneline` 中出现刚才的提交；
2. `git status` 显示工作区干净；
3. 提交仍只保存在本地，没有自动上传到 GitHub。

如果 `git log` 打开了分页界面，按 `q` 退出。

## 安全提交工作流

下面继续以“再次修改并保存 `README.md`”为例，展示真实项目中的参考流程。处理其他文件时，应把 `README.md` 替换为实际修改的路径：

```bash
git status
git diff
git add README.md
git diff --staged
git commit -m "补充 Git 学习笔记"
git status
```

- **`git status`**：确认当前分支，以及哪些文件已修改、未跟踪或已暂存。
- **`git diff`**：阅读尚未暂存的具体改动。
- **`git add README.md`**：只把指定文件的当前内容放入暂存区。
- **`git diff --staged`**：提交前再次核对真正会进入提交的内容。
- **`git commit -m "..."`**：创建一个本地提交，消息应说明“做了什么”。

普通 `git diff` 不显示尚未跟踪的新文件内容。先用 `git status` 发现新文件，再精确暂存，并通过 `git diff --staged` 检查它将提交的内容。

初学阶段优先暂存明确的文件，不把 `git add .` 当作默认操作。`.` 会递归选择当前目录下的变化，可能夹带无关文件、生成文件或敏感信息。

提交前还应做到：

- 一次提交只处理一件清楚的事情；
- 按项目 README 或贡献指南运行检查命令；SCSWiki 使用 `pnpm check`；
- 用项目的 `.gitignore` 排除依赖、构建产物和本地配置，但仍要用 `git status` 主动核对；
- 不提交 `.env`、密钥、访问令牌、账号、真实个人信息、构建产物或编辑器缓存；
- 密钥一旦进入提交历史，应立即撤销或轮换；只删除文件不能让已经泄露的密钥重新安全。

## 使用分支

分支让一项修改与稳定的 `main` 分开。创建并切换到新的任务分支：

```bash
git switch -c docs/improve-git-guide
git branch --show-current
```

分支名应简短描述任务，建议使用小写英文、斜杠和连字符，不使用空格。为开源项目贡献时，不要直接在 `main` 上完成任务修改。

如果已经在 `main` 上修改了文件但还没有提交，通常可以直接运行 `git switch -c 新分支名`，当前修改会一起带到新分支；不要为了“清理”而运行 `git reset --hard`。

## 为 SCSWiki 创建 Pull Request

下面是一条从 Fork 到 PR 的最小路径。完整的项目运行和贡献说明见 [参与贡献](/about/contribute)。

请打开一个新终端，或者先离开前面的 `git-practice` 练习仓库并回到普通工作目录。不要把 SCSWiki 克隆到另一个 Git 仓库内部。

### 1. Fork 并克隆仓库

先在 GitHub 上 Fork [SCSWiki 官方仓库](https://github.com/CWNU-Open-Source-Community/SCSWiki)，然后克隆自己的 Fork。请将 `YOUR-USERNAME` 替换为自己的 GitHub 用户名：

```bash
git clone https://github.com/YOUR-USERNAME/SCSWiki.git
cd SCSWiki
git remote -v
```

`origin` 默认指向自己的 Fork。再添加官方仓库为 `upstream`，这一步只需执行一次：

```bash
git remote add upstream https://github.com/CWNU-Open-Source-Community/SCSWiki.git
git remote -v
```

如果看到 `remote upstream already exists`，不要重复添加，先用 `git remote -v` 检查现有地址。

### 2. 同步并创建任务分支

```bash
git switch main
git fetch upstream
git merge --ff-only upstream/main
git switch -c docs/improve-git-guide
```

`git fetch` 只获取远程状态，不会直接覆盖当前文件。`--ff-only` 可以避免在同步时意外产生合并提交；如果命令失败，先运行 `git status` 查明原因，不要强制推送。

### 3. 检查、提交并推送

创建任务分支后，先按照实际任务修改并保存文件。下面假设本次任务就是完善 `docs/development/git-basics.md`；处理其他任务时，必须换成自己的实际文件路径。

以下以已经按照 [参与贡献](/about/contribute) 安装 Node.js、pnpm 和项目依赖为前提。完成修改后，先运行 SCSWiki 的项目检查：

```bash
pnpm check
```

再检查并提交 Git 改动。SCSWiki 示例中的 `docs:` 用来标识文档变更，是项目约定而不是 Git 强制语法；参与其他项目时，应优先遵循该项目的贡献规范。

```bash
git status
git diff -- docs/development/git-basics.md
git add docs/development/git-basics.md
git diff --staged
git commit -m "docs: 完善 Git 入门教程"
git push -u origin docs/improve-git-guide
```

推送后在 GitHub 创建 PR，并确认：

- base repository 是 `CWNU-Open-Source-Community/SCSWiki`；
- base branch 是 `main`；
- compare branch 是自己 Fork 中刚推送的任务分支；
- 标题说明改了什么，描述中写清改动内容和检查结果。

收到评审意见后，继续在同一分支修改、提交并执行普通的 `git push`，原 PR 会自动更新，不需要重新创建。

:::: warning 认证和凭据

GitHub 的 HTTPS Git 操作不再使用账户密码。请按 GitHub 提示通过浏览器、Git Credential Manager、令牌或 SSH 完成认证。不要把令牌写进远程地址、源码、截图或聊天记录，在公共电脑上也不要长期保存凭据。

::::

## 撤销与恢复

以下示例以已有至少一次提交的项目为前提。先判断改动处于哪个位置，再选择命令：

- **文件误加入暂存区**：运行 `git restore --staged README.md`。这只取消暂存，工作区修改仍然保留。
- **确认要丢弃已跟踪文件的未暂存修改**：运行 `git restore -- README.md`。它会让工作区恢复为当前暂存区版本；若该文件没有已暂存改动，通常就是上次提交版本。被丢弃的修改无法靠 Git 找回；`--` 表示后面开始是文件路径。
- **已经提交或推送后发现错误**：优先将提交编号代入 `git revert COMMIT-ID` 创建一个撤销提交，再检查并正常推送。不要在共享历史上使用强制推送改写记录。

`git restore` 无法找回被删除的未跟踪文件；这类文件只能尝试从编辑器本地历史、回收站或备份中恢复。

:::: danger 不要盲目复制危险命令

`git reset --hard`、`git clean -fd`、`git restore .`、旧式的 `git checkout -- .` 和 `git push --force` 可能删除本地工作或覆盖远程历史。它们不属于入门排错手段；遇到不确定的状态时，先运行 `git status` 并保留现场，再寻求帮助。

::::

## 常见报错

- **`git: command not found` 或“不是内部或外部命令”**：Git 未安装，或安装后终端尚未重启。重新打开终端并运行 `git --version`。
- **`fatal: not a git repository`**：当前目录不是 Git 仓库。进入正确目录；不要为了消除报错就在任意目录执行 `git init`。
- **`Please tell me who you are`**：没有配置提交作者信息。检查 `user.name` 和 `user.email`。
- **`nothing to commit`**：没有改动，或文件尚未保存。先运行 `git status`。
- **`remote ... already exists`**：同名远程仓库已经配置。用 `git remote -v` 检查，不要重复添加。
- **`non-fast-forward` 或 `fetch first`**：远程有本地没有的提交。先获取并查看差异，不要立即使用强制推送。

## 完成自查

本地 Git：

- `git --version` 能正确输出版本；
- 能说明 `add`、`commit`、`push` 和 PR 的区别；
- 当前位于自己的任务分支，而不是直接在 `main` 上修改；
- 提交前检查过 `git status` 和 `git diff --staged`；
- `git status` 在提交后显示工作区干净；

SCSWiki 贡献：

- `git remote -v` 中能分清自己的 `origin` 和官方 `upstream`；
- PR 的目标仓库、目标分支和来源分支均正确。
