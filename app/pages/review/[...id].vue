<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const prId = computed(() => (route.params.id as string[]).join('/'))

const { review, files, activeFile, activeFileId, setActiveFile } = useReview(prId)
const { threads, comments, openThreads, loadComments, addComment, resolveThread, reopenThread, subscribeRealtime } = useThreads(prId)
const { collaborators, subscribe: subscribePresence } = usePresence(prId)
const { items: activityItems, subscribe: subscribeActivity } = useActivity(prId)
const { next: jumpNext, prev: jumpPrev, count: unresolvedCount } = useJumpToUnresolved(openThreads, activeFileId)

const viewMode = ref<'split' | 'unified'>('split')

const threadCounts = computed(() => {
  const counts: Record<string, number> = {}
  for (const thread of threads.value) {
    counts[thread.fileId] = (counts[thread.fileId] ?? 0) + 1
  }
  return counts
})

const activeFileThreads = computed(() =>
  threads.value.filter(t => t.fileId === activeFileId.value),
)

function handleAddComment(_lineNumber: number, _side: 'left' | 'right') {
  // placeholder — will open a comment compose panel
}

async function handleReply(threadId: string, body: string) {
  await addComment({ threadId, body })
}

async function handleResolve(threadId: string) {
  await resolveThread(threadId)
}

async function handleReopen(threadId: string) {
  await reopenThread(threadId)
}

function handleJumpToThread(threadId: string) {
  const el = document.querySelector(`[data-thread-id="${threadId}"]`)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    ; (el as HTMLElement).focus()
}

useKeyboardNav({
  onNext: jumpNext,
  onPrev: jumpPrev,
  onComment: () => { },
  onNextFile: () => {
    const idx = files.value.findIndex(f => f.id === activeFileId.value)
    const next = files.value[idx + 1]
    if (next) setActiveFile(next.id)
  },
  onApprove: () => { },
  onResolve: () => { },
})

onMounted(() => {
  subscribeRealtime()
  subscribePresence()
  subscribeActivity()
})

watch(activeFileId, (id) => {
  if (!id) return
  const fileThreads = threads.value.filter(t => t.fileId === id)
  for (const thread of fileThreads) {
    if (!comments.value[thread.id]) loadComments(thread.id)
  }
})
</script>

<template>
  <div class="review-shell">
    <SkipLink />

    <ReviewHeader
      v-if="review"
      :review="review"
      :collaborators="collaborators"
      @approve="() => { }"
      @submit-review="() => { }" />

    <main v-if="review" class="review-main">
      <section class="diff-panel" aria-label="Code diff viewer">
        <FileTabs
          :files="files"
          :active-file-id="activeFileId"
          :thread-counts="threadCounts"
          @select="setActiveFile" />

        <DiffToolbar
          v-if="activeFile"
          :file="activeFile"
          :view-mode="viewMode"
          @view-mode-change="viewMode = $event" />

        <JumpBar
          :count="unresolvedCount"
          @next="jumpNext"
          @prev="jumpPrev" />

        <DiffViewer
          v-if="activeFile"
          :file="activeFile"
          :threads="activeFileThreads"
          :comments="comments"
          :collaborators="collaborators"
          @add-comment="handleAddComment"
          @reply="handleReply"
          @resolve="handleResolve"
          @reopen="handleReopen" />
      </section>

      <ReviewSidebar
        :threads="threads"
        :files="files"
        :activity-items="activityItems"
        :md-source="review.description ?? ''"
        a11y-summary="This PR improves semantic HTML and ARIA attribute usage across form components."
        @jump-to-thread="handleJumpToThread"
        @submit-review="() => { }" />
    </main>

    <StatusBar
      v-if="review"
      :online-count="collaborators.filter(c => c.isOnline).length"
      :comment-count="threads.length"
      :collaborators="collaborators" />
  </div>
</template>

<style scoped>
.review-shell {
  display: grid;
  grid-template-rows: var(--header-h) 1fr var(--statusbar-h);
  height: 100dvh;
  overflow: hidden;
}

.review-main {
  display: grid;
  grid-template-columns: 1fr var(--sidebar-w);
  overflow: hidden;
}

.diff-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid var(--border);
}
</style>