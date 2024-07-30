import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import useAuthStore from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/create-card-set',
      name: 'createCardSet',
      component: () => import('../views/CreateCardSetView.vue'),
    },
    {
      path: '/card-set/:id',
      name: 'cardSet',
      component: () => import('../views/CardSetView.vue'),
    },
    {
      path: '/card-set/:id/edit',
      name: 'editCardSet',
      component: () => import('../views/CardSetEditView.vue'),
    },
    {
      path: '/card-set/:cardSetId/:term',
      name: 'termInCardSet',
      component: () => import('../views/TermView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach(to => {
  const authStore = useAuthStore()
  const { isLoggedIn } = authStore

  if (!isLoggedIn && to.name !== 'login') {
    return { name: 'login' }
  }

  if (isLoggedIn && to.name === 'login') {
    return { name: 'home' }
  }

  return true
})

export default router
