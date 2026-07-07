# SCSWiki Assistant API

SCSWiki 智能助手后端只暴露站点需要的公开 API。浏览器不应直接访问 DeepSeek 或 DashScope，也不应拿到任何模型 API Key。

## 模型服务

默认使用云端模型：

```text
Chat       DeepSeek deepseek-v4-flash
Embedding  DashScope text-embedding-v4, 1024 dimensions
API        127.0.0.1:8787
Public     https://api.scswiki.com
```

常用环境变量：

```text
SCS_ASSISTANT_CHAT_URL=https://api.deepseek.com/chat/completions
SCS_ASSISTANT_CHAT_MODEL=deepseek-v4-flash
SCS_ASSISTANT_CHAT_API_KEY=...
SCS_ASSISTANT_EMBEDDING_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/embeddings
SCS_ASSISTANT_EMBEDDING_MODEL=text-embedding-v4
SCS_ASSISTANT_EMBEDDING_API_KEY=...
SCS_ASSISTANT_EMBEDDING_DIMENSIONS=1024
SCS_ASSISTANT_INDEX_PATH=assistant-data/scswiki-rag-index.json
SCS_ASSISTANT_PORT=8787
SCS_ASSISTANT_ALLOWED_ORIGINS=https://scswiki.com,https://www.scswiki.com,http://localhost:5173
```

## 生成索引

旧的 `bge-m3` 索引不能和 `text-embedding-v4` 混用。Markdown 更新后，在云服务器上加载环境变量并重新生成索引：

```bash
set -a
. /etc/scswiki-assistant.env
set +a
pnpm assistant:index
```

索引默认写入：

```text
assistant-data/scswiki-rag-index.json
```

API 会热加载索引文件。如果索引的 `embeddingModel` 或 `embeddingDimensions` 与当前环境变量不一致，`/health` 会显示错误，聊天接口会返回 503。

## 本地启动

本地调试需要提供真实 API Key：

```bash
cp .env.example .env.local
pnpm assistant:index
pnpm assistant:api
```

站点前端通过 `VITE_SCS_ASSISTANT_API_BASE` 连接后端。本地默认可设为：

```text
VITE_SCS_ASSISTANT_API_BASE=http://127.0.0.1:8787
```

## 云服务器部署

以下示例适用于 Ubuntu/Debian。服务器需要 Node.js 20+、pnpm、PM2 和 Caddy。

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
npm install -g pm2
pnpm install --frozen-lockfile
```

创建 `/etc/scswiki-assistant.env`，权限建议设为 `600`：

```bash
sudo install -m 600 /dev/null /etc/scswiki-assistant.env
sudoedit /etc/scswiki-assistant.env
```

写入 `.env.example` 中除 `VITE_` 外的后端变量，并替换两个 API Key。

生成索引并启动 PM2：

```bash
set -a
. /etc/scswiki-assistant.env
set +a
pnpm assistant:index
pm2 start ecosystem.config.cjs --update-env
pm2 save
pm2 startup
```

将 `deploy/Caddyfile` 中的站点块合并到服务器的 Caddy 配置，或复制为 `/etc/caddy/Caddyfile` 后重载：

```bash
sudo caddy fmt --overwrite /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

验收：

```bash
pm2 status
curl https://api.scswiki.com/health
```

公网只需要开放 80/443。`8787` 只监听 `127.0.0.1`，由 Caddy 反代。
