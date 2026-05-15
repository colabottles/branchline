import type { Review, ReviewFile } from '~/types/review'

export function useReview(reviewId: Ref<string>) {
  const review = ref<Review | null>(null)
  const files = ref<ReviewFile[]>([])
  const activeFileId = ref<string | null>(null)
  const pending = ref(false)
  const error = ref<string | null>(null)

  const activeFile = computed(() =>
    files.value.find(f => f.id === activeFileId.value) ?? null,
  )

  async function load() {
    if (!reviewId.value) return
    pending.value = true
    error.value = null

    try {
      const [reviewData, filesData] = await Promise.all([
        $fetch<Review>(`/api/reviews/${reviewId.value}`),
        $fetch<ReviewFile[]>(`/api/reviews/${reviewId.value}/files`),
      ])
      review.value = reviewData
      files.value = filesData
      const firstFile = filesData[0]
      if (firstFile && !activeFileId.value) {
        activeFileId.value = firstFile.id
      }
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load review'
    }
    finally {
      pending.value = false
    }
  }

  function setActiveFile(fileId: string) {
    activeFileId.value = fileId
  }

  watch(reviewId, load, { immediate: true })

  return { review, files, activeFile, activeFileId, pending, error, setActiveFile }
}