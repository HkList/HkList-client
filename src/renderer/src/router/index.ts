import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/parse',
      component: () => import('@renderer/views/Home.vue'),
      children: [
        {
          path: '/parse',
          component: () => import('@renderer/views/Parse/index.vue')
        },
        {
          path: '/account',
          component: () => import('@renderer/views/Account/index.vue')
        },
        {
          path: '/task',
          component: () => import('@renderer/views/Task/index.vue')
        },
        {
          path: '/config',
          redirect: '/config/general',
          children: [
            {
              path: '/config/general',
              component: () => import('@renderer/views/Config/General.vue')
            },
            {
              path: '/config/parse',
              component: () => import('@renderer/views/Config/Parse.vue')
            },
            {
              path: '/config/aria2',
              component: () => import('@renderer/views/Config/Aria2.vue')
            }
          ]
        },
        {
          path: '/debug',
          component: () => import('@renderer/views/Debug/index.vue')
        }
      ]
    },
    {
      path: '/404',
      component: () => import('@renderer/views/NotFound.vue')
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404'
    }
  ]
})

export default router
