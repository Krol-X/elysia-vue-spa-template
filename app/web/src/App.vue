<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { isProduction } from '@app/shared'
</script>

<template>
  <div>Production: {{ isProduction() }}</div>
  <HelloWorld />
</template>
