<script setup lang="ts">
import { computed, ref } from 'vue';
import { courseMaterials, type MaterialCategory, type MaterialFile } from '../../materials';

const props = defineProps<{
  course?: keyof typeof courseMaterials;
  categories?: MaterialCategory[];
}>();

const activeFile = ref<MaterialFile | null>(null);

const displayedCategories = computed(() => {
  if (props.categories) {
    return props.categories;
  }

  return props.course ? (courseMaterials[props.course]?.categories ?? []) : [];
});

const activePreviewHref = computed(() => getPreviewHref(activeFile.value));

function getExtension(path: string): string {
  const cleanPath = path.split(/[?#]/)[0] ?? '';
  const dotIndex = cleanPath.lastIndexOf('.');
  return dotIndex >= 0 ? cleanPath.slice(dotIndex + 1).toLowerCase() : '';
}

function getFormat(file: MaterialFile): string {
  return file.format ?? getExtension(file.href).toUpperCase() ?? '文件';
}

function getPreviewHref(file: MaterialFile | null): string | null {
  if (!file) {
    return null;
  }

  const extension = getExtension(file.href);
  return extension === 'pdf' ? file.href : null;
}

function canPreview(file: MaterialFile): boolean {
  return Boolean(getPreviewHref(file));
}

function openPreview(file: MaterialFile) {
  if (canPreview(file)) {
    activeFile.value = file;
  }
}

function closePreview() {
  activeFile.value = null;
}
</script>

<template>
  <div class="material-categories">
    <section
      v-for="category in displayedCategories"
      :key="category.title"
      class="material-category"
    >
      <div class="material-category__header">
        <h3>{{ category.title }}</h3>
        <p>{{ category.description }}</p>
      </div>

      <p v-if="category.resources.length === 0" class="material-category__empty">暂无资料。</p>

      <div v-else class="material-list">
        <article v-for="resource in category.resources" :key="resource.title" class="material-card">
          <div class="material-card__main">
            <div class="material-card__meta">
              <span v-if="resource.status" class="material-card__status">{{
                resource.status
              }}</span>
            </div>
            <h4>{{ resource.title }}</h4>
            <p v-if="resource.description">{{ resource.description }}</p>
          </div>

          <div class="material-file-list">
            <div v-for="file in resource.files" :key="file.href" class="material-file">
              <div class="material-file__meta">
                <span class="material-card__format">{{ getFormat(file) }}</span>
                <span v-if="file.role" class="material-card__status">{{ file.role }}</span>
                <strong>{{ file.title }}</strong>
              </div>
              <div class="material-card__actions">
                <button
                  class="material-card__button"
                  type="button"
                  :disabled="!canPreview(file)"
                  @click="openPreview(file)"
                >
                  预览
                </button>
                <a class="material-card__button primary" :href="file.href" download>下载</a>
              </div>
              <p v-if="!canPreview(file)" class="material-card__note">
                仅 PDF 支持在线预览。该资料请下载后查看。
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>

  <Teleport to="body">
    <div v-if="activeFile" class="material-preview" role="dialog" aria-modal="true">
      <div class="material-preview__panel">
        <div class="material-preview__header">
          <strong>{{ activeFile.title }}</strong>
          <button type="button" aria-label="关闭预览" @click="closePreview">×</button>
        </div>
        <iframe
          v-if="activePreviewHref"
          class="material-preview__frame"
          :src="activePreviewHref"
          :title="`${activeFile.title} 预览`"
        />
      </div>
    </div>
  </Teleport>
</template>
