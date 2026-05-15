interface KeyboardNavOptions {
  onNext: () => void
  onPrev: () => void
  onComment: () => void
  onNextFile: () => void
  onApprove: () => void
  onResolve: () => void
}

export function useKeyboardNav(options: KeyboardNavOptions) {
  function handler(e: KeyboardEvent) {
    const tag = (e.target as HTMLElement).tagName
    // don't fire shortcuts when typing in an input or textarea
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return

    const ctrl = e.metaKey || e.ctrlKey

    if (!ctrl && !e.shiftKey && e.key === 'n') { e.preventDefault(); options.onNext() }
    else if (!ctrl && e.shiftKey && e.key === 'P') { e.preventDefault(); options.onPrev() }
    else if (!ctrl && !e.shiftKey && e.key === 'c') { e.preventDefault(); options.onComment() }
    else if (!ctrl && !e.shiftKey && e.key === ']') { e.preventDefault(); options.onNextFile() }
    else if (ctrl && e.shiftKey && e.key === 'A') { e.preventDefault(); options.onApprove() }
    else if (ctrl && e.shiftKey && e.key === 'R') { e.preventDefault(); options.onResolve() }
  }

  onMounted(() => window.addEventListener('keydown', handler))
  onUnmounted(() => window.removeEventListener('keydown', handler))
}