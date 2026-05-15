import { marked } from 'marked'

export function useMarkdownPreview(source: Ref<string>) {
  const html = computed(() => {
    if (!source.value.trim()) return ''
    return marked.parse(source.value, { async: false }) as string
  })

  return { html }
}