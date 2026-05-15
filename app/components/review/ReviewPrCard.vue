<script setup lang="ts">
defineProps<{
  id: string
  prNumber: number
  title: string
  repoOwner: string
  repoName: string
  authorName: string
  decision: string
  additions: number
  deletions: number
  changedFiles: number
}>()
</script>

<template>
  <article class="pr-card">
    <div class="pr-card-top">
      <span class="pr-number">#{{ prNumber }}</span>
      <span class="pr-title">{{ title }}</span>
    </div>

    <div class="pr-meta">
      <span class="pr-owner">{{ repoOwner }}/{{ repoName }}</span>
      <span class="pr-author">{{ authorName }}</span>
    </div>

    <div class="pr-stats">
      <span class="pr-additions">+{{ additions }}</span>
      <span class="pr-deletions">-{{ deletions }}</span>
      <span class="pr-changedFiles">{{ changedFiles }} files</span>
    </div>
  </article>
</template>

<style scoped>
article {
  font-family: var(--font-mono);
}
.pr-card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  background-color: var(--bg);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
.pr-title, .pr-owner, .pr-author, .pr-additions, .pr-deletions, .pr-changedFiles {
  margin: 0 1rem;
}
.pr-number {
  font-weight: bold;
  color: var(--text-primary);
}
.pr-owner, .pr-author {
  color: var(--text-secondary);
}
.pr-additions {
  color: var(--green);
}
.pr-deletions {
  color: var(--red);
}
</style>