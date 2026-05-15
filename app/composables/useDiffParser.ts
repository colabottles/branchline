import type { ParsedDiff, DiffHunk, DiffLine, ChangeType } from '~/types/diff'

export function useDiffParser() {
  function parse(patch: string): ParsedDiff {
    const hunks: DiffHunk[] = []
    let additions = 0
    let deletions = 0

    if (!patch.trim()) return { hunks, additions, deletions }

    const rawHunks = patch.split(/^(?=@@)/m).filter(Boolean)

    for (const raw of rawHunks) {
      const lines = raw.split('\n')
      const headerLine = lines[0]
      if (!headerLine) continue
      const match = headerLine.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/)
      if (!match || !match[1] || !match[2]) continue

      const oldStart = parseInt(match[1])
      const newStart = parseInt(match[2])
      const header = headerLine

      const diffLines: DiffLine[] = []
      let oldNum = oldStart
      let newNum = newStart

      for (const line of lines.slice(1)) {
        if (!line && diffLines.length === 0) continue

        let type: ChangeType = 'context'
        let content: string = line

        if (line.startsWith('+')) {
          type = 'added'
          content = line.slice(1)
          additions++
        }
        else if (line.startsWith('-')) {
          type = 'removed'
          content = line.slice(1)
          deletions++
        }
        else if (line.startsWith(' ')) {
          content = line.slice(1)
        }
        else if (line === '\\ No newline at end of file') {
          continue
        }

        diffLines.push({
          type,
          oldLineNumber: type === 'added' ? null : oldNum++,
          newLineNumber: type === 'removed' ? null : newNum++,
          content,
        })
      }

      hunks.push({ header, oldStart, newStart, lines: diffLines })
    }

    return { hunks, additions, deletions }
  }

  return { parse }
}