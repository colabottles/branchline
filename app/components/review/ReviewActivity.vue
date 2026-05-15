<script setup lang="ts">
import type { ActivityItem } from '~/composables/useActivity'

defineProps<{ items: ActivityItem[] }>()

function timeLabel(iso: string) {
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 10) return 'just now'
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`
  return `${Math.round(diff / 3600)}h ago`
}

const dotClass: Record<ActivityItem['type'], string> = {
  comment: 'dot-comment',
  resolve: 'dot-resolve',
  reopen: 'dot-resolve',
  join: 'dot-join',
  approve: 'dot-join',
}
</script>

<template>
  <section aria-live="polite" aria-label="Live review activity" class="activity-feed">
    <div
      v-for="item in items"
      :key="item.id"
      class="activity-item">
      <div :class="['activity-dot', dotClass[item.type]]" aria-hidden="true" />
      <p class="activity-text">
        <strong>{{ item.authorName }}</strong> {{ item.detail }}
      </p>
      <time class="activity-time" :datetime="item.timestamp">
        {{ timeLabel(item.timestamp) }}
      </time>
    </div>
  </section>
</template>

<style scoped>
.activity-feed {
  display: flex;
  flex-direction: column;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-bottom: 1px solid var(--border);
  animation: slide-in 0.25s ease;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(8px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.activity-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}

.dot-comment {
  background: var(--purple);
}

.dot-resolve {
  background: var(--green);
}

.dot-join {
  background: var(--blue);
}

.activity-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.5;
  flex: 1;
}

.activity-text strong {
  color: var(--text-primary);
}

.activity-time {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  color: var(--text-muted);
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 2px;
}
</style>