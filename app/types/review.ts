export type ReviewDecision = 'pending' | 'approved' | 'changes_requested' | 'dismissed'

export interface Review {
  id: string
  prNumber: number
  title: string
  description: string | null
  branchHead: string
  branchBase: string
  repoOwner: string
  repoName: string
  authorName: string
  authorAvatarUrl: string | null
  decision: ReviewDecision
  isDraft: boolean
  additions: number
  deletions: number
  changedFiles: number
  createdAt: string
  updatedAt: string
}

export interface ReviewFile {
  id: string
  reviewId: string
  path: string
  oldPath: string | null
  status: 'added' | 'modified' | 'removed' | 'renamed'
  patch: string | null
  additions: number
  deletions: number
  position: number
}

export interface ReviewParticipant {
  id: string
  reviewId: string
  userId: string
  displayName: string
  avatarUrl: string | null
  decision: ReviewDecision
  lastActiveAt: string | null
  joinedAt: string
}