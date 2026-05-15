import { useDb } from '../../../server/database/db'

interface ThreadBody {
  reviewId: string
  fileId: string
  lineNumber: number
  side: 'left' | 'right'
  previewText: string
  authorId: string
  authorName: string
  authorAvatar: string | null
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ThreadBody>(event)

  if (!body.reviewId || !body.fileId || !body.lineNumber || !body.authorId) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  if (body.previewText.length > 280) {
    throw createError({ statusCode: 400, message: 'previewText exceeds 280 characters' })
  }

  const sql = useDb()

  const rows = await sql`
    insert into threads (
      review_id, file_id, line_number, side,
      preview_text, author_id, author_name, author_avatar
    ) values (
      ${body.reviewId}, ${body.fileId}, ${body.lineNumber}, ${body.side},
      ${body.previewText}, ${body.authorId}, ${body.authorName}, ${body.authorAvatar}
    )
    returning *
  `

  const row = rows[0]
  if (!row) throw createError({ statusCode: 500, message: 'Insert failed' })

  return {
    id: row.id,
    reviewId: row.review_id,
    fileId: row.file_id,
    lineNumber: row.line_number,
    side: row.side,
    previewText: row.preview_text,
    status: row.status,
    resolvedBy: row.resolved_by,
    resolvedAt: row.resolved_at,
    authorId: row.author_id,
    authorName: row.author_name,
    authorAvatar: row.author_avatar,
    commentCount: row.comment_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
})