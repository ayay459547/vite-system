import type {
  RouteRecordRaw,
  RouteLocationNormalized,
  NavigationGuardNext
} from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import type { ComputedRef } from 'vue'
import { ref, computed } from 'vue'

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

import type { RouterTree } from '@/declare/routes'
import routes from '@/router/routes'
import { permission, hasPermission } from '@/lib/permission'

import HomeView from '@/views/HomeView/HomeView.vue'
import SearchView from '@/views/SearchView/SearchView.vue'
import LoginView from '@/views/LoginView/LoginView.vue'
import NoPermissions from '@/views/NoPermissions.vue'
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
          },
          props: (route: RouteLocationNormalized) => {
            return { query: route.query }
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
    name: 'search',
    meta: {
      title: '搜尋'
    },
    path: '/search',
    component: SearchView
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
    name: 'noPermissions',
    meta: {
      title: '無此權限'
    },
    path: '/noPermissions',
    component: NoPermissions
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

// 基本路由不受權限引響
const baseRoutesName = baseRoutes.reduce((res, curr) => {
  const routeName = curr.name
  if (routeName) {
    res.push(routeName)
  }
  return res
}, [])

const router = createRouter({
  history: createWebHistory((import.meta as any).env.BASE_URL),
  routes: [...baseRoutes, ...resRoutes.value]
})

// 暫存使用者想去的路由名稱
const tempTo = ref<RouteLocationNormalized | null>(null)

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore()
    const { isLogin, routesPermission } = storeToRefs(authStore)

    const toNavigation = routesPermission.value.get(to.name as string)

    if (isLogin.value) {
      // 已經登入 如果要進登入頁 自動跳回首頁
      if (to.name === 'login') {
        next({ name: 'home' })
      // 沒有讀取的權限
      } else if (
        from.name &&
        !baseRoutesName.includes(to.name as string) &&
        !hasPermission(toNavigation ?? 0, permission.read)
      ) {
        next({ name: 'noPermissions' })
      // 如果再未登入時有 想進的頁面 會優先進入
      } else if (tempTo.value) {
        const temp = tempTo.value
        tempTo.value = null

        next({ ...temp })
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
        if (to.name !== 'home') {
          tempTo.value = to
        }

        next({ name: 'login' })
      }
    }
  }
)

export default router
