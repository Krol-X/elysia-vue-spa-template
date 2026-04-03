import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/components/HelloWorld.vue'),
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/components/Dashboard.vue'),
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('@/components/Users.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuth()

  if (to.path !== '/' && !auth.isAuthenticated.value) {
    return '/'
  }
})

export default router
