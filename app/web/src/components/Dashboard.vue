<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { isProduction } from '@app/shared'
import { treaty } from '@elysiajs/eden'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api = treaty<any>(window.location.origin)

const serverInfo = ref<string>('')
const browserInfo = ref<Record<string, string>>({})
const serverProduction = ref<string>('')

onMounted(async () => {
  // @ts-expect-error Eden dynamic type
  const { data } = await api.api.up.get()
  serverInfo.value = JSON.stringify(data, null, 2)
  serverProduction.value = data?.production

  // Browser info
  browserInfo.value = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screen: `${screen.width}x${screen.height}`,
    colorDepth: `${screen.colorDepth}-bit`,
    cookiesEnabled: String(navigator.cookieEnabled),
    onLine: String(navigator.onLine),
  }
})
</script>

<template>
  <div class="dashboard">
    <h2>Dashboard</h2>

    <div class="card">
      <h3>Режим</h3>
      <p>Клиент: <code>{{ isProduction() ? 'production' : 'development' }}</code></p>
      <p>Сервер: <code>{{ serverProduction? 'production' : 'development' }}</code></p>
    </div>

    <div class="card">
      <h3>Сервер</h3>
      <pre>{{ serverInfo }}</pre>
    </div>

    <div class="card">
      <h3>Браузер</h3>
      <table>
        <tbody>
          <tr v-for="(value, key) in browserInfo" :key="key">
            <td class="label">{{ key }}</td>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  text-align: left;
}

.card h3 {
  margin: 0 0 8px;
  font-size: 15px;
}

.card pre {
  background: var(--code-bg);
  padding: 10px;
  border-radius: 6px;
  font-size: 13px;
  overflow-x: auto;
  margin: 0;
}

.card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.card td {
  padding: 4px 0;
  vertical-align: top;
}

.card td.label {
  font-weight: 600;
  width: 120px;
  color: var(--text-h);
}
</style>
