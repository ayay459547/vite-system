import { shallowRef } from 'vue'
import type { RouteRecord, RouteLocationNormalized, Router } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useEventBus } from '@/lib/lib_hook' // 自訂Composition API
import { useAuthStore } from '@/stores/useAuthStore'
import type { RouterTree } from '@/types/types_routes'
import { isEmpty } from '@/lib/lib_utils' // 工具
import { refreshToken } from '@/lib/lib_token'

import { commonRoutes } from './Common'

// 是否跳過登入
const isSkipLogin = (import.meta as any).env.VITE_API_SKIP_LOGIN === 'true'

// 初始化路由設定
export const initRouter = (routes: RouterTree[]): Router => {
  /**
   * @author Caleb
   * @description 用DFS的方式 將路由樹轉換成可使用路由
   * @param {Array} routes 路由樹
   * @returns {Array} vue-router 指定格式
   */
  const treeToRoutes = (routes: RouterTree[]): RouteRecord[] => {
    const res: any[] = []

    const _treeToRoutes = (routes: RouterTree[], res: RouteRecord[]): void => {
      routes.forEach(route => {
        if (Object.prototype.hasOwnProperty.call(route, 'component')) {
          const { name, title, meta, component } = route

          const pushItem: any = {
            name,
            path: `/${name}`,
            component,
            meta: {
              title,
              isKeepAlive: false,
              isInProgress: false, // 功能開發中
              isFix: false, // 功能維護中
              isMain: false, // 主要功能
              ...meta
            },
            props: (route: RouteLocationNormalized) => {
              return { query: route.query }
            }
          }
          res.push(pushItem)
        }
        if (Object.prototype.hasOwnProperty.call(route, 'leaves')) {
          _treeToRoutes((route?.leaves ?? []), res)
        }
      })
    }

    _treeToRoutes(routes, res)
    return res
  }

  const resRoutes = treeToRoutes(routes)

  // 基本路由不受權限引響
  const commonRoutesName = commonRoutes.reduce<any[]>((res, curr) => {
    const routeName: any = curr.name
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
      routerBus.emit('beforeRouterChange')

      // 刷新 Token
      refreshToken((`RouterChange: ${to?.name?.toString() ?? ''}`) as string)

      // 使用者
      const authStore = useAuthStore()
      const { isLogin } = storeToRefs(authStore)

      // 防止無限遞迴
      const callNext = (pageName: string) => {
        if (!commonRoutesName.includes(to.name)) {
          tempTo.value = null
        }

        if (to.name === pageName) {
          next()
        } else {
          next({ name: pageName })
        }
      }

      /**
       * 使用 <iframe src="...?views=page></iframe>
       *
       * 使用記得調整 .env
       * VITE_API_IFRAME="true": 是否是 iframe
       * VITE_API_SKIP_LOGIN='true': 是否跳過登入
       * VITE_API_ALL_PERMISSION='true': 是否取得所有權限
       */
      const toPage = to?.redirectedFrom?.query?.views ?? ''
      // const fromPage = from?.redirectedFrom?.query?.views ?? ''
      if (!isEmpty(toPage) && typeof toPage === 'string') {
        tempTo.value = to
        callNext(toPage)
        return
      }

      // 未登入
      if (!isLogin.value && !isSkipLogin) {
        // 暫存頁面
        if (!commonRoutesName.includes(to.name as string)) {
          tempTo.value = to
        }
        callNext('login')
        return
      }

      // 進入暫存頁面
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

  return router
}
