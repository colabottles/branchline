<script setup lang="ts">
import type { ReviewFile } from '~/types/review'

defineProps<{
  file: ReviewFile
  viewMode: 'split' | 'unified'
}>()

const emit = defineEmits<{
  viewModeChange: ['split' | 'unified']
}>()
</script>

<template>
  <div class="diff-toolbar" role="toolbar" :aria-label="`Diff options for ${file.path}`">
    <span class="diff-filename">
      {{ file.path.split('/').slice(0, -1).join('/') }}/
      <strong>{{ file.path.split('/').at(-1) }}</strong>
    </span>

    <div
      class="diff-stats"
      :aria-label="`Changes: ${file.additions} additions, ${file.deletions} deletions`">
      <span class="stat-add" :aria-label="`${file.additions} lines added`">+{{ file.additions
        }}</span>
      <span class="stat-del" :aria-label="`${file.deletions} lines deleted`">−{{ file.deletions
        }}</span>
    </div>

    <div class="view-toggle" role="group" aria-label="Diff view mode">
      <button
        class="toggle-btn"
        type="button"
        :aria-pressed="viewMode === 'split'"
        @click="emit('viewModeChange', 'split')">
        Split
      </button>
      <button
        class="toggle-btn"
        type="button"
        :aria-pressed="viewMode === 'unified'"
        @click="emit('viewModeChange', 'unified')">
        Unified
      </button>
    </div>
  </div>
</template>

<style scoped>
.diff-toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.diff-filename {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-primary);
  flex: 1;
}

.diff-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-add {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--green);
}

.stat-del {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--red);
}

.view-toggle {
  display: flex;
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.toggle-btn {
  padding: 0.25rem 0.625rem;
  font-family: var(--font-ui);
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
}

.toggle-btn[aria-pressed="true"] {
  background: var(--bg-overlay);
  color: var(--text-primary);
}
</style>