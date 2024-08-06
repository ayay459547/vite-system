import type { ComputedRef, ShallowRef } from 'vue'
import { shallowRef, computed } from 'vue'
import { defineStore } from 'pinia'

import type { Navigation } from '@/declare/routes'
import { getRouterLeafLayer, refactorRoutes } from '@/lib/lib_routes'
import routes from '@/router/routes'

import { permission, defaultPermission, hasPermission } from '@/lib/lib_permission'

export const useRoutesStore = defineStore('routes', () => {
  // 全部的路由
  const allRoutes: ComputedRef<Navigation[]> = computed(() => {
    return getRouterLeafLayer(routes, [1, 2, 3], false)
  })

  // 左側選單欄 確認是否 active
  const breadcrumbName: ShallowRef<string[]> = shallowRef([])
  const setBreadcrumbName = (newBreadcrumb: string[]) => {
    breadcrumbName.value = newBreadcrumb
  }

  // 導覽
  const breadcrumbTitle: ShallowRef<string[]> = shallowRef([])
  const setBreadcrumbTitle = (newBreadcrumb: string[]) => {
    breadcrumbTitle.value = newBreadcrumb
  }

  // 當前路由
  const currentNavigation: ShallowRef<Navigation | null> = shallowRef(null)
  const setCurrentNavigation = (route: Navigation) => {
    currentNavigation.value = route
  }

  // Navigation 三層選單 + 歷史選單 用
  const navigationRoutes: ShallowRef<Navigation[]> = shallowRef([])

  /**
   * 路由資料
   * 權限用
   * key(route): value
   */
  const navigationMap: ShallowRef<Map<string, Navigation>> = shallowRef(new Map())

  // 設置 選單用資料 + 搜尋用 map
  const setNavigationRoutes = (routesPermission: Map<string, number>) => {
    // 已經設定過的權限
    const permissionMap = new Map<string, number>()
    /**
     * 後端資料
     * 1. 後端資料
     * 2. 取得子路由最大權限
     */
    const _getLeavesPermission = (route: Navigation): number | null => {
      if (permissionMap.has(route.name)) return permissionMap.get(route.name)
      if (routesPermission.has(route.name)) return routesPermission.get(route.name)

      if (Array.isArray(route?.leaves)) {
        const _leavesPermission = route.leaves.reduce<number | null>((res, curr) => {
          const _temp = _getLeavesPermission(curr)
          if (typeof _temp === 'number') {
            // 或閘取最大權限
            res = (res ?? 0) | _temp
          }

          return res
        }, null)

        return _leavesPermission
      }

      return null
    }

    /**
     * 給權限順序
     * 1. 後端資料
     * 2. 路由設定
     * 3. 系統預設
     * 4. 0 (無權限)
     */
    const _getRouterPermission = (route: Navigation, nodeName: string): number => {
      if (!permissionMap.has(nodeName)) {
        const nodePermission = [
          // 依據後端權限資料 算出最大值
          _getLeavesPermission(route),
          // 路由設定
          route?.meta?.permission,
          // 系統預設
          defaultPermission,
          // 無權限
          0
        ].find(_permission => typeof _permission === 'number')

        permissionMap.set(nodeName, nodePermission)
      }

      return permissionMap.get(nodeName)
    }

    navigationRoutes.value = refactorRoutes<Navigation>((leafNode, parentsNode) => {
      const {
        name: leafNodeName = '',
        title: leafNodeTitle = ''
      } = leafNode
      const nextNode: Navigation = {...leafNode}

      if (parentsNode === null) {
        nextNode.breadcrumbName = [leafNodeName]
        nextNode.breadcrumbTitle = [leafNodeTitle]
      } else {
        nextNode.breadcrumbName = [...parentsNode.breadcrumbName, leafNodeName]
        nextNode.breadcrumbTitle = [...parentsNode.breadcrumbTitle, leafNodeTitle]
      }

      /**
       * 依據 路由權限
       * 設定 是否顯示
       * 設定 權限的總和
       */
      const routerPermission = _getRouterPermission(leafNode, leafNodeName)
      nextNode.meta.permission = routerPermission

      /**
       * 設置搜尋用 map
       */
      navigationMap.value.set(leafNodeName, nextNode)

      return {
        refactorNode: nextNode,
        isShow: hasPermission(routerPermission, permission.read)
      }
    }, routes)
  }

  return {
    allRoutes,

    breadcrumbName,
    setBreadcrumbName,
    breadcrumbTitle,
    setBreadcrumbTitle,

    currentNavigation,
    setCurrentNavigation,

    navigationRoutes,
    navigationMap,
    setNavigationRoutes
  }
})
