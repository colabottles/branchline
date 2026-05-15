import type { Thread } from '~/types/thread'
import { useA11yAnnouncer } from '~/composables/useA11yAnnouncer'

export function useJumpToUnresolved(
  threads: Ref<Thread[]>,
  activeFileId: Ref<string | null>,
) {
  const { announce } = useA11yAnnouncer()

  const fileThreads = computed(() =>
    threads.value
      .filter(t => t.fileId === activeFileId.value && t.status === 'open')
      .sort((a, b) => a.lineNumber - b.lineNumber),
  )

  const currentIndex = ref(-1)

  function jumpTo(thread: Thread) {
    const el = document.querySelector(`[data-thread-id="${thread.id}"]`)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      ; (el as HTMLElement).focus()
    announce(`Jumped to unresolved comment on line ${thread.lineNumber}`)
  }

  function next() {
    if (!fileThreads.value.length) {
      announce('No unresolved comments in this file')
      return
    }
    currentIndex.value = (currentIndex.value + 1) % fileThreads.value.length
    const thread = fileThreads.value[currentIndex.value]
    if (thread) jumpTo(thread)
  }

  function prev() {
    if (!fileThreads.value.length) {
      announce('No unresolved comments in this file')
      return
    }
    currentIndex.value =
      (currentIndex.value - 1 + fileThreads.value.length) % fileThreads.value.length
    const thread = fileThreads.value[currentIndex.value]
    if (thread) jumpTo(thread)
  }

  const count = computed(() => fileThreads.value.length)

  return { next, prev, count }
}