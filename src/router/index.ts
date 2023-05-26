import type {
  RouteRecordRaw,
  RouteLocationNormalized,
  NavigationGuardNext
} from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import type { ComputedRef } from 'vue'
import { computed } from 'vue'

import { useAuthStore } from '@/stores/auth'

import type { RouterTree } from '@/declare/routes'
import routes from '@/router/routes'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import Page_404 from '@/views/Page_404.vue'

/**
 * @author Caleb
 * @description 用DFS的方式 將路由樹轉換成可使用路由
 * @param routes 路由樹
 * @returns {Array} vue-router 指定格式
 */
const treeToRoutes = (routes: RouterTree[]): RouteRecordRaw[] => {
  const res = []

  const _treeToRoutes = (routes: RouterTree[], res: RouteRecordRaw[]): void => {
    routes.forEach(route => {
      if (Object.hasOwnProperty.call(route, 'path')) {
        const { title, name,  meta, path, component } = route

        const pushItem = {
          path,
          name,
          component,
          meta: {
            keepAlive: false,
            title,
            ...meta
          }
        }
        res.push(pushItem)
      }
      if (Object.hasOwnProperty.call(route, 'leaves')) {
        _treeToRoutes(route.leaves, res)
      }
    })
  }

  _treeToRoutes(routes, res)
  return res
}

const resRoutes: ComputedRef<RouteRecordRaw[]> = computed(() => {
  return treeToRoutes(routes)
})

const baseRoutes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: { name: 'home' }
  },
  {
    name: 'home',
    meta: {
      title: '首頁'
    },
    path: '/home',
    component: HomeView
  },
  {
    name: 'login',
    meta: {
      title: '登入'
    },
    path: '/login',
    component: LoginView
  },
  {
    name: 'page404',
    meta: {
      title: '404'
    },
    path: '/page404',
    component: Page_404
  },
  {
    path: '/:pathMatch(.*)',
    redirect: { name: 'page404' }
  }
]

export default (() => {
  const authStore = useAuthStore()
  const { getToken, setToken } = authStore

  const tempToken = getToken()
  setToken(tempToken)

  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...baseRoutes, ...resRoutes.value]
  })

  router.beforeEach(
    async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const { isLogin } = authStore

      if (isLogin) {
        if (to.name === 'login') {
          next({ name: 'home' })
        } else {
          next()
        }
      } else {
        if (to.name === 'login') {
          next()
        } else {
          next({ name: 'login' })
        }
      }
    }
  )


  return router
})
