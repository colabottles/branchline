<script setup lang="ts">
import type { Thread } from '~/types/thread'
import type { ReviewFile } from '~/types/review'
import type { ActivityItem } from '~/composables/useActivity'

defineProps<{
  threads: Thread[]
  files: ReviewFile[]
  activityItems: ActivityItem[]
  a11ySummary: string
  mdSource: string
}>()

const emit = defineEmits<{
  jumpToThread: [threadId: string]
  submitReview: []
}>()

const activeTab = ref<'overview' | 'threads' | 'md' | 'activity'>('overview')

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'threads', label: 'Threads' },
  { key: 'md', label: 'MD' },
  { key: 'activity', label: 'Live' },
] as const
</script>

<template>
  <aside class="sidebar" aria-label="Review sidebar">
    <div role="tablist" aria-label="Sidebar panels" class="sidebar-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        role="tab"
        :aria-selected="activeTab === tab.key"
        :tabindex="activeTab === tab.key ? 0 : -1"
        class="sidebar-tab"
        @click="activeTab = tab.key">
        {{ tab.label }}
        <span
          v-if="tab.key === 'threads' && threads.length"
          :aria-label="`${threads.length} threads`">
          {{ threads.length }}
        </span>
      </button>
    </div>

    <div class="sidebar-body" role="tabpanel" :aria-labelledby="`stab-${activeTab}`">
      <template v-if="activeTab === 'overview'">
        <A11ySummaryBar :summary="a11ySummary" />
        <ReviewProgress
          :threads="threads"
          :files="files"
          @submit-review="emit('submitReview')" />
        <ReviewThreadList
          :threads="threads"
          @jump="threadId => emit('jumpToThread', threadId)" />
        <ReviewKeyboardHelp />
      </template>

      <template v-else-if="activeTab === 'threads'">
        <ReviewThreadList
          :threads="threads"
          @jump="threadId => emit('jumpToThread', threadId)" />
      </template>

      <template v-else-if="activeTab === 'md'">
        <MarkdownPreview :source="mdSource" />
      </template>

      <template v-else-if="activeTab === 'activity'">
        <ReviewActivity :items="activityItems" />
      </template>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-surface);
}

.sidebar-tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.sidebar-tab {
  flex: 1;
  padding: 0.625rem 0.5rem;
  font-family: var(--font-ui);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-align: center;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.12s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}

.sidebar-tab:hover {
  color: var(--text-secondary);
}

.sidebar-tab[aria-selected="true"] {
  color: var(--text-primary);
  border-bottom-color: var(--amber);
}

.sidebar-body {
  flex: 1;
  overflow-y: auto;
}
</style>