<script setup lang="ts">
definePageMeta({ layout: false })

const client = useSupabaseClient()
const router = useRouter()

const status = ref<'verifying' | 'success' | 'error'>('verifying')
const message = ref('')

onMounted(async () => {
  // Supabase appends the token to the URL as a hash fragment
  // The JS client handles it automatically on getSession()
  const { data, error } = await client.auth.getSession()

  if (error) {
    status.value = 'error'
    message.value = error.message
    return
  }

  if (data.session) {
    status.value = 'success'
    setTimeout(() => router.push('/dashboard'), 2000)
  }
  else {
    status.value = 'error'
    message.value = 'Confirmation link is invalid or has expired.'
  }
})
</script>

<template>
  <div class="confirm-page">
    <div class="confirm-card">
      <svg
class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.75" aria-hidden="true">
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <circle cx="18" cy="6" r="3" />
        <path d="M6 9v6a3 3 0 003 3h3M18 9v3" />
      </svg>

      <div v-if="status === 'verifying'" class="status-block" aria-live="polite">
        <div class="spinner" aria-hidden="true" />
        <p>Verifying your email…</p>
      </div>

      <div v-else-if="status === 'success'" class="status-block" aria-live="polite">
        <svg
class="status-icon status-icon-success" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <p>Email confirmed. Redirecting you now…</p>
      </div>

      <div v-else class="status-block" role="alert">
        <svg
class="status-icon status-icon-error" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <p>{{ message }}</p>
        <NuxtLink to="/" class="back-link">Back to sign in</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirm-page {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-base);
}

.confirm-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-mid);
  border-radius: var(--radius-lg);
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 360px;
  text-align: center;
}

.brand-icon {
  width: 32px;
  height: 32px;
  color: var(--amber);
}

.status-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.status-block p {
  font-size: 0.9375rem;
  color: var(--text-secondary);
}

.status-icon {
  width: 32px;
  height: 32px;
}

.status-icon-success {
  color: var(--green);
}

.status-icon-error {
  color: var(--red);
}

.spinner {
  width: 28px;
  height: 28px;
  border: 2px solid var(--border-mid);
  border-top-color: var(--amber);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.back-link {
  font-size: 0.875rem;
  color: var(--amber);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.back-link:hover {
  color: var(--text-primary);
}
</style>