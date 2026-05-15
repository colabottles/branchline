export interface Collaborator {
  userId: string
  displayName: string
  avatarUrl: string | null
  filePath: string | null
  lineNumber: number | null
  seenAt: string
  isOnline: boolean
}

export interface PresenceState {
  collaborators: Collaborator[]
}

export interface CursorPosition {
  reviewId: string
  fileId: string | null
  filePath: string | null
  lineNumber: number | null
  displayName: string
  avatarUrl: string | null
}