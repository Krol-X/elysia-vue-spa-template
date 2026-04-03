<script setup lang="ts">
import { ref } from 'vue'
import Modal from '@/components/Modal.vue'
import { useAuth } from '@/composables/useAuth'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const auth = useAuth()
const error = ref('')
const success = ref(false)

const name = ref(auth.user.value?.name ?? '')
const email = ref(auth.user.value?.email ?? '')

async function handleUpdate() {
  error.value = ''
  success.value = false
  try {
    await auth.updateProfile({ name: name.value, email: email.value })
    success.value = true
  } catch (e: any) {
    error.value = e?.value ?? 'Ошибка обновления'
  }
}
</script>

<template>
  <Modal :open="open" title="Профиль" @close="emit('close')">
    <div class="profile-modal">
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">Сохранено</p>

      <form @submit.prevent="handleUpdate" class="form">
        <label>
          Имя
          <input v-model="name" type="text" required minlength="2" maxlength="50" />
        </label>
        <label>
          Email
          <input v-model="email" type="email" required />
        </label>
        <button type="submit" class="btn-primary">Сохранить</button>
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

.form label {
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
