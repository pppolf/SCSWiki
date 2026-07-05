<script setup lang="ts">
import { inBrowser } from 'vitepress';
import { nextTick, ref } from 'vue';
import MarkdownIt from 'markdown-it';

type AssistantSource = {
  title: string;
  url: string;
  content_type: string;
  status: string;
  score: number;
  headingPath: string[];
  warnings: string[];
};

type AssistantResponse = {
  answer: string;
  sources: AssistantSource[];
  warnings: string[];
};

type UiMessage = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  sources?: AssistantSource[];
  warnings?: string[];
};

const apiBase = (import.meta.env.VITE_SCS_ASSISTANT_API_BASE ?? '').replace(/\/+$/g, '');
const isEnabled = apiBase.length > 0;
const markdown = new MarkdownIt({
  breaks: true,
  html: false,
  linkify: true,
});
const isOpen = ref(false);
const isLoading = ref(false);
const input = ref('');
const messagesEl = ref<HTMLDivElement | null>(null);
const messages = ref<UiMessage[]>([
  {
    content: '你好，可以直接提问。',
    id: 'hello',
    role: 'assistant',
  },
]);

const contentTypeLabels: Record<string, string> = {
  archived: '历史归档',
  experience: '学生经验',
  'official-source': '公开正式来源整理',
  verified: '维护者核验',
};

const statusLabels: Record<string, string> = {
  active: '有效',
  archived: '已归档',
  draft: '草稿',
  'needs-review': '待核验',
};

function toggleAssistant() {
  isOpen.value = !isOpen.value;
  void scrollToBottom();
}

async function sendMessage() {
  const message = input.value.trim();

  if (!message || isLoading.value || !isEnabled) {
    return;
  }

  const history = messages.value
    .filter((item) => item.id !== 'hello')
    .slice(-4)
    .map((item) => ({
      content: item.content,
      role: item.role,
    }));

  messages.value.push({
    content: message,
    id: window.crypto.randomUUID(),
    role: 'user',
  });
  input.value = '';
  isLoading.value = true;
  const assistantMessageId = window.crypto.randomUUID();
  messages.value.push({
    content: '',
    id: assistantMessageId,
    role: 'assistant',
  });
  await scrollToBottom();

  try {
    const response = await fetch(`${apiBase}/api/assistant/chat`, {
      body: JSON.stringify({
        history,
        message,
        stream: true,
      }),
      headers: {
        accept: 'text/event-stream',
        'content-type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      const body = (await response.json()) as { error?: { message?: string } };
      throw new Error('error' in body ? body.error?.message : '');
    }

    if (response.headers.get('content-type')?.includes('text/event-stream') && response.body) {
      await readAssistantStream(response, assistantMessageId);
    } else {
      const result = (await response.json()) as AssistantResponse;
      updateMessage(assistantMessageId, (item) => {
        item.content = result.answer;
        item.sources = result.sources;
        item.warnings = result.warnings;
      });
    }

    const finalMessage = messages.value.find((item) => item.id === assistantMessageId);

    if (!finalMessage?.content.trim()) {
      updateMessage(assistantMessageId, (item) => {
        item.content = '模型暂时没有返回最终答案，请稍后再试。';
      });
    }
  } catch (error) {
    updateMessage(assistantMessageId, (item) => {
      item.content = `暂时无法连接智能助手。${
        error instanceof Error && error.message ? error.message : '请稍后再试。'
      }`;
    });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
}

async function readAssistantStream(response: Response, targetId: string) {
  const reader = response.body?.getReader();

  if (!reader) {
    throw new Error('流式响应为空');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    buffer = buffer.replace(/\r\n/g, '\n');
    let frameEnd = buffer.indexOf('\n\n');

    while (frameEnd !== -1) {
      const frame = buffer.slice(0, frameEnd);
      buffer = buffer.slice(frameEnd + 2);
      handleAssistantStreamFrame(frame, targetId);
      await scrollToBottom();
      frameEnd = buffer.indexOf('\n\n');
    }
  }
}

function handleAssistantStreamFrame(frame: string, targetId: string) {
  const event =
    frame
      .split(/\r?\n/)
      .find((line) => line.startsWith('event:'))
      ?.slice(6)
      .trim() ?? 'message';
  const data = frame
    .split(/\r?\n/)
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trimStart())
    .join('\n');

  if (!data) {
    return;
  }

  const payload = JSON.parse(data) as {
    delta?: string;
    message?: string;
    sources?: AssistantSource[];
    warnings?: string[];
  };

  if (event === 'delta') {
    appendMessageContent(targetId, payload.delta ?? '');
    return;
  }

  if (event === 'done') {
    updateMessage(targetId, (item) => {
      item.sources = payload.sources ?? [];
      item.warnings = payload.warnings ?? [];
    });
    return;
  }

  if (event === 'error') {
    throw new Error(payload.message || '智能助手请求失败');
  }
}

function appendMessageContent(id: string, delta: string) {
  if (!delta) {
    return;
  }

  updateMessage(id, (item) => {
    item.content += delta;
  });
}

function updateMessage(id: string, updater: (message: UiMessage) => void) {
  const message = messages.value.find((item) => item.id === id);

  if (message) {
    updater(message);
  }
}

function renderAssistantMarkdown(message: UiMessage) {
  if (message.role === 'user') {
    return markdown.renderInline(message.content);
  }

  return markdown.render(message.content);
}

async function scrollToBottom() {
  if (!inBrowser) {
    return;
  }

  await nextTick();
  messagesEl.value?.scrollTo({
    behavior: 'smooth',
    top: messagesEl.value.scrollHeight,
  });
}
</script>

<template>
  <div v-if="isEnabled" class="scs-assistant">
    <button
      class="scs-assistant__toggle"
      type="button"
      aria-label="打开 SCSWiki 智能助手"
      title="SCSWiki 智能助手"
      :aria-expanded="isOpen"
      @click="toggleAssistant"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M12 3a8 8 0 0 0-8 8v3.8L2.6 18A1 1 0 0 0 4 19.3l3.1-1.5A8 8 0 1 0 12 3Zm0 2a6 6 0 1 1-3.9 10.6l-.5-.4-1.8.9.8-1.9-.3-.5A6 6 0 0 1 12 5Zm-3 5.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm6 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm-3 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z"
        />
      </svg>
    </button>

    <Transition name="scs-assistant-panel">
      <section
        v-if="isOpen"
        class="scs-assistant__panel"
        role="dialog"
        aria-label="SCSWiki 智能助手"
      >
        <header class="scs-assistant__header">
          <strong>智能助手</strong>
          <button type="button" aria-label="关闭智能助手" title="关闭" @click="isOpen = false">
            ×
          </button>
        </header>

        <div ref="messagesEl" class="scs-assistant__messages" aria-live="polite">
          <article
            v-for="message in messages"
            :key="message.id"
            class="scs-assistant__message"
            :class="`is-${message.role}`"
          >
            <div class="scs-assistant__content" v-html="renderAssistantMarkdown(message)" />

            <div v-if="message.warnings?.length" class="scs-assistant__warnings">
              <span v-for="warning in message.warnings" :key="warning">{{ warning }}</span>
            </div>

            <div v-if="message.sources?.length" class="scs-assistant__sources">
              <a v-for="source in message.sources" :key="source.url" :href="source.url">
                <strong>{{ source.title }}</strong>
                <span>
                  {{ contentTypeLabels[source.content_type] ?? source.content_type }} ·
                  {{ statusLabels[source.status] ?? source.status }}
                </span>
              </a>
            </div>
          </article>

          <div v-if="isLoading" class="scs-assistant__loading">正在检索...</div>
        </div>

        <form class="scs-assistant__form" @submit.prevent="sendMessage">
          <textarea
            v-model="input"
            maxlength="500"
            rows="2"
            aria-label="输入问题"
            placeholder="输入问题..."
            @keydown.enter.exact.prevent="sendMessage"
          />
          <button
            type="submit"
            aria-label="发送"
            title="发送"
            :disabled="isLoading || !input.trim()"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M3 20 21 12 3 4v6l10 2-10 2v6Z" />
            </svg>
          </button>
        </form>
      </section>
    </Transition>
  </div>
</template>
