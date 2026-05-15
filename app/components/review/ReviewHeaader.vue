<script setup lang="ts">
import type { Review } from '~/types/review'
import type { Collaborator } from '~/types/presence'

defineProps<{
  review: Review
  collaborators: Collaborator[]
}>()

const emit = defineEmits<{
  approve: []
  submitReview: []
}>()
</script>

<template>
  <header role="banner" class="review-header">
    <div class="header-brand">
      <svg
class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.75" aria-hidden="true">
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <circle cx="18" cy="6" r="3" />
        <path d="M6 9v6a3 3 0 003 3h3M18 9v3" />
      </svg>
      <span class="brand-name">collab-review</span>
    </div>

    <div class="header-pr-info">
      <span class="pr-number" :aria-label="`Pull Request ${review.prNumber}`">
        #{{ review.prNumber }}
      </span>
      <div
        class="pr-branch"
        :aria-label="`Merging ${review.branchHead} into ${review.branchBase}`">
        <span class="pr-branch-label">from</span>
        <span class="pr-branch-name">{{ review.branchHead }}</span>
        <span class="pr-arrow" aria-hidden="true">→</span>
        <span class="pr-base-name">{{ review.branchBase }}</span>
      </div>
    </div>

    <CollabAvatars :collaborators="collaborators" />

    <div class="header-actions">
      <button
        class="btn btn-approve"
        type="button"
        :aria-label="`Approve pull request ${review.prNumber}`"
        @click="emit('approve')">
        <svg
width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.5" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Approve
      </button>
      <button
        class="btn btn-primary"
        type="button"
        :aria-label="`Submit review for pull request ${review.prNumber}`"
        @click="emit('submitReview')">
        Submit Review
      </button>
    </div>
  </header>
</template>

<style scoped>
.review-header {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  position: relative;
  z-index: 100;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0 1.25rem;
  height: 100%;
  border-right: 1px solid var(--border);
  flex-shrink: 0;
}

.brand-icon {
  width: 22px;
  height: 22px;
  color: var(--amber);
}

.brand-name {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.header-pr-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1.25rem;
  flex: 1;
  min-width: 0;
  border-right: 1px solid var(--border);
}

.pr-number {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--amber);
  background: var(--amber-dim);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(240, 165, 0, 0.2);
  white-space: nowrap;
  flex-shrink: 0;
}

.pr-branch {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  min-width: 0;
}

.pr-branch-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.pr-branch-name {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--blue);
  white-space: nowrap;
}

.pr-arrow {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.pr-base-name {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--font-ui);
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.12s;
  line-height: 1;
  white-space: nowrap;
}

.btn-approve {
  background: var(--green-dim);
  color: var(--green);
  border-color: rgba(61, 220, 151, 0.25);
  font-weight: 600;
}

.btn-approve:hover {
  background: rgba(61, 220, 151, 0.2);
}

.btn-primary {
  background: var(--amber);
  color: var(--bg-base);
  font-weight: 700;
}

.btn-primary:hover {
  background: #f5b428;
}
</style>