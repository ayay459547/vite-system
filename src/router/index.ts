import type {
  RouteRecordRaw,
  RouteLocationNormalized,
  NavigationGuardNext
} from 'vue-router'
import type { RouteRecordName } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import type { ComputedRef } from 'vue'
import { ref, computed } from 'vue'

import { useAuthStore } from '@/stores/auth'

import type { RouterTree } from '@/declare/routes'
import routes from '@/router/routes'

import HomeView from '@/views/HomeView/HomeView.vue'
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...baseRoutes, ...resRoutes.value]
})

// 暫存使用者想去的路由名稱
const toName = ref<RouteRecordName | null>(null)

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore()
    const { isLogin, getToken, setToken } = authStore

    const storageToken = getToken()
    if (storageToken) {
      setToken(storageToken)
    }

    if (isLogin) {
      // 已經登入 如果要進登入頁 自動跳回首頁
      if (to.name === 'login') {
        next({ name: 'home' })
      // 如果再未登入時有 想進的頁面 會優先進入
      } else if (toName.value) {
        const temp = toName.value
        toName.value = null
        next({ name: temp })
      // 已登入
      } else {
        next()
      }
    } else {
      // 未登入
      if (to.name === 'login') {
        next()
      } else {
        // 未登入先將想去的頁面暫存
        toName.value = to.name

        next({ name: 'login' })
      }
    }
  }
)


export default router
