import { shallowRef } from 'vue'
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useEventBus } from '@/lib/lib_hook' // 自訂Composition API
import { useAuthStore } from '@/stores/stores_auth'
import { useRoutesStore } from '@/stores/stores_routes'
import type { RouterTree } from '@/declare/routes'
import routes from '@/router/routes'
import { permission, hasPermission } from '@/lib/lib_permission' // 權限
import { tipLog, isEmpty } from '@/lib/lib_utils' // 工具
import { updateToken } from '@/lib/lib_cookie'

import { commonRoutes } from './Common'

// 網址前綴
const systemUrl = (import.meta as any).env.VITE_API_SYSTEM_URL

const isSkipLogin = (import.meta as any).env.VITE_API_SKIP_LOGIN === 'true'

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

router.beforeEach((to, from, next) => {
    const routerBus = useEventBus<string>('router')
    routerBus.emit('busRouterChange')

    updateToken((to?.name ?? 'busRouterChange') as string)

    // 使用者
    const authStore = useAuthStore()
    const { isLogin } = storeToRefs(authStore)

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
    const pagePermission = (routerPermission?.permission ?? 0)

    // 防止無限遞迴
    const callNext = (pageName: string) => {
      if (!baseRoutesName.includes(to.name)) {
        tempTo.value = null
      }

      if (to.name === pageName) {
        next()
      } else {
        next({ name: pageName })
      }
    }

    /**
     * iframe
     * src="...?views=page
     */
    const [
      toPage
      // fromPage
    ] = [
      to?.redirectedFrom?.query?.views ?? '',
      from?.redirectedFrom?.query?.views ?? ''
    ]
    if (!isEmpty(toPage) && typeof toPage === 'string') {
      tempTo.value = to
      callNext(toPage)
      return
    }

    // 未登入
    if (!isLogin.value && !isSkipLogin) {
      // 頁面暫存
      if (!baseRoutesName.includes(to.name as string)) {
        tempTo.value = to
      }
      callNext('login')
      return
    }

    // 沒有讀取的權限
    if (
      from.name &&
      !baseRoutesName.includes(to.name as string) &&
      !hasPermission(pagePermission, permission.read)
    ) {
      callNext('noPermissions')
      return
    }

    if (tempTo.value) {
      const temp = tempTo.value
      tempTo.value = null
      next({ ...temp })
      return
    }

    // 如果要進登入頁 自動跳回首頁
    if (to.name === 'login') {
      callNext('locatehome')
      return
    }

    next()
  }
)

export default router
