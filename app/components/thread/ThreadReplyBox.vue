<script setup lang="ts">
const props = defineProps<{ threadId: string }>()
const emit = defineEmits<{
  send: [body: string]
  resolve: []
}>()

const body = ref('')

function handleSend() {
  const trimmed = body.value.trim()
  if (!trimmed) return
  emit('send', trimmed)
  body.value = ''
}

function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <div class="reply-box">
    <label class="sr-only" :for="`reply-${props.threadId}`">
      Reply to thread
    </label>
    <textarea
      :id="`reply-${props.threadId}`"
      v-model="body"
      class="reply-input"
      rows="1"
      placeholder="Reply… (⌘↵ to send)"
      aria-label="Reply to thread"
      @keydown="handleKeydown" />
    <button
      class="btn-send"
      type="button"
      aria-label="Send reply"
      @click="handleSend">
      Send
    </button>
    <button
      class="btn-resolve"
      type="button"
      :aria-label="`Mark thread as resolved`"
      @click="emit('resolve')">
      Resolve
    </button>
  </div>
</template>

<style scoped>
.reply-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.reply-input {
  flex: 1;
  background: var(--bg-raised);
  border: 1px solid var(--border-mid);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: var(--font-ui);
  font-size: 0.75rem;
  padding: 0.375rem 0.625rem;
  resize: none;
  min-height: 32px;
  transition: border-color 0.12s;
}

.reply-input:focus {
  outline: none;
  border-color: var(--amber);
}

.reply-input::placeholder {
  color: var(--text-muted);
}

.btn-send,
.btn-resolve {
  font-family: var(--font-ui);
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.12s;
  border: none;
}

.btn-send {
  background: var(--amber);
  color: var(--bg-base);
  font-weight: 700;
}

.btn-send:hover {
  background: #f5b428;
}

.btn-resolve {
  background: var(--green-dim);
  color: var(--green);
  border: 1px solid rgba(61, 220, 151, 0.25);
}

.btn-resolve:hover {
  background: rgba(61, 220, 151, 0.2);
}
</style>