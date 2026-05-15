<script setup lang="ts">
import type { ReviewFile } from '~/types/review'

defineProps<{
  files: ReviewFile[]
  activeFileId: string | null
  threadCounts: Record<string, number>
}>()

const emit = defineEmits<{ select: [fileId: string] }>()

function statusClass(status: ReviewFile['status']) {
  return {
    added: 'status-added',
    modified: 'status-modified',
    removed: 'status-removed',
    renamed: 'status-modified',
  }[status]
}
</script>

<template>
  <div role="tablist" aria-label="Changed files" class="file-tabs">
    <button
      v-for="file in files"
      :key="file.id"
      role="tab"
      :aria-selected="file.id === activeFileId"
      :tabindex="file.id === activeFileId ? 0 : -1"
      class="file-tab"
      @click="emit('select', file.id)">
      <span :class="['tab-status', statusClass(file.status)]" aria-hidden="true" />
      {{ file.path.split('/').at(-1) }}
      <span
        v-if="threadCounts[file.id]"
        class="comments-badge"
        :aria-label="`${threadCounts[file.id]} comments`">
        {{ threadCounts[file.id] }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.file-tabs {
  display: flex;
  align-items: stretch;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
  scrollbar-width: none;
  flex-shrink: 0;
}

.file-tabs::-webkit-scrollbar {
  display: none;
}

.file-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1rem;
  height: 38px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  border-bottom: 2px solid transparent;
  border-right: 1px solid var(--border);
  border-top: none;
  border-left: none;
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.12s, background 0.12s;
}

.file-tab:hover {
  color: var(--text-secondary);
  background: var(--bg-raised);
}

.file-tab[aria-selected="true"] {
  color: var(--text-primary);
  border-bottom-color: var(--amber);
  background: var(--bg-base);
}

.tab-status {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-modified {
  background: var(--amber);
}

.status-added {
  background: var(--green);
}

.status-removed {
  background: var(--red);
}

.comments-badge {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 600;
  background: var(--purple-dim);
  color: var(--purple);
  border-radius: 10px;
  padding: 0.1rem 0.375rem;
  border: 1px solid rgba(167, 139, 250, 0.2);
}
</style>