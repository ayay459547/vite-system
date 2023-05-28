import type { RouterTree } from '@/declare/routes'
import type { IconType } from '@/components/feature/icon/CustomIcon.vue'

const mode = (import.meta as any).env.MODE

export type RouterType = 'system' | 'new' | 'development' | 'test' | 'complete'

/**
 * key: 類型
 * value: icon
 */
export const routerTypeIcon: Record<RouterType, [IconType, string]> = {
  system: ['fas', ''],

  new: ['fas', 'plus'],
  development: ['fas', 'wrench'],
  test: ['fas', 'flask-vial'],
  complete: ['fas', 'check']
}

/**
 * 開發中要顯示的類型
 * development
 */
export const developmentInjectType: Array<RouterType> = [
  'system',
  'new',
  'development',
  'test',
  'complete'
]

/**
 * 打包要顯示的類型
 * production
 */
export const productionInjectType: Array<RouterType> = [
  'system',
  'complete'
]

/**
 * @author Caleb
 * @description 取得可顯示的路由
 * @param routes 原始路由
 * @returns {Array}
 */
export const getInjectRoutes = (routes: RouterTree[]): RouterTree[] => {
  const res = []
  let injectType: RouterType[] = []

  switch (mode) {
    case 'development':
      injectType = developmentInjectType
      break
    case 'production':
      injectType = productionInjectType
      break
  }

  /**
   * @description 需要全部類型都包含在 可接受類型中
   * @param typeList 路由類型
   * @param injectType 可接受的類型
   * @returns {Boolean}
   */
  const checkTypeInInjectType = (typeList: RouterType[], injectType: RouterType[]): boolean => {
    return typeList.every(type => {
      return injectType.includes(type)
    })
  }

  const _getInjectRoutes = (leafNode: RouterTree[], tempRes: RouterTree[]): RouterTree[] => {
    leafNode.forEach(route => {
      // 確認類型符合 才使用此路由
      if (checkTypeInInjectType(route.systemType, injectType)) {
        if (Object.hasOwnProperty.call(route, 'leaves')) {
          let len = tempRes.length
          len = tempRes.push({
            ...route,
            leaves: []
          })

          _getInjectRoutes(route.leaves, tempRes[len - 1].leaves)
        } else {
          tempRes.push(route)
        }
      }

    })
    return res
  }
  _getInjectRoutes(routes, res)

  return res
}