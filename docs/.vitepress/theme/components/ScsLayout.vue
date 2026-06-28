<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import { inBrowser, useRoute } from 'vitepress';
import { nextTick, onMounted, onUnmounted, watch } from 'vue';
import ScsCurrentPageTitle from './ScsCurrentPageTitle.vue';
import ScsFloatingActions from './ScsFloatingActions.vue';

const { Layout } = DefaultTheme;
const route = useRoute();

let lastY = 0;
let frame = 0;
let pollTimer = 0;
let settleTimer = 0;

function setNavState() {
  frame = 0;

  if (!inBrowser) {
    return;
  }

  const root = document.documentElement;
  const currentY = window.scrollY;
  const atTop = currentY <= 12;

  root.classList.toggle('scs-nav-expanded', atTop);
  root.classList.toggle('scs-nav-condensed', !atTop);
  root.classList.toggle('scs-nav-scrolling-up', !atTop && currentY < lastY);
  root.classList.toggle('scs-nav-scrolling-down', !atTop && currentY > lastY);

  lastY = currentY;
}

function queueNavState() {
  if (frame === 0) {
    frame = window.requestAnimationFrame(setNavState);
  }

  window.clearTimeout(settleTimer);
  settleTimer = window.setTimeout(setNavState, 140);
}

onMounted(() => {
  setNavState();
  window.addEventListener('scroll', queueNavState, { passive: true });
  window.addEventListener('wheel', queueNavState, { passive: true });
  window.addEventListener('touchmove', queueNavState, { passive: true });
  window.addEventListener('resize', queueNavState, { passive: true });
  pollTimer = window.setInterval(() => {
    if (window.scrollY !== lastY) {
      queueNavState();
    }
  }, 120);
});

onUnmounted(() => {
  window.removeEventListener('scroll', queueNavState);
  window.removeEventListener('wheel', queueNavState);
  window.removeEventListener('touchmove', queueNavState);
  window.removeEventListener('resize', queueNavState);
  window.clearInterval(pollTimer);
  window.clearTimeout(settleTimer);

  if (frame !== 0) {
    window.cancelAnimationFrame(frame);
  }
});

watch(
  () => route.path,
  () => {
    nextTick(setNavState);
  },
);
</script>

<template>
  <Layout>
    <template #nav-bar-title-after>
      <ScsCurrentPageTitle />
    </template>
  </Layout>
  <ScsFloatingActions />
</template>
