declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
  export default component;
}

declare module 'markdown-it-katex';

interface ImportMetaEnv {
  readonly VITE_SCS_ASSISTANT_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
