<script setup lang="ts">
import type { Thread } from '~/types/thread'

defineProps<{ threads: Thread[] }>()
const emit = defineEmits<{ jump: [threadId: string] }>()

function statusLabel(thread: Thread) {
  return thread.status === 'resolved' ? 'resolved' : 'open'
}
</script>

<template>
  <nav aria-label="Comment threads">
    <div
      v-for="thread in threads"
      :key="thread.id"
      class="thread-item"
      tabindex="0"
      role="link"
      :aria-label="`Thread on line ${thread.lineNumber}: ${thread.previewText} — ${statusLabel(thread)}`"
      @click="emit('jump', thread.id)"
      @keydown.enter="emit('jump', thread.id)">
      <div class="tli-header">
        <span class="tli-line">L{{ thread.lineNumber }}</span>
        <span :class="['tli-status', `tli-status-${thread.status}`]">
          {{ statusLabel(thread) }}
        </span>
      </div>
      <p class="tli-preview">{{ thread.previewText }}</p>
      <div class="tli-meta">
        <span class="tli-author">{{ thread.authorName }}</span>
        <span class="tli-count">· {{ thread.commentCount }} {{ thread.commentCount === 1 ? 'reply' :
          'replies' }}</span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.thread-item {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.12s;
}

.thread-item:hover {
  background: var(--bg-raised);
}

.tli-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.tli-line {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-muted);
  flex: 1;
}

.tli-status {
  font-size: 0.5625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.1rem 0.375rem;
  border-radius: 10px;
}

.tli-status-open {
  color: var(--amber);
  background: var(--amber-dim);
  border: 1px solid rgba(240, 165, 0, 0.2);
}

.tli-status-resolved {
  color: var(--green);
  background: var(--green-dim);
  border: 1px solid rgba(61, 220, 151, 0.2);
}

.tli-preview {
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
}

.tli-meta {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.tli-author {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.tli-count {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  color: var(--text-muted);
}
</style>