import type { Thread, ThreadComment, NewThread, NewComment } from '~/types/thread'

export function useThreads(reviewId: Ref<string>) {
  const client = useSupabaseClient()
  const user = useSupabaseUser()

  const threads = ref<Thread[]>([])
  const comments = ref<Record<string, ThreadComment[]>>({})
  const pending = ref(false)

  const openThreads = computed(() => threads.value.filter(t => t.status === 'open'))
  const resolvedThreads = computed(() => threads.value.filter(t => t.status === 'resolved'))

  function threadsForLine(fileId: string, lineNumber: number, side: 'left' | 'right') {
    return computed(() =>
      threads.value.filter(
        t => t.fileId === fileId && t.lineNumber === lineNumber && t.side === side,
      ),
    )
  }

  async function load() {
    if (!reviewId.value) return
    pending.value = true

    const { data } = await client
      .from('threads')
      .select('*')
      .eq('review_id', reviewId.value)
      .order('created_at', { ascending: true })

    if (data) threads.value = (data as Record<string, unknown>[]).map(mapThread)
    pending.value = false
  }

  async function loadComments(threadId: string) {
    const { data } = await client
      .from('thread_comments')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true })

    if (data) comments.value[threadId] = (data as Record<string, unknown>[]).map(mapComment)
  }

  async function createThread(payload: NewThread, body: string): Promise<Thread | null> {
    const currentUser = user.value
    if (!currentUser) return null

    const previewText = body.slice(0, 280)
    const authorName = (currentUser.user_metadata?.full_name as string | undefined)
      ?? currentUser.email
      ?? 'Anonymous'
    const authorAvatar = (currentUser.user_metadata?.avatar_url as string | undefined) ?? null

    const { data: thread, error } = await client
      .from('threads')
      .insert({
        review_id: reviewId.value,
        file_id: payload.fileId,
        line_number: payload.lineNumber,
        side: payload.side,
        preview_text: previewText,
        author_id: currentUser.id,
        author_name: authorName,
        author_avatar: authorAvatar,
      } as never)
      .select()
      .single()

    if (error || !thread) return null

    const mapped = mapThread(thread as Record<string, unknown>)
    threads.value.push(mapped)
    await addComment({ threadId: mapped.id, body })
    return mapped
  }

  async function addComment(payload: NewComment): Promise<ThreadComment | null> {
    const currentUser = user.value
    if (!currentUser) return null

    const authorName = (currentUser.user_metadata?.full_name as string | undefined)
      ?? currentUser.email
      ?? 'Anonymous'
    const authorAvatar = (currentUser.user_metadata?.avatar_url as string | undefined) ?? null

    const optimistic: ThreadComment = {
      id: crypto.randomUUID(),
      threadId: payload.threadId,
      reviewId: reviewId.value,
      body: payload.body,
      bodyHtml: null,
      authorId: currentUser.id,
      authorName,
      authorAvatar,
      isEdited: false,
      editedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (!comments.value[payload.threadId]) comments.value[payload.threadId] = []
    comments.value[payload.threadId]!.push(optimistic)

    const { data, error } = await client
      .from('thread_comments')
      .insert({
        thread_id: payload.threadId,
        review_id: reviewId.value,
        body: payload.body,
        author_id: currentUser.id,
        author_name: authorName,
        author_avatar: authorAvatar,
      } as never)
      .select()
      .single()

    if (error || !data) {
      comments.value[payload.threadId] = comments.value[payload.threadId]!.filter(
        c => c.id !== optimistic.id,
      )
      return null
    }

    const list = comments.value[payload.threadId]!
    const idx = list.findIndex(c => c.id === optimistic.id)
    if (idx !== -1) list[idx] = mapComment(data as Record<string, unknown>)

    return mapComment(data as Record<string, unknown>)
  }

  async function resolveThread(threadId: string) {
    await client.rpc('resolve_thread' as never, { p_thread_id: threadId } as never)
    const thread = threads.value.find(t => t.id === threadId)
    if (thread) thread.status = 'resolved'
  }

  async function reopenThread(threadId: string) {
    await client.rpc('reopen_thread' as never, { p_thread_id: threadId } as never)
    const thread = threads.value.find(t => t.id === threadId)
    if (thread) thread.status = 'open'
  }

  function subscribeRealtime() {
    const channel = client
      .channel(`threads:${reviewId.value}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'threads', filter: `review_id=eq.${reviewId.value}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            threads.value.push(mapThread(payload.new as Record<string, unknown>))
          }
          else if (payload.eventType === 'UPDATE') {
            const row = payload.new as Record<string, unknown>
            const idx = threads.value.findIndex(t => t.id === row.id)
            if (idx !== -1) threads.value[idx] = mapThread(row)
          }
          else if (payload.eventType === 'DELETE') {
            const row = payload.old as Record<string, unknown>
            threads.value = threads.value.filter(t => t.id !== row.id)
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'thread_comments', filter: `review_id=eq.${reviewId.value}` },
        (payload) => {
          const comment = mapComment(payload.new as Record<string, unknown>)
          if (!comments.value[comment.threadId]) comments.value[comment.threadId] = []
          const exists = comments.value[comment.threadId]!.some(c => c.id === comment.id)
          if (!exists) comments.value[comment.threadId]!.push(comment)
        },
      )
      .subscribe()

    onUnmounted(() => client.removeChannel(channel))
  }

  function mapThread(row: Record<string, unknown>): Thread {
    return {
      id: row.id as string,
      reviewId: row.review_id as string,
      fileId: row.file_id as string,
      lineNumber: row.line_number as number,
      side: row.side as 'left' | 'right',
      previewText: row.preview_text as string,
      status: row.status as 'open' | 'resolved',
      resolvedBy: row.resolved_by as string | null,
      resolvedAt: row.resolved_at as string | null,
      authorId: row.author_id as string,
      authorName: row.author_name as string,
      authorAvatar: row.author_avatar as string | null,
      commentCount: row.comment_count as number,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    }
  }

  function mapComment(row: Record<string, unknown>): ThreadComment {
    return {
      id: row.id as string,
      threadId: row.thread_id as string,
      reviewId: row.review_id as string,
      body: row.body as string,
      bodyHtml: row.body_html as string | null,
      authorId: row.author_id as string,
      authorName: row.author_name as string,
      authorAvatar: row.author_avatar as string | null,
      isEdited: row.is_edited as boolean,
      editedAt: row.edited_at as string | null,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    }
  }

  watch(reviewId, load, { immediate: true })

  return {
    threads,
    comments,
    pending,
    openThreads,
    resolvedThreads,
    threadsForLine,
    loadComments,
    createThread,
    addComment,
    resolveThread,
    reopenThread,
    subscribeRealtime,
  }
}