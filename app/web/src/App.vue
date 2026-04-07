<script setup lang="ts">
import { ref } from 'vue'
import HeaderPanel from '@/components/HeaderPanel.vue'
import AuthModal from '@/components/AuthModal.vue'
import ProfileModal from '@/components/ProfileModal.vue'
import UserModal from '@/components/UserModal.vue'

const showAuthModal = ref(false)
const showProfileModal = ref(false)
const showUserModal = ref(false)
const userModalMode = ref<'create' | 'edit'>('create')
const editingUser = ref<{ id: string; name: string; email: string } | null>(null)

function openCreateUserModal() {
  userModalMode.value = 'create'
  editingUser.value = null
  showUserModal.value = true
}

function openEditUserModal(user: { id: string; name: string; email: string }) {
  userModalMode.value = 'edit'
  editingUser.value = user
  showUserModal.value = true
}

function toggleAuthModal() {
  showAuthModal.value = !showAuthModal.value
}

function toggleProfileModal() {
  showProfileModal.value = !showProfileModal.value
}

function toggleUserModal() {
  showUserModal.value = !showUserModal.value
}
</script>

<template>
  <HeaderPanel @open-auth="toggleAuthModal" @open-profile="toggleProfileModal" />

  <div id="content">
    <router-view @open-create-modal="openCreateUserModal" @open-edit-modal="openEditUserModal" />
  </div>

  <AuthModal :open="showAuthModal" @close="toggleAuthModal" @signed-in="toggleAuthModal" />
  <ProfileModal :open="showProfileModal" @close="toggleProfileModal" />
  <UserModal
    :open="showUserModal"
    :mode="userModalMode"
    :user="editingUser"
    @close="toggleUserModal"
    @saved="() => {}"
  />
</template>

<style scoped>
#content {
  flex-grow: 1;
}
</style>
