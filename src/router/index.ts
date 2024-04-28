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
      path: '/card-set/:cardSetId/:term',
      component: () => import('../views/TermView.vue'),
    },
  ],
})

// TODO : Navigation Guard

export default router
