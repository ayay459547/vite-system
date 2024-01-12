import type { ComputedRef, ShallowRef } from 'vue'
import { shallowRef, computed, shallowReactive, onBeforeMount } from 'vue'
import { defineStore } from 'pinia'

import type { Navigation } from '@/declare/routes'
import { getRouterLeafLayer, refactorRoutes } from '@/lib/lib_routes'
import routes from '@/router/routes'
import debounce from '@/lib/lib_debounce'

import {
  getHistoryNavigation as getHistory,
  setHistoryNavigation as setHistory,
  delHistoryNavigation as deleteHistory,
  clearHistoryNavigation as clearHistory,
  keysHistoryNavigation as keysHistory
} from '@/lib/lib_idb'

import { getProxyData, isEmpty } from '@/lib/lib_utils'

import { permission, defaultPermission, hasPermission } from '@/lib/lib_permission'

export type HistoryNavigation = Navigation & { visitCount?: number }

// 網址前綴
const systemUrl = (import.meta as any).env.VITE_API_SYSTEM_URL

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

  // 歷史路由
  const map = new Map<string, HistoryNavigation>()
  const historyNavigation = shallowReactive(map)
  const addHistoryNavigation = async (key: string, value: Navigation) => {
    let newCount = 0

    if (!historyNavigation.has(key)) {
      // idb 取得舊的訪問次數
      const _value = await getHistory(key)
      if (!isEmpty(_value)) {
        const { visitCount: oldCount = 0 } = _value as HistoryNavigation
        newCount = oldCount
      } else {
      // 不存在舊的次數 代表是第一次訪問
        newCount = 1
      }

    } else {
      // 再次訪問時 次數 + 1
      const navigation = historyNavigation.get(key)
      const { visitCount: oldCount = 0 } = navigation
      newCount = oldCount + 1
    }

    const navigation = {
      ...value,
      // 訪問次數
      visitCount: newCount
    }

    historyNavigation.set(key, navigation)
    const _navigation = getProxyData(navigation)
    setHistory(key, _navigation)
  }
  // 做防抖 避免因為畫面刷新而重複計算 訪問次數
  const debounceAddHistoryNavigation = debounce(addHistoryNavigation, 700) as typeof addHistoryNavigation

  const removeHistoryNavigation = (key: string) => {
    if (historyNavigation.has(key)) {
      historyNavigation.delete(key)
      deleteHistory(key)
    }
  }
  const clearHistoryNavigation = () => {
    historyNavigation.clear()
    clearHistory()
  }

  // 從 indexedDB 初始化 先前的路由資料
  const initHistoryNavigation = async () => {
    const keyList = await keysHistory()
    const historyList: Promise<HistoryNavigation>[] = []

    if (keyList.length > 0) {
      keyList.forEach((key: string) => {
        historyList.push(getHistory(key))
      })
      const resList = await Promise.all(historyList)

      // 依照訪問次數排序
      resList.sort((a, b) => {
        return (b?.visitCount ?? 0) - (a?.visitCount ?? 0)
      })

      resList.forEach(resItem => {
        addHistoryNavigation(resItem.name, resItem)
      })
    }
  }
  onBeforeMount(() => {
    initHistoryNavigation()
  })

  // Navigation 三層選單 + 歷史選單 用
  const navigationRoutes: ShallowRef<Navigation[]> = shallowRef([])
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
          // 或閘取最大權限
          res = (res ?? 0) | (_getLeavesPermission(curr) ?? 0)

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
     */
    const _getRouterPermission = (route: Navigation, nodeName: string): number => {
      if (!permissionMap.has(nodeName)) {

        const nodePermission = [
          // 依據後端權限資料 算出最大值
          _getLeavesPermission(route),
          // 路由設定
          route.permission,
          // 系統預設
          defaultPermission
        ].find(_permission => typeof _permission === 'number')

        permissionMap.set(nodeName, nodePermission)
      }

      return permissionMap.get(nodeName)
    }

    navigationRoutes.value = refactorRoutes<Navigation>((leafNode, parentsNode) => {
      const {
        path: leafNodePath = '',
        name: leafNodeName = '',
        title: leafNodeTitle = ''
      } = leafNode

      const nextNode: Navigation = {
        ...leafNode,
        path: `${systemUrl}${leafNodePath}`
      }
      if (parentsNode === null) {
        nextNode.breadcrumbName = [leafNodeName]
        nextNode.breadcrumbTitle = [leafNodeTitle]
      } else{
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
        isShow: hasPermission(nextNode.permission, permission.read)
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

    historyNavigation,
    addHistoryNavigation: debounceAddHistoryNavigation,
    removeHistoryNavigation,
    clearHistoryNavigation,

    navigationRoutes,
    navigationMap,
    setNavigationRoutes
  }
})
