<script setup lang="ts">
import type { DiffLine } from '~/types/diff'
import type { Collaborator } from '~/types/presence'

const props = defineProps<{
  line: DiffLine
  hasThread: boolean
  collaborators: Collaborator[]
}>()

const emit = defineEmits<{ addComment: [] }>()

const rowClass = computed(() => ({
  'diff-line': true,
  'diff-line-added': props.line.type === 'added',
  'diff-line-removed': props.line.type === 'removed',
  'diff-line-context': props.line.type === 'context',
  'has-comment': props.hasThread,
}))

const gutterChar = computed(() => {
  if (props.line.type === 'added') return '+'
  if (props.line.type === 'removed') return '−'
  return ' '
})

const gutterClass = computed(() => ({
  'line-gutter': true,
  'gutter-add': props.line.type === 'added',
  'gutter-del': props.line.type === 'removed',
  'gutter-ctx': props.line.type === 'context',
}))

const lineAriaLabel = computed(() => {
  const action = props.line.type === 'added'
    ? 'Added'
    : props.line.type === 'removed'
      ? 'Removed'
      : 'Context'
  return `${action}: ${props.line.content}`
})
</script>

<template>
  <tr :class="rowClass">
    <td
      class="line-num line-num-old"
      :aria-label="line.oldLineNumber ? `Old line ${line.oldLineNumber}` : undefined">
      {{ line.oldLineNumber ?? '' }}
    </td>
    <td
      class="line-num"
      :aria-label="line.newLineNumber ? `New line ${line.newLineNumber}` : undefined">
      {{ line.newLineNumber ?? '' }}
    </td>
    <td :class="gutterClass" aria-hidden="true">{{ gutterChar }}</td>
    <td class="line-code" :aria-label="lineAriaLabel">
      {{ line.content }}
      <PresenceLabel
        v-for="collab in collaborators"
        :key="collab.userId"
        :name="collab.displayName" />
      <button
        class="line-add-btn"
        type="button"
        :aria-label="`Add comment on line ${line.newLineNumber ?? line.oldLineNumber}`"
        @click="emit('addComment')">
        +
      </button>
    </td>
  </tr>
</template>

<style scoped>
.line-num {
  width: 3rem;
  padding: 0 0.75rem;
  text-align: right;
  color: var(--text-muted);
  font-size: 0.6875rem;
  user-select: none;
  border-right: 1px solid var(--border);
  vertical-align: top;
  white-space: nowrap;
}

.line-num-old {
  border-right: none;
}

.line-gutter {
  width: 2rem;
  text-align: center;
  vertical-align: top;
  user-select: none;
  border-right: 1px solid var(--border);
  padding: 0 0.25rem;
}

.gutter-add {
  color: var(--green);
  font-weight: 600;
}

.gutter-del {
  color: var(--red);
  font-weight: 600;
}

.gutter-ctx {
  color: transparent;
}

.line-code {
  padding: 0 1rem 0 0.75rem;
  white-space: pre;
  word-break: normal;
  vertical-align: top;
  width: 100%;
  position: relative;
}

.line-add-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  background: var(--amber);
  color: var(--bg-base);
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 700;
  transition: opacity 0.15s, transform 0.15s;
}

.line-add-btn:hover {
  transform: translateY(-50%) scale(1.15);
}

.line-add-btn:focus-visible {
  opacity: 1;
}

.diff-line:hover .line-add-btn {
  opacity: 1;
}
</style>