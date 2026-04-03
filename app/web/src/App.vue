<script setup lang="ts">
import { ref } from 'vue'
import HeaderPanel from '@/components/HeaderPanel.vue'
import AuthModal from '@/components/AuthModal.vue'
import ProfileModal from '@/components/ProfileModal.vue'

const showAuthModal = ref(false)
const showProfileModal = ref(false)
</script>

<template>
  <HeaderPanel @open-auth="showAuthModal = true" @open-profile="showProfileModal = true" />

  <div id="content">
    <router-view />
  </div>

  <AuthModal :open="showAuthModal" @close="showAuthModal = false" @signed-in="showAuthModal = false" />
  <ProfileModal :open="showProfileModal" @close="showProfileModal = false" />
</template>

<style scoped>
#content {
  flex-grow: 1;
}
</style>
