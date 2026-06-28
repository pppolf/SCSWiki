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
sources: []
---

<ContentMeta />

# 如何贡献

你可以通过 Issue 提交内容错误、过期反馈或新内容建议。熟悉 Git 的贡献者可以 Fork 仓库后提交 Pull Request。

> 下面展示如何提交 Pull Request

## 一、登录Github

Github官网：[官网链接](https://github.com/)

如果没有账号就注册一个，然后保持你浏览器的Github登录状态。

然后进入项目的首页：[项目链接](https://github.com/pppolf/SCSWiki)，你会看到如下页面

![image-20260627152708303](/images/image-20260627152708303.png)

然后我们点击 **Fork** 把这个代码克隆到本地。

点击后直接点击Creat fork

![image-20260627152858372](/images/image-20260627152858372.png)

然后会自动跳转到你仓库的页面，现在你看到的就是Fork之后的仓库了。

![image-20260627153009391](/images/image-20260627153009391.png)

## 二、把项目跑起来

首先需要我们在本地找一个位置来放置我们的项目，然后去clone这个fork项目。

![image-20260627153137419](/images/image-20260627153137419.png)

这里我使用命令行操作，打开终端，cd到你想保存的位置，随后输入

```sh
git clone https://github.com/你的GitHub用户名/SCSWiki.git
```

![image-20260627153516041](/images/image-20260627153516041.png)

然后我们使用vscode打开这个项目，这个应该都会吧。！打开之后你会看到如下界面

![image-20260627153742216](/images/image-20260627153742216.png)

然后我们进行下一步安装依赖，首先你需要保证你有node环境 Node.js `>=20.11.0`，如果不知道怎么安装node，可以问AI安装。。。

打开自带的终端。

![image-20260627153921777](/images/image-20260627153921777.png)

输入 `node -v` 查看当前的node环境，符合条件即可，接下来就是安装依赖了，输入 `npm install -g pnpm` 我们使用pnpm管理依赖，然后输入 `pnpm install` 安装项目依赖，等几分钟就安装完了！

安装完成你会看到

![image-20260627155331302](/images/image-20260627155331302.png)

然后把项目启动起来，运行命令 `npm run dev`，然后打开网址 `http://localhost:5173` 你就会看到这个项目了。

![image-20260627155440890](/images/image-20260627155440890.png)

## 三、配置github信息

回到 vscode 中查看当前分支和修改：

```sh
git status
```

查看远程仓库：

```sh
git remote -v
```

正常情况下应该至少有：

```sh
origin  https://github.com/你的用户名/SCSWiki.git
```

其中：

- `origin`：你自己的 Fork；
- `upstream`：原始项目仓库。

如果还没有 `upstream`，添加它：

```sh
git remote add upstream https://github.com/pppolf/SCSWiki.git
```

再次确认：

```sh
git remote -v
```

应该类似：

```sh
origin    https://github.com/你的用户名/SCSWiki.git (fetch)
origin    https://github.com/你的用户名/SCSWiki.git (push)
upstream  https://github.com/pppolf/SCSWiki.git (fetch)
upstream  https://github.com/pppolf/SCSWiki.git (push)
```

注意：你通常只向 `origin` 推送，不向 `upstream` 推送。

同步原项目的最新代码，在开始修改前，先确保本地代码是最新的。

切换到主分支：

```sh
git switch main
```

从原项目获取最新提交：

```sh
git fetch upstream
```

把上游最新代码合并到本地主分支：

```sh
git merge upstream/main
```

在同步之前我们要设置SSH才可以，打开终端

以当前 `root` 用户执行：

```sh
ssh-keygen -t ed25519 -C "你的GitHub邮箱"
```

出现：

```sh
Enter file in which to save the key
```

直接回车，默认保存到：

```sh
/root/.ssh/id_ed25519
```

出现密码短语提示时，直接回车两次不设置。看到这个就行了

![image-20260627163744408](/images/image-20260627163744408.png)

查看公钥

```sh
cat ~/.ssh/id_ed25519.pub
```

会输出类似：

```sh
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... xxx@xxx.com
```

复制完整的一整行。进入 GitHub 网页：

```text
右上角头像
→ Settings
→ SSH and GPG keys
→ New SSH key
```

填写：

```yml
Title: SCSWiki
Key type: Authentication Key
Key: 粘贴刚才的完整公钥
```

点击：

```text
Add SSH key
```

回到虚拟机测试连接：

```sh
ssh -T git@github.com
```

第一次可能出现：

```sh
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

输入：

```sh
yes
```

成功时会看到类似：

```sh
Hi github账号! You've successfully authenticated, but GitHub does not provide shell access.
```

把仓库地址从 HTTPS 改成 SSH，当前你当前的地址是：

```text
https://github.com/你的github账号/SCSWiki.git
```

改为：

```sh
git remote set-url origin git@github.com:你的github账号/SCSWiki.git
```

检查：

```sh
git remote -v
```

应该显示：

```sh
origin  git@github.com:你的github账号/SCSWiki.git (fetch)
origin  git@github.com:你的github账号/SCSWiki.git (push)
```

然后再次推送：

```sh
git push origin main
```

## 四、为本次修改创建新分支

不要直接在 `main` 分支修改。

例如，你准备添加一篇校园网教程：

```sh
git switch -c docs/add-campus-network-guide
```

分支名称建议使用：

```text
docs/xxx       文档修改
fix/xxx        修复错误
feat/xxx       新功能
refactor/xxx   重构
chore/xxx      工程配置
```

查看当前分支：

```sh
git branch
```

带 `*` 的是当前分支：

```sh
* docs/add-campus-network-guide
  main
```

我们回到vscode，打开目录 `/docs/campus/` 新建一个文件名叫 `network.md` 文档可以写成

```markdown
---
title: 校园网络使用指南
description: 介绍校园网络的基本使用方法
category: campus
audience:
  - 本科生
content_type: experience
status: needs-review
maintainers:
  - SCSWiki 维护组
sources: []
---

<ContentMeta />

# 校园网络使用指南

> 本页面仍在核验中，请以学校最新通知为准。

## 使用前准备

请先确认已经获得学校统一身份认证账号。

## 注意事项

不要向任何人泄露账号和密码。
```

请注意，在新添加了某页面，需要在 `/docs/.vitepress/sidebar.ts` 里添加对应的链接。比如现在我们是添加的 `/campus` 下的，所以我们就找对应的区域加，写上 text 和 link 就行了

```ts
...
'/campus/': [
    {
      text: '校园生活',
      items: [
        { text: '总览', link: '/campus/' },
        { text: '校园网络待核验模板', link: '/campus/network-template' },
        { text: '校园网络使用指南', link: '/campus/network'},
      ],
    },
  ],
...
```

然后我们可以回到浏览器看是否有了，点击链接：`http://localhost:5173/campus/network` 就有了。

最后我们去检查一下语法什么的，运行 `pnpm check` 如果通过了就OK！

## 五、如何提交

查看状态：

```sh
git status
```

添加到暂存区：

```sh
git add .
```

检查暂存区内容：

```sh
git diff --cached
```

这一步非常重要。它可以避免把 `.env`、临时文件、密码或无关内容提交进去。检查无误按 `q` 退出。

创建 Commit 提交：

```sh
git commit -m "docs: add campus network guide"
```

中文也可以：

```sh
git commit -m "docs: 添加校园网络使用指南"
```

推荐格式：

```yml
类型: 简短描述
```

常用类型：

```yml
docs: 文档修改
fix: 修复问题
feat: 添加功能
refactor: 重构
test: 测试
chore: 工程配置
style: 格式调整
```

示例：

```sh
git commit -m "docs: add freshman registration guide"
git commit -m "fix: correct broken link in campus guide"
git commit -m "feat: add assistant entry component"
```

提交后查看记录：

```sh
git log --oneline -5
```

推送分支到自己的 Fork

第一次推送当前分支：

```sh
git push -u origin docs/add-campus-network-guide
```

其中：

```sh
origin
```

是你自己的 Fork。

后续再修改并提交后，只需要：

```sh
git push
```

如果命令成功，终端一般会提示：

```sh
Create a pull request for 'docs/add-campus-network-guide'
```

在 GitHub 创建 **Pull Request**

打开你 Fork 后的 GitHub 仓库页面。

通常会看到一个黄色或绿色提示：

```sh
Compare & pull request
```

点击它。

确认以下内容：

```sh
base repository: 原始项目仓库
base branch: main

head repository: 你的 Fork
compare branch: docs/add-campus-network-guide
```

也就是说：

```sh
你的分支
    ↓ 合并到
原项目 main 分支
```

PR 标题建议：

```sh
docs: 添加校园网络使用指南
```

PR 描述可以使用：

```markdown
## 修改内容

- 新增校园网络使用指南
- 添加页面 Front Matter
- 更新校园生活栏目侧边栏

## 修改原因

现有 Wiki 缺少校园网络相关说明，新生难以快速找到对应信息。

## 信息来源

- 学校公开通知：
- 学院公开通知：
- 其他核验方式：

## 本地检查

- [x] `pnpm check`
- [x] `pnpm build`
- [x] 检查移动端页面
- [x] 未包含个人隐私信息
- [x] 未包含未经核验的学校政策

## 截图

如涉及页面样式，请附上截图。
```

然后点击：

```text
Create pull request
```

> 👉👉👉**在通过了PR之后再进行以下的操作，现在可以在SCSWiki交流群通知审核了。**

## 六、PR 合并后清理分支

PR 合并后，先切回主分支：

```sh
git switch main
```

同步上游最新内容：

```sh
git fetch upstream
git merge upstream/main
```

推送到自己的 Fork：

```sh
git push origin main
```

删除本地分支：

```sh
git branch -d docs/add-campus-network-guide
```

删除远程 Fork 上的分支：

```sh
git push origin --delete docs/add-campus-network-guide
```

## 七、以后每次提交 PR 的标准命令

每次开始新任务：

```sh
git switch main
git fetch upstream
git merge upstream/main
git push origin main
git switch -c docs/your-change
```

完成修改后：

```sh
git status
git diff
pnpm check
git add 相关文件
git diff --cached
git commit -m "docs: describe your change"
git push -u origin docs/your-change
```

然后去 GitHub 创建 PR。
