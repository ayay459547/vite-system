import { useI18n } from 'vue-i18n'

import type { UseHookReturn } from '@/types/types_hook' // 全域功能類型
import type { RouterTree, Navigation } from '@/types/types_routes'
import { isEmpty } from '@/lib/lib_utils' // 工具

/**
 * @author Caleb
 * @description 用BFS的方式 取的指定的階層的路由
 * @param routes 路由
 * @param level 想取的的階層
 * @param hasLeaves 是否包含子路由
 * @returns {Array} 返回路由
 */
export const getRouterLeafLayer = (
  routes: RouterTree[],
  level = [1, 2, 3],
  hasLeaves = true
): Array<RouterTree> => {
  const res: any[] = []

  const _getRouterLeaf = (
    routes: RouterTree[] = [],
    res: RouterTree[] = [],
    options = {
      currLevel: 1, // 目前階層
      getLevel: [1, 2, 3], // 想取得的階層
      hasLeaves: true // 是否包含子路由
    }
  ): void => {
    const { currLevel, getLevel, hasLeaves } = options

    if (currLevel > Math.max(...getLevel)) return // 超過指定層數就結束

    const nextLeaves: any[] = []

    routes.forEach((routerItem: any) => {
      if (getLevel.includes(currLevel)) {
        const pushItem = { ...routerItem }
        // 去掉子路由
        if (!hasLeaves && Object.prototype.hasOwnProperty.call(pushItem, 'leaves')) {
          delete pushItem.leaves
        }
        res.push(pushItem)
      }
      if (Object.prototype.hasOwnProperty.call(routerItem, 'leaves')) {
        nextLeaves.push(...routerItem.leaves)
      }
    })

    if (nextLeaves.length > 0) {
      _getRouterLeaf(nextLeaves, res, {
        currLevel: currLevel + 1,
        getLevel,
        hasLeaves
      })
    }
  }

  _getRouterLeaf(routes, res, {
    currLevel: 1,
    getLevel: level,
    hasLeaves
  })

  return res
}

/**
 * @author Caleb
 * @description 用DFS的方式 將路由樹重構
 * @param callback 回掉函數 可自訂格式
 * @param routes 路由
 * @returns {Array} T 指定格式
 */
export const refactorRoutes = <T>(
  callback: (
    leafNode: RouterTree,
    parentsNode: T | null
  ) => {
    refactorNode: T // 重構後的格式
    isShow: boolean // 是否顯示
  },
  routes: RouterTree[]
): Array<T> => {
  const res: Array<T> = []

  const _refactorRoutes = (leafNode: RouterTree[], parentsNode: T | null, res: Array<T>) => {
    leafNode.forEach(route => {
      const { refactorNode: currentNode, isShow } = callback(route, parentsNode)

      if (isShow) {
        // 不可自訂 leaves
        if (Object.prototype.hasOwnProperty.call(currentNode, 'leaves')) {
          delete (currentNode as any).leaves
        }
        if (Object.prototype.hasOwnProperty.call(route, 'leaves')) {
          const len = res.push({
            ...currentNode,
            leaves: []
          })

          _refactorRoutes((route?.leaves ?? []), currentNode, (res[len - 1] as any).leaves)
        } else {
          res.push({ ...currentNode })
        }
      }
    })
  }
  _refactorRoutes(routes, null, res)

  return res
}

/**
 * @author Caleb
 * @description 取得路由的圖示 如果沒有圖示 使用類型的圖示
 * @param {Object} nav 路由
 * @returns {Array} 圖示
 */
const getRouteIcon = (nav: Navigation | null | undefined | any): any => {
  if ([null, undefined].includes(nav)) return ['fas', 'question']
  const meta = nav.meta
  if (!isEmpty(meta.icon)) return meta.icon
  return { icon: ['fas', 'hashtag'] }
}

/**
 * @author Caleb
 * @description 取得路由的文字 如果有翻譯使用翻譯 沒有就使用 title
 * @param {Object} nav 路由
 * @returns {String} 文字
 */
const getRouteTitle = (nav: Navigation | null | undefined | any, { i18nTranslate, i18nTest }: any): string => {
  if ([null, undefined].includes(nav)) return i18nTranslate('system-module') as unknown as string

  if (i18nTest(nav.name)) return i18nTranslate(nav.name) as unknown as string
  return nav.title
}

export const useRoutesHook = (params?: {
  i18nTranslate?: UseHookReturn['i18nTranslate']
  i18nTest?: UseHookReturn['i18nTest']
}) => {
  const { i18nTranslate, i18nTest } = params ?? {}

  const {
    t: _i18nTranslate,
    // locale: i18nLocale,
    te: _i18nTest // 測試 key 是否存在
  } = useI18n()

  return {
    getRouterLeafLayer,
    refactorRoutes,
    getRouteIcon,
    getRouteTitle: (nav: Navigation | null | undefined): string => {
      return getRouteTitle(nav, {
        i18nTranslate: i18nTranslate ?? _i18nTranslate,
        i18nTest: i18nTest ?? _i18nTest
      })
    }
  }
}
