import { shallowRef } from 'vue'
import type { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/stores_auth'
import { useRoutesStore } from '@/stores/stores_routes'
import type { RouterTree } from '@/declare/routes'
import routes from '@/router/routes'
import { permission, hasPermission, defaultPermission } from '@/lib/lib_permission'

import HomeView from '@/views/Common/HomeView/HomeView.vue'
import LoginView from '@/views/Common/LoginView/LoginView.vue'
import CheckStatus from '@/views/Common/CheckStatus.vue'
import NoPermissions from '@/views/Common/NoPermissions.vue'
import InProgress from '@/views/Common/InProgress.vue'
import Page_404 from '@/views/Common/Page_404.vue'
import FixView from '@/views/Common/FixView.vue'

// 網址前綴
const systemUrl = (import.meta as any).env.VITE_API_SYSTEM_URL

/**
 * @author Caleb
 * @description 用DFS的方式 將路由樹轉換成可使用路由
 * @param {Array} routes 路由樹
 * @returns {Array} vue-router 指定格式
 */
const treeToRoutes = (routes: RouterTree[]): RouteRecordRaw[] => {
  const res = []

  const _treeToRoutes = (routes: RouterTree[], res: RouteRecordRaw[]): void => {
    routes.forEach(route => {
      if (Object.prototype.hasOwnProperty.call(route, 'path')) {
        const { title, name,  meta, path, component } = route

        const pushItem = {
          path: `${systemUrl}${path}`,
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
      if (Object.prototype.hasOwnProperty.call(route, 'leaves')) {
        _treeToRoutes(route.leaves, res)
      }
    })
  }

  _treeToRoutes(routes, res)
  return res
}

// const resRoutes: ComputedRef<RouteRecordRaw[]> = computed(() => {
//   return treeToRoutes(routes)
// })

const resRoutes = treeToRoutes(routes)

const baseRoutes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: { name: 'home' }
  },
  {
    path: '/ipassweb',
    redirect: { name: 'home' }
  },
  {
    path: `${systemUrl}`,
    redirect: { name: 'home' }
  },
  {
    name: 'home',
    meta: {
      title: '首頁'
    },
    path: `${systemUrl}/home`,
    component: HomeView
  },
  {
    name: 'login',
    meta: {
      title: '登入'
    },
    path: `${systemUrl}/login`,
    component: LoginView
  },
  {
    name: 'checkStatus',
    meta: {
      title: '確認登入狀態中'
    },
    path: `${systemUrl}/checkStatus`,
    component: CheckStatus
  },
  {
    name: 'noPermissions',
    meta: {
      title: '無此權限'
    },
    path: `${systemUrl}/noPermissions`,
    component: NoPermissions
  },
  {
    name: 'inProgress',
    meta: {
      title: '功能開發中'
    },
    path: `${systemUrl}/inProgress`,
    component: InProgress
  },
  {
    name: 'fix',
    meta: {
      title: '功能維護中'
    },
    path: `${systemUrl}/fix`,
    component: FixView
  },
  {
    name: 'page404',
    meta: {
      title: '404'
    },
    path: `${systemUrl}/page404`,
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
  routes: [...baseRoutes, ...resRoutes]
})

// 暫存使用者想去的路由名稱
const tempTo = shallowRef<RouteLocationNormalized | null>(null)

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    // 使用者
    const authStore = useAuthStore()
    const { isLogin, isCheckedStatus } = storeToRefs(authStore)

    // 路由
    const routesStore = useRoutesStore()
    const { navigationMap } = storeToRefs(routesStore)

    const userPermission = navigationMap.value.get(to.name as string)

    /**
     * 權限順序
     * 1. 後端資料
     * 2. 路由設定
     * 3. 系統預設
     * 4. 0 (無權限)
     */
    const pagePermission = [
      userPermission?.permission,
      defaultPermission,
      0
    ].find(_permission => typeof _permission === 'number')

    // 尚未確認登入狀態
    if (!isCheckedStatus.value) {
      if (to.name === 'checkStatus') {
        next()
      } else {
        // 未登入先將想去的頁面暫存
        if (to.name !== 'home') {
          tempTo.value = to
        }

        next({ name: 'checkStatus' })
      }
    } else if (isLogin.value) {
      // 已經登入 如果要進登入頁 自動跳回首頁
      if (to.name === 'login') {
        next({ name: 'home' })
      // 沒有讀取的權限
      } else if (
        from.name &&
        !baseRoutesName.includes(to.name as string) &&
        !hasPermission(pagePermission, permission.read)
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
        next({ name: 'login' })
      }
    }
  }
)

export default router
