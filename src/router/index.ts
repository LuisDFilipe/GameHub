import { createRouter, createWebHistory } from 'vue-router'
import { readPlayerProfile } from '@/lib/storage'
import GamesView from '../views/GamesView.vue'
import OnboardingView from '../views/OnboardingView.vue'
import ScoresView from '../views/ScoresView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'onboarding',
      component: OnboardingView,
      meta: {
        title: 'Perfil de Jogador',
        description: 'Diz-nos o teu nome.',
      },
    },
    {
      path: '/games',
      name: 'games',
      component: GamesView,
      meta: {
        title: 'Jogos',
        description: 'Escolhe um jogo e alcança uma melhor pontuação.',
        requiresProfile: true,
      },
    },
    {
      path: '/games/tic-tac-toe',
      name: 'tic-tac-toe',
      component: () => import('../views/TicTacToeView.vue'),
      meta: {
        title: 'Jogo do Galo',
        description: 'Joga contra o Computador.',
        requiresProfile: true,
      },
    },
    {
      path: '/games/memory',
      name: 'memory',
      component: () => import('../views/MemoryView.vue'),
      meta: {
        title: 'Memória',
        description: 'Encontra todos os pares de cartas o mais rápido possível.',
        requiresProfile: true,
      },
    },
    {
      path: '/scores',
      name: 'scores',
      component: ScoresView,
      meta: {
        title: 'Pontuação',
        description: 'Revê a pontuação dos teus jogos recentes.',
        requiresProfile: true,
      },
    },
  ],
})

router.beforeEach((to) => {
  const profile = readPlayerProfile()

  if (to.meta.requiresProfile && !profile) {
    return '/'
  }

  if (to.name === 'onboarding' && profile) {
    return '/games'
  }

  return true
})

export default router
