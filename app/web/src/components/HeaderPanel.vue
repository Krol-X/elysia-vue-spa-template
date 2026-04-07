<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const auth = useAuth()
const router = useRouter()

const emit = defineEmits<{
  openAuth: []
  openProfile: []
}>()

function onSignOut() {
  auth.signOut()
  router.push('/')
}
</script>

<template>
  <div class="header-panel">
    <div class="left">
      <RouterLink to="/" class="logo" active-class="active"> Vite + Elysia </RouterLink>
    </div>

    <div v-if="auth.isAuthenticated.value" class="right">
      <nav class="nav">
        <RouterLink to="/dashboard" class="nav-link" active-class="active">Dashboard</RouterLink>
        <RouterLink to="/users" class="nav-link" active-class="active">Users</RouterLink>
      </nav>
      <button class="btn-sm" @click="emit('openProfile')">Profile</button>
      <button class="btn-sm" @click="onSignOut">Sign Out</button>
    </div>

    <div v-else class="right">
      <button class="btn-sm" @click="emit('openAuth')">Sign In</button>
    </div>
  </div>
</template>

<style scoped>
.header-panel {
  padding: 0.75rem 1rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
}

.logo {
  font-weight: 600;
  font-size: 16px;
  color: var(--text-h);
  text-decoration: none;

  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo.active {
  color: var(--accent);
}

.right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav {
  display: flex;
  gap: 12px;
  margin-right: 8px;
}

.nav-link {
  font-size: 14px;
  color: var(--text);
  text-decoration: none;
}

.nav-link.active {
  color: var(--accent);
}

.btn-sm {
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  font-size: 13px;
  cursor: pointer;
}

.btn-sm:hover {
  border-color: var(--accent);
  color: var(--accent);
}
</style>
