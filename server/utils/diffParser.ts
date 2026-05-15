export interface DiffLine {
  type: 'added' | 'removed' | 'context'
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

export function parseDiff(patch: string): DiffHunk[] {
  const hunks: DiffHunk[] = []
  if (!patch.trim()) return hunks

  const rawHunks = patch.split(/^(?=@@)/m).filter(Boolean)

  for (const raw of rawHunks) {
    const lines = raw.split('\n')
    const headerLine = lines[0]
    if (!headerLine) continue

    const match = headerLine.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/)
    if (!match || !match[1] || !match[2]) continue

    const oldStart = parseInt(match[1])
    const newStart = parseInt(match[2])
    const diffLines: DiffLine[] = []
    let oldNum = oldStart
    let newNum = newStart

    for (const line of lines.slice(1)) {
      if (line === '\\ No newline at end of file') continue

      let type: 'added' | 'removed' | 'context' = 'context'
      let content: string = line

      if (line.startsWith('+')) { type = 'added'; content = line.slice(1) }
      else if (line.startsWith('-')) { type = 'removed'; content = line.slice(1) }
      else if (line.startsWith(' ')) { content = line.slice(1) }

      diffLines.push({
        type,
        oldLineNumber: type === 'added' ? null : oldNum++,
        newLineNumber: type === 'removed' ? null : newNum++,
        content,
      })
    }

    hunks.push({ header: headerLine, oldStart, newStart, lines: diffLines })
  }

  return hunks
}