import { useDb } from '../../../server/database/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing thread id' })

  const sql = useDb()

  await sql`delete from threads where id = ${id}`

  return { ok: true }
})