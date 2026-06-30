import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import AutoMergeTable from './components/AutoMergeTable.vue';
import ContentMeta from './components/ContentMeta.vue';
import HomePage from './components/HomePage.vue';
import MaterialResourceList from './components/MaterialResourceList.vue';
import ScsLayout from './components/ScsLayout.vue';
import 'katex/dist/katex.min.css';
import './custom.css';

export default {
  extends: DefaultTheme,
  Layout: ScsLayout,
  enhanceApp({ app }) {
    app.component('AutoMergeTable', AutoMergeTable);
    app.component('ContentMeta', ContentMeta);
    app.component('HomePage', HomePage);
    app.component('MaterialResourceList', MaterialResourceList);
  },
} satisfies Theme;
