<script setup lang="ts">
// Global ARIA live regions — written to by useA11yAnnouncer()
</script>

<template>
  <div>
    <!-- Polite announcer: thread updates, presence changes -->
    <div
      id="live-announcer"
      aria-live="polite"
      aria-atomic="false"
      class="sr-only" />
    <!-- Assertive announcer: focus-critical alerts -->
    <div
      id="alert-announcer"
      aria-live="assertive"
      aria-atomic="true"
      class="sr-only" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>