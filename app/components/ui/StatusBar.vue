<script setup lang="ts">
import type { Collaborator } from '~/types/presence'

defineProps<{
  onlineCount: number
  commentCount: number
  collaborators: Collaborator[]
}>()
</script>

<template>
  <footer role="contentinfo" aria-label="Review session status" class="status-bar">
    <div class="status-item">
      <span class="status-dot" aria-hidden="true" />
      <span class="status-live">Live</span>
    </div>

    <div class="status-item" :aria-label="`${onlineCount} reviewers online`">
      <svg
width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
      {{ onlineCount }} online
    </div>

    <div class="status-item" :aria-label="`${commentCount} comments`">
      <svg
width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" aria-hidden="true">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
      {{ commentCount }} comments
    </div>

    <div class="status-item" aria-label="Press ? for keyboard shortcuts">
      <kbd>?</kbd> shortcuts
    </div>

    <div class="status-item" aria-label="WCAG 2.2 AA compliance mode active">
      <svg
width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      WCAG 2.2 AA
    </div>
  </footer>
</template>

<style scoped>
.status-bar {
  background: var(--bg-surface);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-muted);
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0 0.625rem;
  height: 100%;
  border-right: 1px solid var(--border);
}

.status-item:last-child {
  border-right: none;
  margin-left: auto;
}

.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--green);
  animation: pulse 2s ease infinite;
}

.status-live {
  color: var(--green);
  font-weight: 600;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
}
</style>