<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { treaty } from '@elysiajs/eden'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api = treaty<any>(window.location.origin)
import { useAuth } from '@/composables/useAuth'
const auth = useAuth()

const emit = defineEmits<{
  openCreateModal: []
  openEditModal: [user: { id: string; name: string; email: string }]
}>()

const users = ref<Array<{ id: string; name: string; email: string }>>([])
const loading = ref(true)

onMounted(async () => {
  await loadUsers()
  window.addEventListener('users-updated', loadUsers)
})

onUnmounted(() => {
  window.removeEventListener('users-updated', loadUsers)
})

async function loadUsers() {
  try {
    loading.value = true
    // @ts-expect-error Eden dynamic type
    const { data } = await api.api.users.get({
      headers: auth.getAuthHeaders(),
    })
    if (data) users.value = data
  } finally {
    loading.value = false
  }
}

async function removeUser(id: string) {
  if (!auth.user.value) return

  if (auth.user.value.id === id) {
    alert('You cannot delete yourself')
    return
  }

  if (!confirm('Delete this user?')) return
  try {
    // @ts-expect-error Eden dynamic type
    await api.api.users({ id }).delete(undefined, {
      headers: auth.getAuthHeaders(),
    })
    users.value = users.value.filter((u) => u.id !== id)
  } catch (e) {
    console.error('Failed to delete user:', e)
    alert('Failed to delete user')
  }
}

function openCreate() {
  emit('openCreateModal')
}

function openEdit(user: { id: string; name: string; email: string }) {
  emit('openEditModal', user)
}
</script>

<template>
  <div class="users">
    <div class="users-header">
      <h2>Users</h2>
      <button class="btn-create" @click="openCreate">+ Create User</button>
    </div>

    <p v-if="loading">Loading...</p>

    <table v-else-if="users.length" class="users-table">
      <colgroup>
        <col />
        <col />
        <col class="actions-col" />
      </colgroup>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <span v-if="user.id !== auth.user.value?.id" class="actions">
              <button class="btn-edit" @click="openEdit(user)">Edit</button>
              <button class="btn-del" @click="removeUser(user.id)">Delete</button>
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else class="empty">No users found</p>
  </div>
</template>

<style scoped>
.users {
  padding: 1rem;
}

.users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.users-header h2 {
  margin: 0;
}

.btn-create {
  padding: 8px 16px;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  background: #3b82f6;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-create:hover {
  background: #2563eb;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
  vertical-align: middle;
  text-align: left;
}

.users-table th {
  color: var(--text-h);
  font-weight: 600;
  white-space: nowrap;
}

.actions-col {
  width: 1%;
  white-space: nowrap;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-del {
  padding: 4px 10px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg);
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.btn-edit {
  color: #3b82f6;
}

.btn-edit:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.btn-del {
  color: #ef4444;
}

.btn-del:hover {
  border-color: #ef4444;
  background: #fef2f2;
}

.empty {
  color: var(--text);
  font-size: 14px;
}

.current-user-label {
  font-size: 12px;
  color: #3b82f6;
  font-style: italic;
}
</style>
