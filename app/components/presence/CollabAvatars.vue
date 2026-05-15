<script setup lang="ts">
import type { Collaborator } from '~/types/presence'

defineProps<{ collaborators: Collaborator[] }>()

function initials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const colors = ['#7c3aed', '#0891b2', '#b45309', '#059669', '#dc2626']
function avatarColor(userId: string) {
  let hash = 0
  for (const char of userId) hash = (hash + char.charCodeAt(0)) % colors.length
  return colors[hash] ?? colors[0]
}
</script>

<template>
  <div class="collaborators" aria-label="Active reviewers">
    <span class="collab-label" aria-hidden="true">Live</span>
    <div
      class="avatar-stack"
      role="list"
      :aria-label="`${collaborators.length} reviewers`">
      <div
        v-for="collab in collaborators"
        :key="collab.userId"
        role="listitem"
        :class="['avatar', collab.isOnline && 'online']"
        :style="{ background: avatarColor(collab.userId) }"
        :title="collab.displayName"
        :aria-label="`${collab.displayName}, ${collab.isOnline ? 'active' : 'offline'}`">
        {{ initials(collab.displayName) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.collaborators {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  border-right: 1px solid var(--border);
}

.collab-label {
  font-size: 0.6875rem;
  color: var(--text-muted);
  margin-right: 0.5rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.avatar-stack {
  display: flex;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 600;
  color: #fff;
  margin-left: -6px;
  position: relative;
  cursor: default;
  transition: transform 0.15s;
}

.avatar:first-child {
  margin-left: 0;
}

.avatar:hover {
  transform: translateY(-2px);
  z-index: 10;
}

.avatar.online::after {
  content: '';
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--green);
  border: 2px solid var(--bg-surface);
}
</style>