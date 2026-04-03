<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { treaty } from '@elysiajs/eden'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api = treaty<any>(window.location.origin)
import { useAuth } from '@/composables/useAuth'
const auth = useAuth()

const users = ref<Array<{ id: string; name: string; email: string }>>([])
const loading = ref(true)

onMounted(async () => {
  try {
    // @ts-expect-error Eden dynamic type
    const { data } = await api.api.users.get({
      headers: auth.getAuthHeaders(),
    })
    if (data) users.value = data
  } finally {
    loading.value = false
  }
})

async function removeUser(id: string) {
  if (!confirm('Удалить пользователя?')) return
  // @ts-expect-error Eden dynamic type
  await api.api.users({ id }).delete(undefined, {
    headers: auth.getAuthHeaders(),
  })
  users.value = users.value.filter((u) => u.id !== id)
}
</script>

<template>
  <div class="users">
    <h2>Users</h2>

    <p v-if="loading">Загрузка...</p>

    <table v-else-if="users.length" class="users-table">
      <thead>
        <tr>
          <th>Имя</th>
          <th>Email</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td><button class="btn-del" @click="removeUser(user.id)">Удалить</button></td>
        </tr>
      </tbody>
    </table>

    <p v-else class="empty">Нет пользователей</p>
  </div>
</template>

<style scoped>
.users {
  padding: 1rem;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.users-table th,
.users-table td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}

.users-table th {
  color: var(--text-h);
  font-weight: 600;
}

.btn-del {
  padding: 4px 10px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg);
  color: #ef4444;
  cursor: pointer;
  font-size: 12px;
}

.btn-del:hover {
  border-color: #ef4444;
}

.empty {
  color: var(--text);
  font-size: 14px;
}
</style>
