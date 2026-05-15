export type ThreadStatus = 'open' | 'resolved'
export type DiffSide = 'left' | 'right'

export interface Thread {
  id: string
  reviewId: string
  fileId: string
  lineNumber: number
  side: DiffSide
  previewText: string
  status: ThreadStatus
  resolvedBy: string | null
  resolvedAt: string | null
  authorId: string
  authorName: string
  authorAvatar: string | null
  commentCount: number
  createdAt: string
  updatedAt: string
}

export interface ThreadComment {
  id: string
  threadId: string
  reviewId: string
  body: string
  bodyHtml: string | null
  authorId: string
  authorName: string
  authorAvatar: string | null
  isEdited: boolean
  editedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface NewThread {
  fileId: string
  lineNumber: number
  side: DiffSide
  body: string
}

export interface NewComment {
  threadId: string
  body: string
}