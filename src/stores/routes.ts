import type { ComputedRef, Ref } from 'vue'
import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

import type { Navigation } from '@/declare/routes'
import { getRouterLeaf } from '@/lib/routes'
import routes from '@/router/routes'

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
    }
  }
  const removeHistoryNavigation = (key: string) => {
    if (historyNavigation.has(key)) {
      historyNavigation.delete(key)
    }
  }
  const clearHistoryNavigation = () => {
    historyNavigation.clear()
  }

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
