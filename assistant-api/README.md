# SCSWiki Assistant API

SCSWiki 智能助手后端运行在模型机器上，对公网只暴露这个 API。浏览器不应直接访问 llama.cpp 的 `8080` 或 `8081`。

## 本机服务

默认服务约定：

```text
127.0.0.1:8080  Qwen chat/completions
127.0.0.1:8081  embedding 服务，需要 llama.cpp --embeddings
127.0.0.1:8787  assistant API
```

## 生成索引

```bash
pnpm assistant:index
```

索引默认写入：

```text
assistant-data/scswiki-rag-index.json
```

该目录不提交到 Git。Markdown 更新后，重新运行索引命令，再重启 API 或等待 API 热加载索引文件。

## 启动 API

```bash
pnpm assistant:api
```

常用环境变量：

```text
SCS_ASSISTANT_CHAT_URL=http://127.0.0.1:8080/v1/chat/completions
SCS_ASSISTANT_CHAT_MODEL=scswiki-qwen
SCS_ASSISTANT_EMBEDDING_URL=http://127.0.0.1:8081/v1/embeddings
SCS_ASSISTANT_EMBEDDING_MODEL=bge-m3
SCS_ASSISTANT_INDEX_PATH=assistant-data/scswiki-rag-index.json
SCS_ASSISTANT_PORT=8787
SCS_ASSISTANT_ALLOWED_ORIGINS=https://scswiki.com,http://localhost:5173
```

公网部署时，用 Caddy 或 Nginx 将 `https://api.scswiki.com` 反代到 `127.0.0.1:8787`。
