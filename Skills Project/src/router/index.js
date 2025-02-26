import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SkillView from '@/views/SkillView.vue'

import { createRouter, createWebHistory } from 'vue-router'

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
      component: LoginView,
    },
    {
      path: '/skills',
      name: 'skills',
      component: SkillView,
    },
  ],
})

export default router
