import type { RouterTree } from '@/declare/routes'

/**
 * @author Caleb
 * @description 取的指定的階層的子路由
 * @param routerList 路由
 * @param level 想取的的階層
 * @param hasLeaves 是否包含子路由
 * @returns {Array} 返回路由
 */
export const getRouterLeaf = (routerList: RouterTree[], level = 1, hasLeaves = true): Array<RouterTree> => {
  const res = []

  const _getRouterLeaf = (
    routerList: RouterTree[] = [],
    res: RouterTree[] = [],
    options = {
      currLevel: 1,    // 目前階層
      getLevel: 1,     // 想取得的階層
      hasLeaves: true, // 是否包含子路由
      parent: 'root'   // 父節點的 name
    }
  ): void => {
    const { currLevel, getLevel, hasLeaves, parent } = options

    if (currLevel > getLevel) return  // 超過指定層數就結束

    routerList.forEach(routerItem => {
      if (currLevel === getLevel) {
        const pushItem = {
          parent,
          ...routerItem
        }
        // 去掉子路由
        if (!hasLeaves && Object.hasOwnProperty.call(pushItem, 'leaves')) {
          delete pushItem.leaves
        }
        res.push(pushItem)
      }
      if (Object.hasOwnProperty.call(routerItem, 'leaves')) {
        _getRouterLeaf(routerItem.leaves, res, {
          currLevel: currLevel + 1,
          getLevel,
          hasLeaves,
          parent: routerItem.name
        })
      }
    })
  }

  _getRouterLeaf(routerList, res, {
    currLevel: 1,
    getLevel: level,
    hasLeaves,
    parent: 'root'
  })

  return res
}

/**
 * @author Caleb
 * @description 將路由樹重構
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
      } else {
        res[routeIndex] = { ...currentNode }
      }

      if (Object.hasOwnProperty.call(route, 'leaves')) {
        _refactorRoutes(route.leaves, currentNode, (res[routeIndex] as any).leaves)
      }
    })
  }
  _refactorRoutes(routes, null, res)

  return res
}