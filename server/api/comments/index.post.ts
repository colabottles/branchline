import { useDb } from '../../../server/database/db'
import { renderMarkdown } from '../../../server/utils/markdownRenderer'

interface CommentBody {
  threadId: string
  reviewId: string
  body: string
  authorId: string
  authorName: string
  authorAvatar: string | null
}

export default defineEventHandler(async (event) => {
  const payload = await readBody<CommentBody>(event)

  if (!payload.threadId || !payload.reviewId || !payload.body || !payload.authorId) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  if (payload.body.length > 65535) {
    throw createError({ statusCode: 400, message: 'Comment body too long' })
  }

  const bodyHtml = await renderMarkdown(payload.body)
  const sql = useDb()

  const rows = await sql`
    insert into thread_comments (
      thread_id, review_id, body, body_html,
      author_id, author_name, author_avatar
    ) values (
      ${payload.threadId}, ${payload.reviewId}, ${payload.body}, ${bodyHtml},
      ${payload.authorId}, ${payload.authorName}, ${payload.authorAvatar}
    )
    returning *
  `

  const row = rows[0]
  if (!row) throw createError({ statusCode: 500, message: 'Insert failed' })

  return {
    id: row.id,
    threadId: row.thread_id,
    reviewId: row.review_id,
    body: row.body,
    bodyHtml: row.body_html,
    authorId: row.author_id,
    authorName: row.author_name,
    authorAvatar: row.author_avatar,
    isEdited: row.is_edited,
    editedAt: row.edited_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
})