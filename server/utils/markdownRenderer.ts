import { marked } from 'marked'

export async function renderMarkdown(source: string): Promise<string> {
  return await marked.parse(source)
}