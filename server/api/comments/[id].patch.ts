import { useDb } from '../../../server/database/db'
import { renderMarkdown } from '../../../server/utils/markdownRenderer'

interface CommentPatch {
  body: string
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing comment id' })

  const { body } = await readBody<CommentPatch>(event)
  if (!body) throw createError({ statusCode: 400, message: 'Missing body' })

  const bodyHtml = await renderMarkdown(body)
  const sql = useDb()

  await sql`
    update thread_comments set
      body       = ${body},
      body_html  = ${bodyHtml},
      updated_at = now()
    where id = ${id}
  `

  return { ok: true }
})