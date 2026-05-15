import { useDb } from '../../../server/database/db'

interface ThreadPatch {
  status?: 'open' | 'resolved'
  resolvedBy?: string | null
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing thread id' })

  const body = await readBody<ThreadPatch>(event)
  const sql = useDb()

  if (body.status === 'resolved' && body.resolvedBy) {
    await sql`
      update threads set
        status      = 'resolved',
        resolved_by = ${body.resolvedBy},
        resolved_at = now(),
        updated_at  = now()
      where id = ${id}
    `
  }
  else if (body.status === 'open') {
    await sql`
      update threads set
        status      = 'open',
        resolved_by = null,
        resolved_at = null,
        updated_at  = now()
      where id = ${id}
    `
  }

  return { ok: true }
})