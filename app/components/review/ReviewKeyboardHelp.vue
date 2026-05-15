<template>
  <div class="kbd-panel" aria-labelledby="kbd-title">
    <p id="kbd-title" class="kbd-title">Keyboard Shortcuts</p>
    <ul class="kbd-list" aria-label="Available keyboard shortcuts">
      <li class="kbd-item">
        <span class="kbd-desc">Next unresolved</span>
        <span class="kbd-keys"><kbd>N</kbd></span>
      </li>
      <li class="kbd-item">
        <span class="kbd-desc">Prev unresolved</span>
        <span class="kbd-keys"><kbd>⇧</kbd><kbd>P</kbd></span>
      </li>
      <li class="kbd-item">
        <span class="kbd-desc">Add comment</span>
        <span class="kbd-keys"><kbd>C</kbd></span>
      </li>
      <li class="kbd-item">
        <span class="kbd-desc">Resolve thread</span>
        <span class="kbd-keys"><kbd>⌘</kbd><kbd>⇧</kbd><kbd>R</kbd></span>
      </li>
      <li class="kbd-item">
        <span class="kbd-desc">Next file</span>
        <span class="kbd-keys"><kbd>]</kbd></span>
      </li>
      <li class="kbd-item">
        <span class="kbd-desc">Approve PR</span>
        <span class="kbd-keys"><kbd>⌘</kbd><kbd>⇧</kbd><kbd>A</kbd></span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.kbd-panel {
  padding: 0.875rem 1rem;
}

.kbd-title {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 0.625rem;
}

.kbd-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  list-style: none;
}

.kbd-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kbd-desc {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.kbd-keys {
  display: flex;
  gap: 0.25rem;
}
</style>