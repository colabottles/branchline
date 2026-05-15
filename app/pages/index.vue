<script setup lang="ts">
definePageMeta({ layout: false })

const user = useSupabaseUser()
const client = useSupabaseClient()

// Redirect to dashboard if already signed in
watchEffect(() => {
  if (user.value) navigateTo('/dashboard')
})

const email = ref('')
const password = ref('')
const mode = ref<'login' | 'signup'>('login')
const error = ref<string | null>(null)
const pending = ref(false)

async function handleDemo() {
  error.value = null
  pending.value = true

  try {
    const { error: err } = await client.auth.signInWithPassword({
      email: 'demo@collab-review.dev',
      password: 'collab-review-demo',
    })
    if (err) throw err
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'Something went wrong'
  }
  finally {
    pending.value = false
  }
}

async function handleSubmit() {
  error.value = null
  pending.value = true

  try {
    if (mode.value === 'login') {
      const { error: err } = await client.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (err) throw err
    }
    else {
      const { error: err } = await client.auth.signUp({
        email: email.value,
        password: password.value,
      })
      if (err) throw err
    }
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'Something went wrong'
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="landing">
    <div class="landing-bg" aria-hidden="true">
      <div class="bg-grid" />
      <div class="bg-glow" />
    </div>

    <main class="landing-main">
      <header class="landing-header">
        <div class="brand">
          <svg
class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="1.75" aria-hidden="true">
            <circle cx="6" cy="6" r="3" />
            <circle cx="18" cy="18" r="3" />
            <circle cx="18" cy="6" r="3" />
            <path d="M6 9v6a3 3 0 003 3h3M18 9v3" />
          </svg>
          <span class="brand-name">BranchLine</span>
        </div>
      </header>

      <section class="hero" aria-labelledby="hero-heading">
        <div class="hero-badge" aria-hidden="true">
          <span class="badge-dot" />
          Realtime · Accessible · Collaborative
        </div>

        <h1 id="hero-heading" class="hero-title">
          Code review the way it<br >
          <span class="hero-accent">should have always been.</span>
        </h1>

        <p class="hero-sub">
          Threaded discussions that sync live. Keyboard-only review mode.
          Screen-reader diff summaries. Built for teams that ship with confidence.
        </p>

        <ul class="feature-list" aria-label="Key features">
          <li class="feature-item">
            <svg
width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Jump to next unresolved comment with <kbd>N</kbd>
          </li>
          <li class="feature-item">
            <svg
width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            See who's reviewing which line, live
          </li>
          <li class="feature-item">
            <svg
width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            WCAG 2.2 AA — semantic diffs, focus-preserving updates
          </li>
          <li class="feature-item">
            <svg
width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Markdown previews in the sidebar, realtime
          </li>
        </ul>

        <button
          class="demo-btn"
          type="button"
          :disabled="pending"
          :aria-busy="pending"
          @click="handleDemo">
          <svg
width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" aria-hidden="true">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          {{ pending ? 'Signing in…' : 'Try the demo' }}
        </button>
      </section>

      <section class="auth-card" aria-labelledby="auth-heading">
        <div class="auth-tabs" role="tablist" aria-label="Authentication mode">
          <button
            role="tab"
            :aria-selected="mode === 'login'"
            class="auth-tab"
            type="button"
            @click="mode = 'login'">
            Sign in
          </button>
          <button
            role="tab"
            :aria-selected="mode === 'signup'"
            class="auth-tab"
            type="button"
            @click="mode = 'signup'">
            Create account
          </button>
        </div>

        <h2 id="auth-heading" class="sr-only">
          {{ mode === 'login' ? 'Sign in to your account' : 'Create a new account' }}
        </h2>

        <div
          v-if="error"
          class="auth-error"
          role="alert"
          aria-live="assertive">
          <svg
width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {{ error }}
        </div>

        <div class="auth-form">
          <div class="field">
            <label class="field-label" for="email">Email</label>
            <input
              id="email"
              v-model="email"
              class="field-input"
              type="email"
              autocomplete="email"
              required
              :aria-describedby="error ? 'auth-error' : undefined" >
          </div>

          <div class="field">
            <label class="field-label" for="password">Password</label>
            <input
              id="password"
              v-model="password"
              class="field-input"
              type="password"
              :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
              required >
          </div>

          <button
            class="auth-submit"
            type="button"
            :disabled="pending"
            :aria-busy="pending"
            @click="handleSubmit">
            {{ pending ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account' }}
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.landing {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: var(--bg-base);
  padding: 2rem 1rem;
}

.landing-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.4;
}

.bg-glow {
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(240, 165, 0, 0.08) 0%, transparent 70%);
}

.landing-main {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 900px;
  display: grid;
  grid-template-columns: 1fr 360px;
  grid-template-rows: auto 1fr;
  gap: 3rem;
}

.landing-header {
  grid-column: 1 / -1;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.brand-icon {
  width: 24px;
  height: 24px;
  color: var(--amber);
}

.brand-name {
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--amber);
  background: var(--amber-dim);
  border: 1px solid rgba(240, 165, 0, 0.2);
  border-radius: 10px;
  padding: 0.25rem 0.75rem;
  width: fit-content;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--amber);
  animation: pulse 2s ease infinite;
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

.hero-title {
  font-family: var(--font-ui);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 900;
  line-height: 1.15;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.hero-accent {
  color: var(--amber);
}

.hero-sub {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.65;
  max-width: 44ch;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  list-style: none;
  padding: 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.feature-item svg {
  color: var(--green);
  flex-shrink: 0;
}

.auth-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-mid);
  border-radius: var(--radius-lg);
  overflow: hidden;
  align-self: start;
}

.auth-tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
}

.auth-tab {
  flex: 1;
  padding: 0.75rem;
  font-family: var(--font-ui);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-muted);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.12s;
}

.auth-tab:hover {
  color: var(--text-secondary);
}

.auth-tab[aria-selected="true"] {
  color: var(--text-primary);
  border-bottom-color: var(--amber);
}

.auth-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 1.25rem 0;
  padding: 0.625rem 0.75rem;
  background: var(--red-dim);
  border: 1px solid rgba(255, 95, 109, 0.25);
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  color: var(--red);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.field-input {
  background: var(--bg-raised);
  border: 1px solid var(--border-mid);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: var(--font-ui);
  font-size: 0.9375rem;
  padding: 0.625rem 0.75rem;
  transition: border-color 0.12s;
  width: 100%;
}

.field-input:focus {
  outline: none;
  border-color: var(--amber);
}

.field-input::placeholder {
  color: var(--text-muted);
}

.field-input,
.auth-submit {
  box-sizing: border-box;
}

.auth-submit {
  background: var(--amber);
  color: var(--bg-base);
  font-family: var(--font-ui);
  font-size: 0.9375rem;
  font-weight: 700;
  padding: 0.75rem;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.12s, opacity 0.12s;
  width: 100%;
}

.auth-submit:hover:not(:disabled) {
  background: #f5b428;
}

.auth-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.demo-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  color: var(--amber);
  font-family: var(--font-ui);
  font-size: 0.9375rem;
  font-weight: 700;
  padding: 0.625rem 1.25rem;
  border: 2px solid var(--amber);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  width: fit-content;
}

.demo-btn:hover:not(:disabled) {
  background: var(--amber);
  color: var(--bg-base);
}

.demo-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 700px) {
  .landing-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>