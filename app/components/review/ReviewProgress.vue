<script setup lang="ts">
import type { Thread } from '~/types/thread'
import type { ReviewFile } from '~/types/review'

const props = defineProps<{
  threads: Thread[]
  files: ReviewFile[]
}>()

const emit = defineEmits<{ submitReview: [] }>()

const total = computed(() => props.threads.length)
const open = computed(() => props.threads.filter(t => t.status === 'open').length)
const resolved = computed(() => props.threads.filter(t => t.status === 'resolved').length)
const fileCount = computed(() => props.files.length)

const progressPct = computed(() =>
  fileCount.value ? Math.round((resolved.value / Math.max(total.value, 1)) * 100) : 0,
)
</script>

<template>
  <div class="review-progress" aria-label="Review progress">
    <p class="section-title">Review Progress</p>

    <div class="stats-grid">
      <div class="stat">
        <div class="stat-value stat-comments" :aria-label="`${total} total comments`">{{ total }}
        </div>
        <div class="stat-label">Comments</div>
      </div>
      <div class="stat">
        <div class="stat-value stat-open" :aria-label="`${open} open threads`">{{ open }}</div>
        <div class="stat-label">Open</div>
      </div>
      <div class="stat">
        <div class="stat-value stat-resolved" :aria-label="`${resolved} resolved threads`">{{
          resolved }}</div>
        <div class="stat-label">Resolved</div>
      </div>
      <div class="stat">
        <div class="stat-value stat-files" :aria-label="`${fileCount} files changed`">{{ fileCount
          }}</div>
        <div class="stat-label">Files</div>
      </div>
    </div>

    <div class="progress-label" aria-hidden="true">
      <span>Threads resolved</span>
      <span>{{ resolved }} / {{ total }}</span>
    </div>
    <div
      class="progress-bar"
      role="progressbar"
      :aria-valuenow="progressPct"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="`Review progress: ${resolved} of ${total} threads resolved`">
      <div class="progress-fill" :style="{ width: `${progressPct}%` }" />
    </div>

    <button
      class="btn-submit"
      type="button"
      aria-label="Submit your review"
      @click="emit('submitReview')">
      Submit Review
    </button>
  </div>
</template>

<style scoped>
.review-progress {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--border);
}

.section-title {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 0.625rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
}

.stat {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.625rem;
}

.stat-value {
  font-family: var(--font-mono);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1;
  margin-bottom: 0.2rem;
}

.stat-label {
  font-size: 0.6875rem;
  color: var(--text-muted);
  font-weight: 500;
}

.stat-comments {
  color: var(--purple);
}

.stat-open {
  color: var(--amber);
}

.stat-resolved {
  color: var(--green);
}

.stat-files {
  color: var(--blue);
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.6875rem;
  color: var(--text-muted);
  margin-bottom: 0.3rem;
}

.progress-bar {
  height: 4px;
  background: var(--bg-raised);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.875rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--green), #5eead4);
  border-radius: 10px;
  transition: width 0.4s ease;
}

.btn-submit {
  width: 100%;
  background: var(--amber);
  color: var(--bg-base);
  font-family: var(--font-ui);
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.5rem;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.12s;
}

.btn-submit:hover {
  background: #f5b428;
}
</style>