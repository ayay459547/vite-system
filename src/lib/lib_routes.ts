import { useI18n } from 'vue-i18n'

import type { RouterTree, Navigation } from '@/declare/routes'
import type { IconType } from '@/components'
import { type RouterType, routerTypeIcon } from '@/router/setting'
import { isEmpty } from '@/lib/lib_utils'

/**
 * @author Caleb
 * @description 用BFS的方式 取的指定的階層的路由
 * @param routerList 路由
 * @param level 想取的的階層
 * @param hasLeaves 是否包含子路由
 * @returns {Array} 返回路由
 */
export const getRouterLeafLayer = (routerList: RouterTree[], level = [1, 2, 3], hasLeaves = true): Array<RouterTree> => {
  const res = []

  const _getRouterLeaf = (
    routerList: RouterTree[] = [],
    res: RouterTree[] = [],
    options = {
      currLevel: 1,         // 目前階層
      getLevel: [1, 2, 3],  // 想取得的階層
      hasLeaves: true       // 是否包含子路由
    }
  ): void => {
    const { currLevel, getLevel, hasLeaves } = options

    if (currLevel > Math.max(...getLevel)) return  // 超過指定層數就結束

    const nextLeaves = []

    routerList.forEach(routerItem => {
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

  _getRouterLeaf(routerList, res, {
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
  callback: (leafNode: RouterTree, parentsNode: T) => {
    refactorNode: T // 重構後的格式
    isShow: boolean // 是否顯示
  },
  routes: RouterTree[]
): Array<T> => {
  const res: Array<T> = []

  const _refactorRoutes = (leafNode: RouterTree[], parentsNode: T | null, res: Array<T>) => {
    leafNode.forEach(route => {
      const {
        refactorNode: currentNode,
        isShow
      } = callback(route, parentsNode)

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

          _refactorRoutes(route.leaves, currentNode, (res[len - 1] as any).leaves)
        } else {
          res.push({ ...currentNode })
        }
      }

    })
  }
  _refactorRoutes(routes, null, res)

  return res
}

const getIcon = (icon:  [IconType, string] | string): [IconType, string] => {
  if (typeof icon === 'string') return ['fas', icon]
  return icon
}
const getLastTypeIcon = (systemType: RouterType[]): [IconType, string] => {
  const lastType = systemType[systemType.length - 1]
  return routerTypeIcon[lastType]
}

/**
 * @author Caleb
 * @description 取得路由的圖示 如果沒有圖示 使用類型的圖示
 * @param {Object} nav 路由
 * @returns {Array} 圖示
 */
const getRouteIcon = (nav: Navigation | null | undefined): [IconType, string] => {
  // 如果是 home
  if ([null, undefined].includes(nav)) return ['fas', 'list']

  if (!isEmpty(nav.icon)) return getIcon(nav.icon)
  return getLastTypeIcon(nav.systemType)
}

/**
 * @author Caleb
 * @description 取得路由的文字 如果有翻譯使用翻譯 沒有就使用 title
 * @param {Object} nav 路由
 * @returns {String} 文字
 */
const getRouteTitle = (nav: Navigation | null | undefined, { i18nTranslate, i18nTest }): string => {
  if ([null, undefined].includes(nav)) return (i18nTranslate('systemModule') as unknown as string)

  if (i18nTest(nav.name)) return (i18nTranslate(nav.name) as unknown as string)
  return nav.title
}

export const routesHook = () => {
  const {
    t: i18nTranslate,
    // locale: i18nLocale,
    te: i18nTest // 測試 key 是否存在
  } = useI18n()

  return {
    getRouterLeafLayer,
    refactorRoutes,
    getRouteIcon,
    getRouteTitle: (nav: Navigation | null | undefined): string => {
      return getRouteTitle(nav, {
        i18nTranslate,
        i18nTest
      })
    }
  }
}
