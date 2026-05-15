<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import DOMPurify from 'dompurify'
import type { ThreadComment } from '~/types/thread'

const props = defineProps<{ comment: ThreadComment }>()

const safeHtml = computed(() =>
  props.comment.bodyHtml ? DOMPurify.sanitize(props.comment.bodyHtml) : null,
)

function timeLabel(iso: string) {
  const date = new Date(iso)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="thread-comment">
    <div
      class="thread-avatar"
      :style="{ background: '#7c3aed' }"
      aria-hidden="true">
      {{ comment.authorName.slice(0, 2).toUpperCase() }}
    </div>
    <div class="thread-body">
      <div class="thread-meta">
        <span class="thread-author">{{ comment.authorName }}</span>
        <time
          class="thread-time"
          :datetime="comment.createdAt">
          {{ timeLabel(comment.createdAt) }}
        </time>
        <span v-if="comment.isEdited" class="thread-edited">(edited)</span>
      </div>
      <div
        v-if="safeHtml"
        class="thread-text"
        v-html="safeHtml" />
      <p v-else class="thread-text">{{ comment.body }}</p>
    </div>
  </div>
</template>

<style scoped>
.thread-comment {
  display: flex;
  gap: 0.625rem;
  margin-bottom: 0.5rem;
}

.thread-comment:last-of-type {
  margin-bottom: 0;
}

.thread-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 0.5rem;
  font-weight: 600;
  color: #fff;
  margin-top: 1px;
}

.thread-body {
  flex: 1;
  min-width: 0;
}

.thread-meta {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.1875rem;
}

.thread-author {
  font-family: var(--font-ui);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
}

.thread-time {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  color: var(--text-muted);
}

.thread-edited {
  font-size: 0.625rem;
  color: var(--text-muted);
  font-style: italic;
}

.thread-text {
  font-family: var(--font-ui);
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.5;
}
</style>