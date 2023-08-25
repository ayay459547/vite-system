import type { ComputedRef, ShallowRef } from 'vue'
import { shallowRef, computed, shallowReactive, onBeforeMount } from 'vue'
import { defineStore } from 'pinia'

import type { Navigation } from '@/declare/routes'
import { getRouterLeafLayer, refactorRoutes } from '@/lib/lib_routes'
import routes from '@/router/routes'

import {
  getHistoryNavigation as getHistory,
  setHistoryNavigation as setHistory,
  delHistoryNavigation as deleteHistory,
  clearHistoryNavigation as clearHistory,
  keysHistoryNavigation as keysHistory
} from '@/lib/lib_idb'

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

  // 歷史路由
  const map = new Map<string, Navigation>()
  const historyNavigation = shallowReactive(map)
  const addHistoryNavigation = (key: string, value: Navigation) => {
    if (!historyNavigation.has(key)) {
      historyNavigation.set(key, value)
      const _value = JSON.parse(JSON.stringify(value))
      setHistory(key, _value)
    }
  }
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
    const historyList: Promise<Navigation>[] = []

    if (keyList.length > 0) {
      keyList.forEach((key: string) => {
        historyList.push(getHistory(key))
      })

      const resList = await Promise.all(historyList)

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
  const setNavigationRoutes = (routesPermission: Map<string, any>) => {
    navigationRoutes.value = refactorRoutes<Navigation>((leafNode, parentsNode) => {
      const nextNode: Navigation = {
        ...leafNode
      }
      if (parentsNode === null) {
        nextNode.breadcrumbName = [leafNode.name]
        nextNode.breadcrumbTitle = [leafNode.title]
      } else{
        nextNode.breadcrumbName = [...parentsNode.breadcrumbName, leafNode.name]
        nextNode.breadcrumbTitle = [...parentsNode.breadcrumbTitle, leafNode.title]
      }

      /**
       * 依據 路由權限
       * 設定 是否顯示
       * 設定 權限的總和
       *
       * api 沒有 給預設權限
       */
      const routerPermission = routesPermission.get(leafNode.name)

      if (typeof routerPermission === 'number') {
        nextNode.permission = routerPermission
      } else {
        nextNode.permission = defaultPermission
      }

      /**
       * 設置搜尋用 map
       */
      navigationMap.value.set(leafNode.name, nextNode)

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
    addHistoryNavigation,
    removeHistoryNavigation,
    clearHistoryNavigation,

    navigationRoutes,
    navigationMap,
    setNavigationRoutes
  }
})
