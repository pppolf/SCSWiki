<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

type LanguageNavItem = {
  id: string;
  label: string;
  icon?: string;
  fallback: string;
  color: string;
};

const items: LanguageNavItem[] = [
  { id: 'overview', label: '总览', fallback: '15', color: '#3451b2' },
  {
    id: 'typescript',
    label: 'TypeScript',
    icon: '/images/programming-languages/typescript.svg',
    fallback: 'TS',
    color: '#3178c6',
  },
  {
    id: 'python',
    label: 'Python',
    icon: '/images/programming-languages/python.svg',
    fallback: 'Py',
    color: '#3776ab',
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    icon: '/images/programming-languages/javascript.svg',
    fallback: 'JS',
    color: '#f7df1e',
  },
  {
    id: 'java',
    label: 'Java',
    icon: '/images/programming-languages/java.svg',
    fallback: 'J',
    color: '#e76f00',
  },
  {
    id: 'csharp',
    label: 'C#',
    icon: '/images/programming-languages/csharp.svg',
    fallback: 'C#',
    color: '#512bd4',
  },
  {
    id: 'php',
    label: 'PHP',
    icon: '/images/programming-languages/php.svg',
    fallback: 'PHP',
    color: '#777bb4',
  },
  {
    id: 'bash',
    label: 'Shell / Bash',
    icon: '/images/programming-languages/bash.svg',
    fallback: '$',
    color: '#4eaa25',
  },
  {
    id: 'cpp',
    label: 'C++',
    icon: '/images/programming-languages/cpp.svg',
    fallback: 'C++',
    color: '#00599c',
  },
  {
    id: 'go',
    label: 'Go',
    icon: '/images/programming-languages/go.svg',
    fallback: 'Go',
    color: '#00add8',
  },
  {
    id: 'c',
    label: 'C',
    icon: '/images/programming-languages/c.svg',
    fallback: 'C',
    color: '#a8b9cc',
  },
  {
    id: 'rust',
    label: 'Rust',
    icon: '/images/programming-languages/rust.svg',
    fallback: 'Rs',
    color: '#ce422b',
  },
  {
    id: 'kotlin',
    label: 'Kotlin',
    icon: '/images/programming-languages/kotlin.svg',
    fallback: 'Kt',
    color: '#7f52ff',
  },
  {
    id: 'ruby',
    label: 'Ruby',
    icon: '/images/programming-languages/ruby.svg',
    fallback: 'Rb',
    color: '#cc342d',
  },
  {
    id: 'swift',
    label: 'Swift',
    icon: '/images/programming-languages/swift.svg',
    fallback: 'Sw',
    color: '#f05138',
  },
  {
    id: 'dart',
    label: 'Dart',
    icon: '/images/programming-languages/dart.svg',
    fallback: 'D',
    color: '#0175c2',
  },
];

const activeId = ref('overview');
const menuOpen = ref(false);
let framePending = false;

function closeMenu() {
  menuOpen.value = false;
}

function hideBrokenIcon(event: Event) {
  (event.currentTarget as HTMLImageElement).hidden = true;
}

function updateActiveItem() {
  framePending = false;
  const activationLine = Math.max(120, window.innerHeight * 0.2);
  let current = items[0].id;

  for (const item of items) {
    const section = document.getElementById(item.id);
    if (section && section.getBoundingClientRect().top <= activationLine) {
      current = item.id;
    }
  }

  activeId.value = current;
}

function handleScroll() {
  if (framePending) return;
  framePending = true;
  window.requestAnimationFrame(updateActiveItem);
}

function selectItem(id: string) {
  activeId.value = id;
  closeMenu();
}

onMounted(() => {
  document.documentElement.classList.add('has-programming-language-guide');
  window.addEventListener('scroll', handleScroll, { passive: true });
  updateActiveItem();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  document.documentElement.classList.remove('has-programming-language-guide');
});
</script>

<template>
  <button
    class="programming-language-nav-toggle"
    type="button"
    :aria-expanded="menuOpen"
    aria-controls="programming-language-nav"
    @click="menuOpen = !menuOpen"
  >
    <span aria-hidden="true">☰</span>
    语言目录
  </button>

  <aside
    id="programming-language-nav"
    class="programming-language-nav"
    :class="{ 'is-open': menuOpen }"
    aria-label="程序设计语言目录"
  >
    <div class="programming-language-nav__title">程序设计语言</div>
    <a
      v-for="item in items"
      :key="item.id"
      class="programming-language-nav__link"
      :class="{ 'is-active': activeId === item.id }"
      :href="`#${item.id}`"
      @click="selectItem(item.id)"
    >
      <span class="programming-language-nav__icon" :style="{ '--language-color': item.color }">
        <span class="programming-language-nav__fallback">{{ item.fallback }}</span>
        <img
          v-if="item.icon"
          :src="item.icon"
          :alt="`${item.label} 图标`"
          loading="lazy"
          @error="hideBrokenIcon"
        />
      </span>
      <span>{{ item.label }}</span>
    </a>
  </aside>

  <button
    v-if="menuOpen"
    class="programming-language-nav-backdrop"
    type="button"
    aria-label="关闭语言目录"
    @click="closeMenu"
  />
</template>
