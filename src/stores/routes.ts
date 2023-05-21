import type { ComputedRef, Ref } from 'vue'
import { ref, computed, reactive, onBeforeMount } from 'vue'
import { defineStore } from 'pinia'

import type { Navigation } from '@/declare/routes'
import { getRouterLeaf } from '@/lib/routes'
import routes from '@/router/routes'

import {
  getHistoryNavigation as getHistory,
  setHistoryNavigation as setHistory,
  delHistoryNavigation as deleteHistory,
  clearHistoryNavigation as clearHistory,
  keysHistoryNavigation as keysHistory
} from '@/lib/idb'

export const useRoutesStore = defineStore('routes', () => {
  // 導覽
  const breadcrumb: Ref<string[]> = ref([])
  const setBreadcrumb = (newBreadcrumb: string[]) => {
    breadcrumb.value = newBreadcrumb
  }

  // 當前路由
  const currentNavigation: Ref<Navigation | null> = ref(null)
  const setCurrentNavigation = (route: Navigation) => {
    currentNavigation.value = route
  }

  // 歷史路由
  const map = new Map<string, Navigation>()
  const historyNavigation = reactive(map)
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

  // 各階層的路由
  const level1Routes: ComputedRef<Navigation[]> = computed(() => {
    return getRouterLeaf(routes, 1, false)
  })
  const level2Routes: ComputedRef<Navigation[]> = computed(() => {
    return getRouterLeaf(routes, 2, false)
  })
  const level3Routes: ComputedRef<Navigation[]> = computed(() => {
    return getRouterLeaf(routes, 3, false)
  })

  return {
    breadcrumb,
    setBreadcrumb,
    historyNavigation,
    addHistoryNavigation,
    removeHistoryNavigation,
    clearHistoryNavigation,
    currentNavigation,
    setCurrentNavigation,
    level1Routes,
    level2Routes,
    level3Routes
  }
})
