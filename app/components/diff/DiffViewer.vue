<script setup lang="ts">
import type { ReviewFile } from '~/types/review'
import type { Thread, ThreadComment } from '~/types/thread'
import type { Collaborator } from '~/types/presence'

const props = defineProps<{
  file: ReviewFile
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

const { parse } = useDiffParser()

const parsed = computed(() => props.file.patch ? parse(props.file.patch) : null)

const diffAriaLabel = computed(() =>
  `Diff for ${props.file.path}. ${props.file.additions} additions, ${props.file.deletions} deletions.`,
)
</script>

<template>
  <div
    id="diff-viewer"
    class="diff-viewer"
    role="region"
    :aria-label="diffAriaLabel"
    tabindex="0">
    <p class="sr-only">
      Diff for {{ file.path }}: {{ file.additions }} lines added,
      {{ file.deletions }} lines removed across {{ parsed?.hunks.length ?? 0 }} hunks.
    </p>

    <div v-if="!parsed || !parsed.hunks.length" class="diff-empty">
      No diff available for this file.
    </div>

    <table v-else class="diff-table" :aria-label="`Diff lines for ${file.path}`">
      <colgroup>
        <col style="width: 3rem">
        <col style="width: 3rem">
        <col style="width: 2rem">
        <col>
      </colgroup>

      <DiffHunk
        v-for="(hunk, i) in parsed.hunks"
        :key="i"
        :hunk="hunk"
        :file-id="file.id"
        :threads="threads"
        :comments="comments"
        :collaborators="collaborators"
        @add-comment="(line: number, side: 'left' | 'right') => emit('addComment', line, side)"
        @reply="(threadId: string, body: string) => emit('reply', threadId, body)"
        @resolve="(threadId: string) => emit('resolve', threadId)"
        @reopen="(threadId: string) => emit('reopen', threadId)" />
    </table>
  </div>
</template>

<style scoped>
.diff-viewer {
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.6;
}

.diff-viewer:focus {
  outline: none;
  box-shadow: inset 0 0 0 2px var(--amber);
}

.diff-table {
  width: 100%;
  border-collapse: collapse;
  min-width: max-content;
}

.diff-empty {
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
  font-family: var(--font-ui);
  font-size: 0.875rem;
}
</style>