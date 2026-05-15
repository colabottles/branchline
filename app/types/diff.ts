export type ChangeType = 'added' | 'removed' | 'context'
export type DiffSide = 'left' | 'right'

export interface DiffLine {
  type: ChangeType
  oldLineNumber: number | null
  newLineNumber: number | null
  content: string
}

export interface DiffHunk {
  header: string
  oldStart: number
  newStart: number
  lines: DiffLine[]
}

export interface ParsedDiff {
  hunks: DiffHunk[]
  additions: number
  deletions: number
}