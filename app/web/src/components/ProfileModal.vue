<script setup lang="ts">
import { ref, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import { useAuth } from '@/composables/useAuth'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const auth = useAuth()
const error = ref('')
const success = ref(false)

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const changePassword = ref(false)
const passwordCopied = ref(false)

watch(
  () => props.open,
  (val) => {
    if (val) {
      error.value = ''
      success.value = false
      showPassword.value = false
      changePassword.value = false
      passwordCopied.value = false
      name.value = auth.user.value?.name ?? ''
      email.value = auth.user.value?.email ?? ''
      password.value = generatePassword()
    }
  },
)

function generatePassword(length = 16): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return result
}

async function copyPassword() {
  try {
    await navigator.clipboard.writeText(password.value)
    passwordCopied.value = true
    setTimeout(() => {
      passwordCopied.value = false
    }, 2000)
  } catch {
    const el = document.createElement('textarea')
    el.value = password.value
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    passwordCopied.value = true
    setTimeout(() => {
      passwordCopied.value = false
    }, 2000)
  }
}

async function handleUpdate() {
  error.value = ''
  success.value = false

  if (changePassword.value) {
    if (!password.value || password.value.length < 8 || password.value.length > 100) {
      error.value = 'Password must be between 8 and 100 characters'
      return
    }
  }

  try {
    await auth.updateProfile({ name: name.value, email: email.value })

    if (changePassword.value && auth.user.value) {
      await auth.resetPassword(auth.user.value.id, password.value)
      success.value = true
    } else {
      success.value = true
    }
  } catch (e: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error.value = (e as any)?.value ?? 'Failed to update profile'
  }
}
</script>

<template>
  <Modal :open="open" title="Profile" @close="emit('close')">
    <div class="profile-modal">
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">Saved</p>

      <form @submit.prevent="handleUpdate" class="form">
        <label>
          Name
          <input v-model="name" type="text" required minlength="2" maxlength="50" />
        </label>
        <label>
          Email
          <input v-model="email" type="email" disabled />
        </label>

        <div class="form-field">
          <label class="checkbox-label">
            <input v-model="changePassword" type="checkbox" />
            Change password
          </label>
        </div>

        <div v-if="changePassword" class="form-field">
          <span class="field-label">New password (auto-generated)</span>
          <div class="password-input-wrapper">
            <input
              v-model="password"
              :class="['password-input', { masked: !showPassword }]"
              placeholder="At least 8 characters"
              required
              minlength="8"
              maxlength="100"
              autocomplete="off"
              spellcheck="false"
            />
            <div class="password-buttons">
              <button
                type="button"
                class="btn-icon"
                :title="showPassword ? 'Hide' : 'Show'"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '👁️‍🗨️' : '👁️' }}
              </button>
              <button type="button" class="btn-icon" title="Copy" @click="copyPassword">
                {{ passwordCopied ? '✓' : '📋' }}
              </button>
              <button
                type="button"
                class="btn-icon"
                title="Regenerate"
                @click="password = generatePassword()"
              >
                🔄
              </button>
            </div>
          </div>
        </div>

        <button type="submit" class="btn-primary">Save</button>
      </form>
    </div>
  </Modal>
</template>

<style scoped>
.profile-modal {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form label:not(.checkbox-label) {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}

.form input {
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text-h);
  font-size: 14px;
}

.form input:focus {
  outline: none;
  border-color: var(--accent);
}

.form input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  font-size: 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: var(--text);
}

.checkbox-label input[type='checkbox'] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #3b82f6;
}

.password-input-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  padding-right: 4px;
}

.password-input-wrapper:focus-within {
  border-color: var(--accent);
}

.password-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px 10px;
  color: var(--text-h);
  font-size: 14px;
  outline: none;
}

.password-input:focus {
  border: none;
}

.password-input.masked {
  -webkit-text-security: disc;
}

.password-buttons {
  display: flex;
  gap: 2px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: rgba(0, 0, 0, 0.05);
}

.btn-primary {
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: var(--accent);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.85;
}

.error {
  color: #ef4444;
  font-size: 13px;
  margin: 0;
}

.success {
  color: #22c55e;
  font-size: 13px;
  margin: 0;
}
</style>
