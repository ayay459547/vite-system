import { shallowRef } from 'vue'
import type { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useEventBus } from '@vueuse/core'

import { useAuthStore } from '@/stores/stores_auth'
import { useRoutesStore } from '@/stores/stores_routes'
import type { RouterTree } from '@/declare/routes.ts'
import routes from '@/router/routes'
import { permission, hasPermission } from '@/lib/lib_permission'
import { tipLog } from '@/lib/lib_utils'
import { updateToken } from '@/lib/lib_cookie'

import { commonRoutes } from './Common'

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

  // 有重複的 name 給予提示
  const nameSet = new Set()
  const tipList = []

  const _treeToRoutes = (routes: RouterTree[], res: RouteRecordRaw[]): void => {
    routes.forEach(route => {
      if (Object.prototype.hasOwnProperty.call(route, 'component')) {
        const { name, title, meta, component } = route

        if (nameSet.has(name)) {
          tipList.push(`${name}(${title}): ${JSON.stringify(route)}`)
        }
        nameSet.add(name)

        const pushItem = {
          name,
          path: `${systemUrl}/${name}`,
          component,
          meta: {
            title,
            keepAlive: false,
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

  if (tipList.length > 0) {
    tipLog('Routes 中有重複的 name', tipList)
  }
  return res
}

// const resRoutes: ComputedRef<RouteRecordRaw[]> = computed(() => {
//   return treeToRoutes(routes)
// })

const resRoutes = treeToRoutes(routes)

// 基本路由不受權限引響
const baseRoutesName = commonRoutes.reduce((res, curr) => {
  const routeName = curr.name
  if (routeName) {
    res.push(routeName)
  }
  return res
}, [])

const router = createRouter({
  history: createWebHistory((import.meta as any).env.BASE_URL),
  routes: [...commonRoutes, ...resRoutes]
})

// 暫存使用者想去的路由名稱
const tempTo = shallowRef<RouteLocationNormalized | null>(null)

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const bus = useEventBus<string>('')
    bus.emit('busRouterChange')

    updateToken((to?.name ?? 'busRouterChange') as string)

    // 使用者
    const authStore = useAuthStore()
    const { isLogin, isCheckedStatus } = storeToRefs(authStore)

    // 路由
    const routesStore = useRoutesStore()
    const { navigationMap } = storeToRefs(routesStore)
    const routerPermission = navigationMap.value.get(to.name as string)

    /**
     * 權限順序 (stores_routes)
     * 1. 後端資料
     * 2. 路由設定
     * 3. 系統預設
     * 4. 0 (無權限)
     */
    const pagePermission = routerPermission?.meta?.permission ?? 0

    // 尚未確認登入狀態
    if (!isCheckedStatus.value) {
      if (to.name === 'checkStatus') {
        next()
      } else {
        // 未登入先將想去的頁面暫存
        if (to.name !== 'locatehome') {
          tempTo.value = to
        }

        next({ name: 'checkStatus' })
      }
    } else if (isLogin.value) {
      // 已經登入 如果要進登入頁 自動跳回首頁
      if (to.name === 'login') {
        next({ name: 'locatehome' })
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
