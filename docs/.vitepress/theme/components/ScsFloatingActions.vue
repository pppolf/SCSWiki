<script setup lang="ts">
import { inBrowser, useRoute } from 'vitepress';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

const route = useRoute();
const isVisible = ref(false);

let frame = 0;

function updateVisibility() {
  frame = 0;

  if (!inBrowser) {
    return;
  }

  isVisible.value = window.scrollY > 360;
}

function queueVisibilityUpdate() {
  if (frame === 0) {
    frame = window.requestAnimationFrame(updateVisibility);
  }
}

function scrollToTop() {
  if (!inBrowser) {
    return;
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

onMounted(() => {
  updateVisibility();
  window.addEventListener('scroll', queueVisibilityUpdate, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', queueVisibilityUpdate);

  if (frame !== 0) {
    window.cancelAnimationFrame(frame);
  }
});

watch(
  () => route.path,
  () => {
    nextTick(updateVisibility);
  },
);
</script>

<template>
  <div class="scs-floating-actions" aria-label="页面浮动操作">
    <button
      class="scs-back-to-top"
      type="button"
      aria-label="回到顶部"
      title="回到顶部"
      :class="{ 'is-visible': isVisible }"
      @click="scrollToTop"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 5l7 7-1.4 1.4-4.6-4.6V20h-2V8.8l-4.6 4.6L5 12l7-7z" />
      </svg>
    </button>
  </div>
</template>
