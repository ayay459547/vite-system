import type { RouterTree } from '@/declare/routes'

/**
 * @author Caleb
 * @description 用BFS的方式 取的指定的階層的子路由
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
        if (!hasLeaves && Object.hasOwnProperty.call(pushItem, 'leaves')) {
          delete pushItem.leaves
        }
        res.push(pushItem)
      }
      if (Object.hasOwnProperty.call(routerItem, 'leaves')) {
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
export const refactorRoutes = <T>(callback: (leafNode: RouterTree, parentsNode: T) => T, routes: RouterTree[]): Array<T> => {
  const res: Array<T> = []

  const _refactorRoutes = (leafNode: RouterTree[], parentsNode: T | null, res: Array<T>) => {
    leafNode.forEach((route, routeIndex) => {
      const currentNode = callback(route, parentsNode)
      // 不可自訂 leaves
      if (Object.hasOwnProperty.call(currentNode, 'leaves')) {
        delete (currentNode as any).leaves
      }
      if (Object.hasOwnProperty.call(route, 'leaves')) {
        res[routeIndex] = {
          ...currentNode,
          leaves: route.leaves
        }

        _refactorRoutes(route.leaves, currentNode, (res[routeIndex] as any).leaves)
      } else {
        res[routeIndex] = { ...currentNode }
      }

    })
  }
  _refactorRoutes(routes, null, res)

  return res
}