import { ref, computed } from 'vue'
import { treaty } from '@elysiajs/eden'
const api = treaty(window.location.origin)

const user = ref<{ id: string; name: string; email: string } | null>(
  (() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })(),
)

const token = ref<string | null>(localStorage.getItem('token'))

const isAuthenticated = computed(() => !!token.value)

function getAuthHeaders(): { Authorization?: string } {
  return token.value ? { Authorization: `Bearer ${token.value}` } : {}
}

export function useAuth() {
  async function signUp(data: { name: string; email: string; password: string }) {
    // @ts-expect-error Eden dynamic type
    const { error } = await api.api.auth['sign-up'].post(data)
    if (error) throw error
    await signIn({ email: data.email, password: data.password })
  }

  async function signIn(data: { email: string; password: string }) {
    // @ts-expect-error Eden dynamic type
    const { data: result, error } = await api.api.auth['sign-in'].post(data)
    if (error) throw error
    token.value = result.accessToken
    localStorage.setItem('token', result.accessToken)

    // @ts-expect-error Eden dynamic type
    const { data: users } = await api.api.users.get({
      headers: getAuthHeaders(),
    })
    if (users && Array.isArray(users)) {
      const currentUser = users.find(() => true)
      if (currentUser) {
        user.value = { id: currentUser.id, name: currentUser.name, email: currentUser.email }
        localStorage.setItem('user', JSON.stringify(user.value))
      }
    }
  }

  function signOut() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function updateProfile(data: { name?: string; email?: string }) {
    if (!user.value) return
    // @ts-expect-error Eden dynamic type
    const { data: result, error } = await api.api.users({ id: user.value.id }).patch(data, {
      headers: getAuthHeaders(),
    })
    if (error) throw error
    user.value = { ...user.value, ...result }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  return {
    user,
    token,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    updateProfile,
    getAuthHeaders,
  }
}
