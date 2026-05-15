<script setup lang="ts">
import DOMPurify from 'dompurify'

const props = defineProps<{
  source: string
}>()

const { html: rawHtml } = useMarkdownPreview(toRef(props, 'source'))

const safeHtml = computed(() =>
  rawHtml.value ? DOMPurify.sanitize(rawHtml.value) : '',
)
</script>

<template>
  <div class="md-preview-wrap">
    <div
      v-if="source.trim()"
      class="md-preview"
      aria-label="Markdown preview"
      aria-live="polite">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="safeHtml" />
    </div>
    <div v-else class="md-empty">
      Nothing to preview.
    </div>
  </div>
</template>

<style scoped>
.md-preview-wrap {
  padding: 1.25rem;
  overflow-y: auto;
  flex: 1;
}

.md-empty {
  color: var(--text-muted);
  font-size: 0.8125rem;
  font-family: var(--font-ui);
  padding: 1rem 0;
}

.md-preview :deep(h1),
.md-preview :deep(h2),
.md-preview :deep(h3) {
  font-family: var(--font-ui);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.25;
}

.md-preview :deep(h1) {
  font-size: 1.125rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
  margin-bottom: 0.75rem;
}

.md-preview :deep(h2) {
  font-size: 0.9375rem;
  color: var(--text-secondary);
}

.md-preview :deep(h3) {
  font-size: 0.875rem;
  color: var(--amber);
}

.md-preview :deep(p) {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.65;
  margin-bottom: 0.75rem;
}

.md-preview :deep(ul),
.md-preview :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}

.md-preview :deep(li) {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 0.25rem;
}

.md-preview :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  background: var(--bg-raised);
  color: var(--amber);
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  border: 1px solid var(--border-mid);
}

.md-preview :deep(pre) {
  background: var(--bg-raised);
  border: 1px solid var(--border-mid);
  border-radius: var(--radius-sm);
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  overflow-x: auto;
}

.md-preview :deep(pre code) {
  background: none;
  border: none;
  padding: 0;
  color: var(--text-secondary);
}

.md-preview :deep(blockquote) {
  border-left: 3px solid var(--amber);
  padding-left: 0.75rem;
  margin-bottom: 0.75rem;
  color: var(--text-muted);
  font-style: italic;
  font-size: 0.8125rem;
}

.md-preview :deep(a) {
  color: var(--blue);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.md-preview :deep(a:hover) {
  color: var(--text-primary);
}

.md-preview :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 1rem 0;
}

.md-preview :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
  margin-bottom: 0.75rem;
}

.md-preview :deep(th),
.md-preview :deep(td) {
  padding: 0.375rem 0.625rem;
  border: 1px solid var(--border-mid);
  color: var(--text-secondary);
  text-align: left;
}

.md-preview :deep(th) {
  background: var(--bg-raised);
  color: var(--text-primary);
  font-weight: 600;
}
</style>