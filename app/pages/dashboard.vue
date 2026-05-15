<script setup lang="ts">
definePageMeta({ layout: false })

const client = useSupabaseClient()
const user = useSupabaseUser()

// Redirect to login if not signed in
watchEffect(() => {
  if (user.value === null) navigateTo('/')
})

interface DashboardReview {
  id: string
  prNumber: number
  title: string
  branchHead: string
  branchBase: string
  repoOwner: string
  repoName: string
  authorName: string
  authorAvatarUrl: string | null
  decision: 'pending' | 'approved' | 'changes_requested' | 'dismissed'
  isDraft: boolean
  additions: number
  deletions: number
  changedFiles: number
  updatedAt: string
  commentCount: number
  openThreadCount: number
  participants: Array<{ userId: string, displayName: string, avatarUrl: string | null }>
}

const reviews = ref<DashboardReview[]>([])
const pending = ref(true)
const filter = ref<'all' | 'open' | 'approved'>('all')

async function load() {
  pending.value = true

  if (!user.value?.id) {
    pending.value = false
    return
  }

  const { data: reviewData, error: reviewError } = await client
    .from('review_participants')
    .select(`
      review_id,
      reviews (
        id, pr_number, title, branch_head, branch_base,
        repo_owner, repo_name, author_name, author_avatar_url,
        decision, is_draft, additions, deletions, changed_files, updated_at
      )
    `)
    .eq('user_id', user.value.id)

  if (reviewError) console.error(reviewError)

  if (reviewData) {
    const reviewIds = reviewData.map((r: Record<string, unknown>) => r.review_id as string)

    const { data: participantData } = await client
      .from('review_participants')
      .select('review_id, user_id, display_name, avatar_url')
      .in('review_id', reviewIds)

    const { data: threadData } = await client
      .from('threads')
      .select('review_id, id, status')
      .in('review_id', reviewIds)

    reviews.value = reviewData
      .filter((r: Record<string, unknown>) => r.reviews)
      .map((r: Record<string, unknown>) => {
        const rv = r.reviews as Record<string, unknown>
        const rid = rv.id as string
        const threads = (threadData ?? []).filter((t: Record<string, unknown>) => t.review_id === rid)
        const participants = (participantData ?? []).filter((p: Record<string, unknown>) => p.review_id === rid)
        return {
          id: rid,
          prNumber: rv.pr_number as number,
          title: rv.title as string,
          branchHead: rv.branch_head as string,
          branchBase: rv.branch_base as string,
          repoOwner: rv.repo_owner as string,
          repoName: rv.repo_name as string,
          authorName: rv.author_name as string,
          authorAvatarUrl: rv.author_avatar_url as string | null,
          decision: rv.decision as DashboardReview['decision'],
          isDraft: rv.is_draft as boolean,
          additions: rv.additions as number,
          deletions: rv.deletions as number,
          changedFiles: rv.changed_files as number,
          updatedAt: rv.updated_at as string,
          commentCount: threads.length,
          openThreadCount: threads.filter((t: Record<string, unknown>) => t.status === 'open').length,
          participants: participants.map((p: Record<string, unknown>) => ({
            userId: p.user_id as string,
            displayName: p.display_name as string,
            avatarUrl: p.avatar_url as string | null,
          })),
        }
      })
  }

  pending.value = false
}

const filtered = computed(() => {
  if (filter.value === 'open') return reviews.value.filter(r => r.decision === 'pending')
  if (filter.value === 'approved') return reviews.value.filter(r => r.decision === 'approved')
  return reviews.value
})

async function signOut() {
  await client.auth.signOut()
  navigateTo('/')
}

onMounted(load)
</script>

<template>
  <div class="dashboard">
    <header class="dash-header" role="banner">
      <div class="dash-brand">
        <svg
class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.75" aria-hidden="true">
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <circle cx="18" cy="6" r="3" />
          <path d="M6 9v6a3 3 0 003 3h3M18 9v3" />
        </svg>
        <span class="brand-name">BranchLine</span>
      </div>

      <div class="dash-header-right">
        <span class="dash-user" aria-label="Signed in as">{{ user?.email }}</span>
        <button class="btn-signout" type="button" @click="signOut">Sign out</button>
      </div>
    </header>

    <main class="dash-main">
      <div class="dash-toolbar">
        <h1 class="dash-title">Pull Requests</h1>

        <div class="filter-group" role="group" aria-label="Filter pull requests">
          <button
            v-for="f in (['all', 'open', 'approved'] as const)"
            :key="f"
            :class="['filter-btn', filter === f && 'filter-btn-active']"
            type="button"
            :aria-pressed="filter === f"
            @click="filter = f">
            {{ f.charAt(0).toUpperCase() + f.slice(1) }}
          </button>
        </div>
      </div>

      <div
v-if="pending" class="dash-loading" aria-live="polite"
        aria-label="Loading pull requests">
        <div class="spinner" aria-hidden="true" />
        <span>Loading…</span>
      </div>

      <div v-else-if="!filtered.length" class="dash-empty" aria-live="polite">
        <svg
width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.5" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <p>No pull requests found.</p>
      </div>

      <ul v-else class="pr-list" aria-label="Pull request list">
        <li v-for="review in filtered" :key="review.id">
          <NuxtLink
            :to="`/review/${review.repoOwner}/${review.repoName}/${review.prNumber}`"
            class="pr-card-link"
            :aria-label="`Open review for pull request ${review.prNumber}: ${review.title}`">
            <ReviewPrCard v-bind="review" />
          </NuxtLink>
        </li>
      </ul>
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100dvh;
  background: var(--bg-base);
  display: grid;
  grid-template-rows: var(--header-h) 1fr;
}

.dash-header {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
}

.dash-brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.brand-icon {
  width: 20px;
  height: 20px;
  color: var(--amber);
}

.brand-name {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.dash-header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dash-user {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.btn-signout {
  font-family: var(--font-ui);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border-mid);
  border-radius: var(--radius-sm);
  padding: 0.375rem 0.75rem;
  cursor: pointer;
  transition: color 0.12s, border-color 0.12s;
}

.btn-signout:hover {
  color: var(--text-primary);
  border-color: var(--border-bright);
}

.dash-main {
  max-width: 860px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.dash-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.dash-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
}

.filter-group {
  display: flex;
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.filter-btn {
  padding: 0.375rem 0.875rem;
  font-family: var(--font-ui);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
}

.filter-btn:hover {
  color: var(--text-secondary);
}

.filter-btn-active {
  background: var(--bg-overlay);
  color: var(--text-primary);
}

.dash-loading,
.dash-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 4rem 0;
  color: var(--text-muted);
  font-size: 0.9375rem;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 2px solid var(--border-mid);
  border-top-color: var(--amber);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.pr-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
  padding: 0;
}

.pr-card-link {
  display: block;
  text-decoration: none;
}
</style>