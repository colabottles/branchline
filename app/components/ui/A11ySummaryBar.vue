<script setup lang="ts">
defineProps<{ summary: string }>()
</script>

<template>
  <div class="summary-bar" aria-label="Accessibility summary for this pull request">
    <svg
class="summary-icon" width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
    <p class="summary-text">
      <strong>A11y summary:</strong>
      {{ summary }}
    </p>
  </div>
</template>

<style scoped>
.summary-bar {
  padding: 0.625rem 1rem;
  background: var(--bg-raised);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.summary-icon {
  color: var(--blue);
  flex-shrink: 0;
  margin-top: 1px;
}

.summary-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.summary-text strong {
  color: var(--text-primary);
}
</style>