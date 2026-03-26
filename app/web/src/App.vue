<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { isProduction } from '@app/shared'
import { treaty } from '@elysiajs/eden'
import type { App } from '@app/api/src/server'
import { onMounted, ref } from 'vue'

const client = treaty<App>(window.location.origin)
const server_info = ref<string>('')

onMounted(async () => {
  const { data } = await client.api.up.get()
  server_info.value = JSON.stringify(data)
})
</script>

<template>
  <div>Client in production mode: {{ isProduction() }}</div>
  <div>Server up info: {{ server_info }}</div>
  <HelloWorld />
</template>
