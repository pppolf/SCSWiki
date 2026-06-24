import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import ContentMeta from './components/ContentMeta.vue';
import HomePage from './components/HomePage.vue';
import 'katex/dist/katex.min.css';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ContentMeta', ContentMeta);
    app.component('HomePage', HomePage);
  },
} satisfies Theme;
