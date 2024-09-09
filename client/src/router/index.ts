import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import useAuthStore from '@/stores/auth'
import { handleAuthenticationError } from '@/utils/auth'
import { useToasterStore } from '@/stores/toaster'
import { authTrpc } from '@/trpc'
import { isString } from '@/utils/typePredicates'
import { TRPCClientError } from '@trpc/client'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: async (_to, _from, next) => {
        const authStore = useAuthStore()
        const { isLoggedIn } = authStore

        if (isLoggedIn) {
          next({ path: '/cardsets', replace: true })
          return true
        } else {
          try {
            await authStore.verifyWithRefreshToken()
            next({ path: '/cardsets', replace: true })
          } catch (error) {
            next()
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
      beforeEnter: async to => {
        if (!isString(to.params.id))
          return { name: 'notFound', params: { pathMatch: to.path.split('/').slice(1) } }

        const cardsetId = parseInt(to.params.id)

        try {
          await authTrpc.cardset.find.query(cardsetId)
          return true
        } catch (error: unknown) {
          if (error instanceof TRPCClientError) {
            if (error.data?.httpStatus === 403)
              return {
                name: 'forbidden',
                params: { pathMatch: to.path.split('/').slice(1) },
              }
          }

          return {
            name: 'notFound',
            params: { pathMatch: to.path.split('/').slice(1) },
          }
        }
      },
    },
    {
      path: '/:cardsetTitle/:id/edit',
      name: 'editCardset',
      component: () => import('../views/CardsetEditView.vue'),
    },
    // TODO : also need navigation guard for card route
    {
      path: '/:cardsetTitle/:cardsetId/:cardTerm/:cardId',
      name: 'card',
      component: () => import('../views/CardView.vue'),
    },
    { path: '/forbidden', name: 'forbidden', component: () => import('../views/Forbidden.vue') },
    {
      path: '/:catchAll(.*)*',
      name: 'notFound',
      component: () => import('../views/NotFound.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
