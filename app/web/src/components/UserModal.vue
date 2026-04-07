<script setup lang="ts">
import { ref, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import { useAuth } from '@/composables/useAuth'

const props = defineProps<{
  open: boolean
  mode: 'create' | 'edit'
  user?: { id: string; name: string; email: string } | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const auth = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const passwordCopied = ref(false)
const changePassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')

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

watch(
  () => props.open,
  (val) => {
    if (val) {
      error.value = ''
      success.value = ''
      showPassword.value = false
      passwordCopied.value = false
      changePassword.value = false

      if (props.mode === 'edit' && props.user) {
        name.value = props.user.name
        email.value = props.user.email
        password.value = generatePassword()
      } else {
        name.value = ''
        email.value = ''
        password.value = generatePassword()
      }
    }
  },
)

async function handleSubmit() {
  error.value = ''
  success.value = ''

  if (!name.value.trim() || name.value.length < 2 || name.value.length > 50) {
    error.value = 'Name must be between 2 and 50 characters'
    return
  }

  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = 'Enter a valid email address'
    return
  }

  if (props.mode === 'create' || changePassword.value) {
    if (!password.value || password.value.length < 8 || password.value.length > 100) {
      error.value = 'Password must be between 8 and 100 characters'
      return
    }
  }

  loading.value = true

  try {
    if (props.mode === 'create') {
      await auth.createUser({
        name: name.value.trim(),
        email: email.value.trim(),
        password: password.value,
      })
      success.value = 'User created successfully!'
    } else if (props.user) {
      await auth.updateUser(props.user.id, {
        name: name.value.trim(),
        email: email.value.trim(),
      })

      if (changePassword.value) {
        await auth.resetPassword(props.user.id, password.value)
        success.value = 'User updated, password changed!'
      } else {
        success.value = 'User updated!'
      }
    }

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('users-updated'))
      emit('saved')
      emit('close')
    }, 1000)
  } catch (e: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = e as any
    if (err?.summary || err?.message) {
      error.value = err.summary || err.message
    } else {
      error.value = 'An error occurred while saving'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Modal
    :open="open"
    :title="mode === 'create' ? 'Create User' : 'Edit User'"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="user-form" autocomplete="off">
      <div class="form-group">
        <label for="user-name">Name</label>
        <input
          id="user-name"
          v-model="name"
          type="text"
          placeholder="Enter name"
          required
          minlength="2"
          maxlength="50"
        />
      </div>

      <div class="form-group">
        <label for="user-email">Email</label>
        <input id="user-email" v-model="email" type="email" placeholder="Enter email" required />
      </div>

      <template v-if="mode === 'create'">
        <div class="form-group">
          <span class="field-label">Password (auto-generated)</span>
          <div class="password-input-wrapper">
            <input
              id="user-password"
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
      </template>

      <template v-if="mode === 'edit'">
        <div class="form-group">
          <label class="checkbox-label">
            <input v-model="changePassword" type="checkbox" />
            Change password
          </label>
        </div>

        <template v-if="changePassword">
          <div class="form-group">
            <span class="field-label">New password (auto-generated)</span>
            <div class="password-input-wrapper">
              <input
                id="user-new-password"
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
        </template>
      </template>

      <div v-if="error" class="message error">{{ error }}</div>
      <div v-if="success" class="message success">{{ success }}</div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="emit('close')">Cancel</button>
        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Save' }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<style scoped>
.user-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}

.form-group .field-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}

.form-group input {
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #3b82f6;
}

.checkbox-label {
  display: flex;
  flex-direction: row;
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

.password-input.masked {
  -webkit-text-security: disc;
}

.password-input-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg);
  padding-right: 4px;
  transition: border-color 0.2s;
}

.password-input-wrapper:focus-within {
  border-color: #3b82f6;
}

.password-input-wrapper .password-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px 12px;
}

.password-input-wrapper .password-input:focus {
  border: none;
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

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn-cancel,
.btn-submit {
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: var(--bg);
  color: var(--text);
}

.btn-cancel:hover {
  background: var(--border);
}

.btn-submit {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.btn-submit:hover:not(:disabled) {
  background: #2563eb;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.message {
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.message.error {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fecaca;
}

.message.success {
  background: #f0fdf4;
  color: #22c55e;
  border: 1px solid #bbf7d0;
}
</style>
