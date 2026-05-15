<script setup lang="ts">
import type { DiffHunk } from '~/types/diff'
import type { Thread, ThreadComment } from '~/types/thread'
import type { Collaborator } from '~/types/presence'

const props = defineProps<{
  hunk: DiffHunk
  fileId: string
  threads: Thread[]
  comments: Record<string, ThreadComment[]>
  collaborators: Collaborator[]
}>()

const emit = defineEmits<{
  addComment: [lineNumber: number, side: 'left' | 'right']
  reply: [threadId: string, body: string]
  resolve: [threadId: string]
  reopen: [threadId: string]
}>()

function threadsForLine(lineNumber: number, side: 'left' | 'right') {
  return props.threads.filter(
    t => t.fileId === props.fileId && t.lineNumber === lineNumber && t.side === side,
  )
}

function sideForLine(line: { type: string }): 'left' | 'right' {
  return line.type === 'removed' ? 'left' : 'right'
}
</script>

<template>
  <tbody>
    <tr class="diff-hunk-header" aria-hidden="true">
      <td colspan="4">{{ hunk.header }}</td>
    </tr>

    <template v-for="line in hunk.lines" :key="`${line.oldLineNumber}-${line.newLineNumber}`">
      <DiffLine
        :line="line"
        :has-thread="threadsForLine(line.newLineNumber ?? line.oldLineNumber ?? 0, sideForLine(line)).length > 0"
        :collaborators="collaborators.filter(c =>
          c.lineNumber === (line.newLineNumber ?? line.oldLineNumber) && c.isOnline
        )"
        @add-comment="emit('addComment', line.newLineNumber ?? line.oldLineNumber ?? 0, sideForLine(line))" />

      <InlineThread
        v-for="thread in threadsForLine(line.newLineNumber ?? line.oldLineNumber ?? 0, sideForLine(line))"
        :key="thread.id"
        :thread="thread"
        :comments="comments[thread.id] ?? []"
        @reply="(body: string) => emit('reply', thread.id, body)"
        @resolve="emit('resolve', thread.id)"
        @reopen="emit('reopen', thread.id)" />
    </template>
  </tbody>
</template>

<style scoped>
.diff-hunk-header td {
  padding: 0.25rem 1rem;
  background: var(--bg-raised);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-style: italic;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
</style>