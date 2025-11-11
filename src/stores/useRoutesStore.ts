import { shallowRef, computed } from 'vue'
import { defineStore } from 'pinia'

import type { AuthData } from '@/types/types_hook' // 全域功能類型
import type { Navigation, RouterTree } from '@/types/types_routes'
import { refactorRoutes } from '@/lib/lib_routes'
import { defaultServiceLevels } from '@/declare/declare_routes'
import { PermissionEnum, defaultPermission, totalPermission, hasPermission } from '@/lib/lib_permission' // 權限
import { isEmpty, hasOwnProperty, tipLog, fetchPublicJsonFile } from '@/lib/lib_utils' // 工具

import Page_404 from '@/views/Common/Page_404.vue'
import { routerInfoMap } from '@/router/routes'
import { testRoutesRoot } from '@/router/router_test'

const mode = (import.meta as any).env.MODE

export const useRoutesStore = defineStore('Routes', () => {
  const routes = shallowRef<RouterTree[]>([])
  // 初始化路由設定
  const initRoutes = async () => {
    console.log('🍍 stores_routes initRoutes()')
    // transformExcel.ts: 將 excel 轉換成 json
    const routesJson = await fetchPublicJsonFile('/router/routes.json')
    const excelJsonList = routesJson as any[]
    if (isEmpty(excelJsonList)) return []

    const routerMap: Record<string, any> = {}

    const getRouterInfo = (key: string, excelJsonItem: any): RouterTree & { __routerMap__: any } => {
      const {
        title: excelJsonItemTitle = '',
        // meta
        permission = defaultPermission,
        isEnabled = true,
        isInProgress = false,
        isFix = false,
        isMain = false,
        serviceLevels = defaultServiceLevels
      } = excelJsonItem

      const defaultRouterInfo = {
        name: key,
        title: excelJsonItemTitle,
        component: Page_404,
        meta: {
          icon: {
            xType: 'fluent',
            name: 'Question16Filled'
          },
          isKeepAlive: false,
          permission: totalPermission
        }
      }

      const router = hasOwnProperty(routerInfoMap, key) ? routerInfoMap[key] : defaultRouterInfo
      const { name, title, component, meta } = router

      return {
        name,
        title,
        component,
        meta: {
          ...meta,
          permission,
          isEnabled,
          isInProgress,
          isFix,
          isMain,
          serviceLevels
        },
        // 轉換成 leaves
        __routerMap__: {}
      }
    }

    // 有重複的 name 給予提示
    const nameSet = new Set()
    const tipList: any[] = []

    // 將 excel 資料加入 routerMap
    excelJsonList.forEach(excelJsonItem => {
      // 三層式架構
      const { nav1, nav2, nav3, title } = excelJsonItem

      const [isNav1, isNav2, isNav3] = [
        typeof nav1 === 'string' && nav2 === undefined && nav3 === undefined,
        typeof nav1 === 'string' && typeof nav2 === 'string' && nav3 === undefined,
        typeof nav1 === 'string' && typeof nav2 === 'string' && typeof nav3 === 'string'
      ]

      // 提示
      const key = (() => {
        if (isNav1) return nav1
        if (isNav2) return nav2
        if (isNav3) return nav3
      })()
      if (nameSet.has(key)) {
        tipList.push(`${key}(${title}): ${JSON.stringify(excelJsonItem)}`)
      }
      nameSet.add(key)

      try {
        // 第一層
        if (isNav1 && !hasOwnProperty(routerMap, nav1)) {
          routerMap[nav1] = getRouterInfo(nav1, excelJsonItem)
        }
        // 第二層
        if (isNav2 && !hasOwnProperty(routerMap[nav1].__routerMap__, nav2)) {
          routerMap[nav1].__routerMap__[nav2] = getRouterInfo(nav2, excelJsonItem)
        }
        // 第三層
        if (isNav3 && !hasOwnProperty(routerMap[nav1].__routerMap__[nav2].__routerMap__, nav3)) {
          routerMap[nav1].__routerMap__[nav2].__routerMap__[nav3] = getRouterInfo(nav3, excelJsonItem)
        }
      } catch (e) {
        tipLog('initRoutes Error', [e, excelJsonItem])
      }
    })

    // 提示
    if (tipList.length > 0) {
      tipLog('Routes 中有重複的 name', tipList)
    }

    // 將 routerMap 轉換成 routes
    const getPageRoutes = (routerMap: Record<string, any>) => {
      if (typeof routerMap !== 'object') return []

      return Object.values<any>(routerMap).map<any>(router => {
        const _router = (typeof router.component === 'function') ?
          { ...router } :
          { ...router, leaves: getPageRoutes(router?.__routerMap__ ?? {}) }

        delete _router.__routerMap__
        return _router
      })
    }

    const pageRoutes: Array<RouterTree> = getPageRoutes(routerMap)

    const allRoutes: Array<RouterTree> = [...pageRoutes]
    // 開發模式 才顯示測試用頁面
    if (mode === 'development') {
      allRoutes.push(testRoutesRoot)
    }

    /**
     * 功能使用條件
     * isEnabled = true
     * 客戶等級 >= 功能等級
     */
    const enabledRoutes = refactorRoutes<RouterTree>(leafNode => {
      const isEnabled = leafNode?.meta?.isEnabled ?? true

      return {
        refactorNode: {...leafNode},
        isShow: isEnabled
      }
    }, allRoutes)

    routes.value = enabledRoutes
    return enabledRoutes
  }


  // 當前路由
  const currentNavigation = shallowRef<Navigation | null>(null)
  // 設定當前路由
  const setCurrentNavigation = (route: Navigation | null) => {
    currentNavigation.value = route
  }

  // 麵包屑(翻譯)
  const breadcrumbName = computed(() => {
    return currentNavigation.value?.breadcrumbName ?? []
  })
  // 麵包屑 沒有對應翻譯使用
  const breadcrumbTitle = computed(() => {
    return currentNavigation.value?.breadcrumbTitle ?? []
  })

  // 路由資料 Map(string, route)
  const navigationMap = shallowRef<Map<string, Navigation>>(new Map())
  // Navigation 選單
  const navigationRoutes = shallowRef<Navigation[]>([])

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
          (readPermissions ? PermissionEnum.Read : 0) +
          (createPermissions ? PermissionEnum.Create : 0) +
          (updatePermissions ? PermissionEnum.Update : 0) +
          (deletePermissions ? PermissionEnum.Delete : 0) +
          (executePermissions ? PermissionEnum.Execute : 0)

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
     * 1. 後端資料
     * 2. 取得子路由最大權限
     */
    const _getLeavesPermission = (route: Navigation): number | undefined => {
      if (routesPermission.has(route.name)) {
        const leavesPermission = routesPermission.get(route.name) ?? 0
        permissionMap.set(route.name, leavesPermission)
        return leavesPermission
      }
      if (permissionMap.has(route.name)) return permissionMap.get(route.name)

      if (Array.isArray(route?.leaves)) {
        const _leavesPermission = route.leaves.reduce<number | undefined>((res, curr) => {
          const _temp = _getLeavesPermission(curr)
          if (typeof _temp === 'number') {
            // 或閘取最大權限
            res = (res ?? 0) | _temp
          }

          return res
        }, undefined)

        return _leavesPermission
      }

      return undefined
    }

    /**
     * 權限 (對應 PageContent.vue => pagePermission)
     * 1. 後端資料
     * 2. 路由設定: 停用
     * 3. 系統預設
     */
    const _getRouterPermission = (route: Navigation, nodeName: string): number => {
      if (!permissionMap.has(nodeName)) {
        const leavesMaxPermission = _getLeavesPermission(route)

        // 只要有 security
        const nodePermission = (
          // 依據後端權限資料 算出最大值
          leavesMaxPermission ??
          // 路由設定: 停用(防止後端無資料/無權限 頁面依然顯示)
          // route?.meta?.permission ??
          // 系統預設
          defaultPermission
        )

        permissionMap.set(nodeName, nodePermission)
      }
      return permissionMap.get(nodeName) ?? 0
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
        nextNode.breadcrumbName = [...(parentsNode?.breadcrumbName ?? []), leafNodeName]
        nextNode.breadcrumbTitle = [...(parentsNode?.breadcrumbTitle ?? []), leafNodeTitle]
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
        isShow: hasPermission(routerPermission, PermissionEnum.Read)
      }
    }, routes.value)
  }

  return {
    routes,
    initRoutes,

    breadcrumbName,
    breadcrumbTitle,

    currentNavigation,
    setCurrentNavigation,

    navigationRoutes,
    navigationMap,
    setNavigationRoutes
  }
})
