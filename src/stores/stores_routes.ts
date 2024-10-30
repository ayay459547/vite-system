import type { ShallowRef } from 'vue'
import { shallowRef } from 'vue'
import { defineStore } from 'pinia'

import type { AuthData } from '@/declare/hook' // 全域功能類型
import type { Navigation } from '@/declare/routes'
import {
  // getRouterLeafLayer,
  refactorRoutes
} from '@/lib/lib_routes'
import { permission, defaultPermission, hasPermission } from '@/lib/lib_permission' // 權限

import routes from '@/router/routes'

export const useRoutesStore = defineStore('routes', () => {
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

  // 路由資料 Map(string, route)
  const navigationMap: ShallowRef<Map<string, Navigation>> = shallowRef(new Map())
  // Navigation 選單
  const navigationRoutes: ShallowRef<Navigation[]> = shallowRef([])

  /**
   * 設置 選單用資料 + 搜尋用 map
   * @param authData 使用者資料
   */
  const setNavigationRoutes = (authData: AuthData) => {
    const { roleFunction: permissionList } = authData

    /**
     * 依照使用者 id
     * 取得權限資料
     * Map(route, permissions)
     */
    const routesPermission = new Map<string, number>()

    // 依照後端資料初始化權限
    if (Array.isArray(permissionList) && permissionList.length > 0) {
      // 設定路由權限
      permissionList.forEach(permissionItem => {
        const {
          pk,
          readPermissions,
          createPermissions,
          updatePermissions,
          deletePermissions,
          executePermissions
        } = permissionItem

        // 依據API權限 設定權限的總和
        const routePermission = 0 +
          (readPermissions ? permission.read : 0) +
          (createPermissions ? permission.create : 0) +
          (updatePermissions ? permission.update : 0) +
          (deletePermissions ? permission.delete : 0) +
          (executePermissions ? permission.execute : 0)

        routesPermission.set(pk.functionID, routePermission)
      })
    } else {
      // 清除
      routesPermission.clear()

      // 所有權限設定 0
      // const routeList = getRouterLeafLayer(routes, [1, 2, 3], false)
      // routeList.forEach(routeItem => {
      //   routesPermission.set(routeItem.name, 0)
      // })
    }

    // 已經設定過的權限
    const permissionMap = new Map<string, number>()
    /**
     * 後端資料
     * 1. 後端資料
     * 2. 取得子路由最大權限
     */
    const _getLeavesPermission = (route: Navigation): number | null => {
      if (routesPermission.has(route.name)) {
        const leavesPermission = routesPermission.get(route.name)
        permissionMap.set(route.name, leavesPermission)
        return leavesPermission
      }
      if (permissionMap.has(route.name)) return permissionMap.get(route.name)

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
        const leavesMaxPermission = _getLeavesPermission(route)

        const nodePermission = [
          // 依據後端權限資料 算出最大值
          leavesMaxPermission,
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
      nextNode.permission = routerPermission

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
