<script setup lang="ts">
import { ref } from 'vue'
import Modal from '@/components/Modal.vue'
import { useAuth } from '@/composables/useAuth'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: []; signedIn: [] }>()

const auth = useAuth()
const tab = ref<'signIn' | 'signUp'>('signIn')
const error = ref('')
const showSignUpPassword = ref(false)

const signInForm = ref({ email: '', password: '' })
const signUpForm = ref({ name: '', email: '', password: '', passwordConfirm: '' })

async function handleSignIn() {
  error.value = ''
  try {
    await auth.signIn(signInForm.value)
    resetForms()
    emit('signedIn')
    emit('close')
  } catch (e: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error.value = (e as any)?.value ?? 'Ошибка входа'
  }
}

async function handleSignUp() {
  error.value = ''
  if (signUpForm.value.password !== signUpForm.value.passwordConfirm) {
    error.value = 'Пароли не совпадают'
    return
  }
  try {
    await auth.signUp({
      name: signUpForm.value.name,
      email: signUpForm.value.email,
      password: signUpForm.value.password,
    })
    resetForms()
    emit('signedIn')
    emit('close')
  } catch (e: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error.value = (e as any)?.value ?? 'Ошибка регистрации'
  }
}

function resetForms() {
  signInForm.value = { email: '', password: '' }
  signUpForm.value = { name: '', email: '', password: '', passwordConfirm: '' }
  error.value = ''
  tab.value = 'signIn'
  showSignUpPassword.value = false
}
</script>

<template>
  <Modal :open="props.open" title="" @close="resetForms(); emit('close')">
    <div class="auth-modal">
      <div class="tabs">
        <button
          :class="['tab', { active: tab === 'signIn' }]"
          @click="tab = 'signIn'; error = ''"
        >
          Вход
        </button>
        <button
          :class="['tab', { active: tab === 'signUp' }]"
          @click="tab = 'signUp'; error = ''"
        >
          Регистрация
        </button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <form v-if="tab === 'signIn'" @submit.prevent="handleSignIn" class="form" autocomplete="on">
        <label>
          Email
          <input v-model="signInForm.email" type="email" required autocomplete="email" />
        </label>
        <label>
          Пароль
          <input v-model="signInForm.password" type="password" required minlength="8" autocomplete="current-password" />
        </label>
        <button type="submit" class="btn-primary">Войти</button>
      </form>

      <form v-if="tab === 'signUp'" @submit.prevent="handleSignUp" class="form" autocomplete="off">
        <label>
          Имя
          <input v-model="signUpForm.name" type="text" required minlength="2" maxlength="50" autocomplete="off" />
        </label>
        <label>
          Email
          <input v-model="signUpForm.email" type="email" required autocomplete="off" />
        </label>
        <div class="form-field">
          <span class="field-label">Пароль</span>
          <div class="password-field">
            <input
              id="signup-password"
              v-model="signUpForm.password"
              type="text"
              :class="{ masked: !showSignUpPassword }"
              required
              minlength="8"
              autocomplete="off"
              spellcheck="false"
              placeholder="Минимум 8 символов"
            />
            <button type="button" class="btn-toggle-password" @click="showSignUpPassword = !showSignUpPassword">
              {{ showSignUpPassword ? '👁️‍🗨️' : '👁️' }}
            </button>
          </div>
        </div>
        <div class="form-field">
          <span class="field-label">Подтверждение пароля</span>
          <div class="password-field">
            <input
              id="signup-password-confirm"
              v-model="signUpForm.passwordConfirm"
              type="text"
              :class="{ masked: !showSignUpPassword }"
              required
              minlength="8"
              autocomplete="off"
              spellcheck="false"
              placeholder="Повторите пароль"
            />
          </div>
        </div>
        <button type="submit" class="btn-primary">Зарегистрироваться</button>
      </form>
    </div>
  </Modal>
</template>

<style scoped>
.auth-modal {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
}

.tab {
  flex: 1;
  padding: 8px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  color: var(--text);
  font-size: 14px;
}

.tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
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

/* CSS-маска для пароля — звёздочки вместо символов */
.masked {
  -webkit-text-security: disc;
}

.password-field {
  position: relative;
}

.password-field input {
  width: 100%;
  padding-right: 40px;
}

.btn-toggle-password {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  line-height: 1;
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
</style>
