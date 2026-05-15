import type { Collaborator, CursorPosition } from '~/types/presence'

export function usePresence(reviewId: Ref<string>) {
  const client = useSupabaseClient()
  const user = useSupabaseUser()

  const collaborators = ref<Collaborator[]>([])

  const STALE_MS = 5 * 60 * 1000

  function isOnline(seenAt: string): boolean {
    return Date.now() - new Date(seenAt).getTime() < STALE_MS
  }

  async function loadSnapshot() {
    const { data } = await client.rpc('get_active_cursors' as never, {
      p_review_id: reviewId.value,
    } as never)

    if (data) {
      collaborators.value = (data as Record<string, unknown>[]).map(row => ({
        userId: row.user_id as string,
        displayName: row.display_name as string,
        avatarUrl: row.avatar_url as string | null,
        filePath: row.file_path as string | null,
        lineNumber: row.line_number as number | null,
        seenAt: row.seen_at as string,
        isOnline: isOnline(row.seen_at as string),
      }))
    }
  }

  function subscribe() {
    const currentUser = user.value
    if (!currentUser) return

    const channel = client.channel(`presence:${reviewId.value}`, {
      config: { presence: { key: currentUser.id } },
    })

    type PresencePayload = {
      displayName: string
      avatarUrl: string | null
      filePath: string | null
      lineNumber: number | null
      seenAt: string
    }

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<PresencePayload>()

        collaborators.value = Object.entries(state).map(([userId, presences]) => {
          const p = presences[0]
          return {
            userId,
            displayName: p?.displayName ?? '',
            avatarUrl: p?.avatarUrl ?? null,
            filePath: p?.filePath ?? null,
            lineNumber: p?.lineNumber ?? null,
            seenAt: p?.seenAt ?? new Date().toISOString(),
            isOnline: true,
          }
        })
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        const collab = collaborators.value.find(c => c.userId === key)
        if (collab) collab.isOnline = false
      })
      .subscribe()

    onUnmounted(() => client.removeChannel(channel))

    return channel
  }

  async function updatePosition(position: CursorPosition) {
    const currentUser = user.value
    if (!currentUser) return

    await client.rpc('upsert_cursor_position' as never, {
      p_review_id: position.reviewId,
      p_file_id: position.fileId,
      p_file_path: position.filePath,
      p_line_number: position.lineNumber,
      p_display_name: position.displayName,
      p_avatar_url: position.avatarUrl,
    } as never)
  }

  function collaboratorsOnLine(filePath: string, lineNumber: number) {
    return computed(() =>
      collaborators.value.filter(
        c => c.filePath === filePath && c.lineNumber === lineNumber && c.isOnline,
      ),
    )
  }

  watch(reviewId, loadSnapshot, { immediate: true })

  return { collaborators, subscribe, updatePosition, collaboratorsOnLine }
}