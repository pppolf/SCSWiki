import type { DefaultTheme } from 'vitepress';
import { siteSections } from './site-map';

export const nav: DefaultTheme.NavItem[] = siteSections.map((section) => ({
  activeMatch: section.activeMatch,
  items: section.links.map((link) => ({ link: link.href, text: link.title })),
  text: section.title,
}));
