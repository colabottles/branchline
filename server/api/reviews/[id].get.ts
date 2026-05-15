import { useDb } from '../../database/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing review id' })

  const sql = useDb()

  const rows = await sql`
    select
      id,
      pr_number,
      title,
      description,
      branch_head,
      branch_base,
      repo_owner,
      repo_name,
      author_name,
      author_avatar_url,
      decision,
      is_draft,
      additions,
      deletions,
      changed_files,
      created_at,
      updated_at
    from reviews
    where id = ${id}
    limit 1
  `

  const row = rows[0]
  if (!row) throw createError({ statusCode: 404, message: 'Review not found' })

  return {
    id: row.id,
    prNumber: row.pr_number,
    title: row.title,
    description: row.description,
    branchHead: row.branch_head,
    branchBase: row.branch_base,
    repoOwner: row.repo_owner,
    repoName: row.repo_name,
    authorName: row.author_name,
    authorAvatarUrl: row.author_avatar_url,
    decision: row.decision,
    isDraft: row.is_draft,
    additions: row.additions,
    deletions: row.deletions,
    changedFiles: row.changed_files,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
})