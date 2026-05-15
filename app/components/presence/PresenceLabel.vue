<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <span class="presence-label" :aria-label="`${name} is viewing this line`">
    👁 {{ name }}
  </span>
</template>

<style scoped>
.presence-label {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 600;
  background: #7c3aed;
  color: #fff;
  padding: 0.1rem 0.375rem;
  border-radius: 10px;
  margin-left: 0.5rem;
  animation: fade-in 0.2s ease;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>