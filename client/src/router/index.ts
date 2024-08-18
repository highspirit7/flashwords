import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

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
      path: '/:cardsetTitle/:id',
      name: 'cardset',
      component: () => import('../views/CardSetView.vue'),
    },
    {
      path: '/:cardsetTitle/:id/edit',
      name: 'editCardset',
      component: () => import('../views/CardSetEditView.vue'),
    },
    {
      path: '/:cardsetTitle/:cardsetId/:cardTerm/:cardId',
      name: 'card',
      component: () => import('../views/CardView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
