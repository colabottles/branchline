<script setup lang="ts">
defineProps<{ count: number }>()
const emit = defineEmits<{
  next: []
  prev: []
}>()
</script>

<template>
  <div
    v-if="count > 0"
    class="jump-bar"
    role="region"
    aria-label="Unresolved comments navigation">
    <svg
class="jump-icon" width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
    <span class="jump-text">Unresolved comments in this file</span>
    <span class="jump-count" :aria-label="`${count} unresolved`">{{ count }} open</span>
    <button
      class="jump-btn"
      type="button"
      :aria-label="`Jump to previous unresolved comment, keyboard shortcut: shift+P`"
      @click="emit('prev')">
      <svg
width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2.5" aria-hidden="true">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      Prev <kbd aria-hidden="true">⇧P</kbd>
    </button>
    <button
      class="jump-btn"
      type="button"
      :aria-label="`Jump to next unresolved comment, keyboard shortcut: N`"
      @click="emit('next')">
      Next <kbd aria-hidden="true">N</kbd>
      <svg
width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2.5" aria-hidden="true">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.jump-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.375rem 1rem;
  background: var(--purple-dim);
  border-bottom: 1px solid rgba(167, 139, 250, 0.2);
  flex-shrink: 0;
}

.jump-icon {
  color: var(--purple);
  flex-shrink: 0;
}

.jump-text {
  font-size: 0.75rem;
  color: var(--purple);
  font-weight: 500;
  flex: 1;
}

.jump-count {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--purple);
  background: rgba(167, 139, 250, 0.2);
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
}

.jump-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: var(--font-ui);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--purple);
  background: transparent;
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: var(--radius-sm);
  padding: 0.25rem 0.625rem;
  cursor: pointer;
  transition: background 0.12s;
}

.jump-btn:hover {
  background: rgba(167, 139, 250, 0.15);
}
</style>