export type ActivityType = 'comment' | 'resolve' | 'reopen' | 'join' | 'approve'

export interface ActivityItem {
  id: string
  type: ActivityType
  authorName: string
  detail: string
  timestamp: string
}

export function useActivity(reviewId: Ref<string>) {
  const client = useSupabaseClient()
  const items = ref<ActivityItem[]>([])

  function add(item: Omit<ActivityItem, 'id' | 'timestamp'>) {
    items.value.unshift({
      ...item,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    })
    if (items.value.length > 50) items.value.pop()
  }

  function subscribe() {
    const channel = client
      .channel(`activity:${reviewId.value}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'thread_comments', filter: `review_id=eq.${reviewId.value}` },
        (payload) => {
          const row = payload.new as Record<string, unknown>
          add({ type: 'comment', authorName: row.author_name as string, detail: 'left a comment' })
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'threads', filter: `review_id=eq.${reviewId.value}` },
        (payload) => {
          const row = payload.new as Record<string, unknown>
          if (row.status === 'resolved') {
            add({ type: 'resolve', authorName: 'A reviewer', detail: 'resolved a thread' })
          }
          else if (row.status === 'open') {
            add({ type: 'reopen', authorName: 'A reviewer', detail: 'reopened a thread' })
          }
        },
      )
      .subscribe()

    onUnmounted(() => client.removeChannel(channel))
  }

  return { items, add, subscribe }
}