import { useDb } from '../../../server/database/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing review id' })

  const sql = useDb()

  const rows = await sql`
    select
      id,
      review_id,
      path,
      old_path,
      status,
      patch,
      additions,
      deletions,
      position
    from review_files
    where review_id = ${id}
    order by position asc
  `

  return rows.map(row => ({
    id: row.id,
    reviewId: row.review_id,
    path: row.path,
    oldPath: row.old_path,
    status: row.status,
    patch: row.patch,
    additions: row.additions,
    deletions: row.deletions,
    position: row.position,
  }))
})