import type { RouteComponent } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/parse',
      component: (): RouteComponent => import('@renderer/views/Home.vue'),
      children: [
        {
          path: '/parse',
          component: (): RouteComponent => import('@renderer/views/Parse/index.vue')
        },
        {
          path: '/account',
          component: (): RouteComponent => import('@renderer/views/Account/index.vue')
        },
        {
          path: '/record',
          component: (): RouteComponent => import('@renderer/views/Record/index.vue')
        },
        {
          path: '/task',
          component: (): RouteComponent => import('@renderer/views/Task/index.vue')
        },
        {
          path: '/config',
          redirect: '/config/general',
          children: [
            {
              path: '/config/general',
              component: (): RouteComponent => import('@renderer/views/Config/General.vue')
            },
            {
              path: '/config/parse',
              component: (): RouteComponent => import('@renderer/views/Config/Parse.vue')
            },
            {
              path: '/config/aria2',
              component: (): RouteComponent => import('@renderer/views/Config/Aria2.vue')
            },
            {
              path: '/config/proxy',
              component: (): RouteComponent => import('@renderer/views/Config/Proxy.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/404',
      component: (): RouteComponent => import('@renderer/views/NotFound.vue')
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404'
    }
  ]
})

let timer: number | null = null

router.beforeEach((_to, _from, next) => {
  document.body.classList.add('moving')
  if (timer) window.clearInterval(timer)
  timer = window.setTimeout(() => document.body.classList.remove('moving'), 700)
  next()
})

export default router
