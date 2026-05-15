<script setup lang="ts">
defineProps<{
  error: {
    statusCode: number
    statusMessage: string
    message: string
  }
}>()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="error-page">
    <div class="error-card">
      <svg
class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.75" aria-hidden="true">
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <circle cx="18" cy="6" r="3" />
        <path d="M6 9v6a3 3 0 003 3h3M18 9v3" />
      </svg>

      <p class="error-code" aria-label="Error code">{{ error.statusCode }}</p>
      <h1 class="error-title">
        {{ error.statusCode === 404 ? 'Page not found.' : 'Something went wrong.' }}
      </h1>
      <p class="error-message">
        {{ error.statusCode === 404
          ? 'The page you\'re looking for doesn\'t exist.'
          : error.statusMessage || error.message }}
      </p>

      <button class="error-btn" type="button" @click="handleError">
        Go home
      </button>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-base);
}

.error-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  padding: 2.5rem 2rem;
  max-width: 400px;
  width: 100%;
}

.brand-icon {
  width: 32px;
  height: 32px;
  color: var(--amber);
  margin-bottom: 0.5rem;
}

.error-code {
  font-family: var(--font-mono);
  font-size: 4rem;
  font-weight: 600;
  color: var(--border-bright);
  line-height: 1;
}

.error-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.error-message {
  font-size: 0.9375rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.error-btn {
  margin-top: 0.5rem;
  background: var(--amber);
  color: var(--bg-base);
  font-family: var(--font-ui);
  font-size: 0.9375rem;
  font-weight: 700;
  padding: 0.625rem 1.5rem;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.12s;
}

.error-btn:hover {
  background: #f5b428;
}
</style>