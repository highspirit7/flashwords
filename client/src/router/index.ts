import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import useAuthStore from '@/stores/auth'
import { useToasterStore } from '@/stores/toaster'

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
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
    },
    {
      path: '/create-cardset',
      name: 'createCardset',
      component: () => import('../views/CreateCardSetView.vue'),
    },
    {
      path: '/cardset/:id',
      name: 'cardset',
      component: () => import('../views/CardSetView.vue'),
    },
    {
      path: '/cardset/:id/edit',
      name: 'editCardset',
      component: () => import('../views/CardSetEditView.vue'),
    },
    {
      path: '/cardset/:cardsetId/:term',
      name: 'termInCardset',
      component: () => import('../views/TermView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
