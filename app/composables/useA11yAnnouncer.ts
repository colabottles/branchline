export function useA11yAnnouncer() {
  function announce(message: string) {
    const el = document.getElementById('live-announcer')
    if (!el) return
    el.textContent = ''
    requestAnimationFrame(() => { el.textContent = message })
  }

  function announceUrgent(message: string) {
    const el = document.getElementById('alert-announcer')
    if (!el) return
    el.textContent = ''
    requestAnimationFrame(() => { el.textContent = message })
  }

  return { announce, announceUrgent }
}