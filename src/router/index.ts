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

// TODO : Navigation Guard

export default router
