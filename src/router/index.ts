import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/usuario',
      name: 'usuario',
      component: () => import('../views/UsuarioView.vue'),
    },
    {
      path: '/anotacoes',
      name: 'anotacoes',
      component: () => import('../views/AnotacoesView.vue'),
    },
    {
      path: '/anotacao',
      name: 'anotacao',
      component: () => import('../views/AnotacaoView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
  ],
})

export default router
