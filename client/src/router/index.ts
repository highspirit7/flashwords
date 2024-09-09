import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import useAuthStore from '@/stores/auth'
import { handleAuthenticationError } from '@/utils/auth'
import { useToasterStore } from '@/stores/toaster'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: async () => {
        const authStore = useAuthStore()
        const toasterStore = useToasterStore()
        const { isLoggedIn } = authStore

        if (isLoggedIn) return { name: 'cardsets' }
        else {
          try {
            await authStore.verifyWithRefreshToken()
            router.replace('/cardsets')
          } catch (error) {
            handleAuthenticationError(error, toasterStore)
          }
          return true
        }
      },
    },
    {
      path: '/cardsets',
      name: 'cardsets',
      component: () => import('../views/CardsetsView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
    },
    {
      path: '/create-cardset',
      name: 'createCardset',
      component: () => import('../views/CreateCardsetView.vue'),
    },
    {
      path: '/:cardsetTitle/:id',
      name: 'cardset',
      component: () => import('../views/CardsetView.vue'),
    },
    {
      path: '/:cardsetTitle/:id/edit',
      name: 'editCardset',
      component: () => import('../views/CardsetEditView.vue'),
    },
    {
      path: '/:cardsetTitle/:cardsetId/:cardTerm/:cardId',
      name: 'card',
      component: () => import('../views/CardView.vue'),
    },
    {
      path: '/:catchAll(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
