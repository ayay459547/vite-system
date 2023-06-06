import type { RouterTree } from '@/declare/routes'
import type { IconType } from '@/components/feature/CustomIcon/CustomIcon.vue'
import { refactorRoutes } from '@/lib/routes'

const mode = (import.meta as any).env.MODE

export type RouterType = 'system' | 'new' | 'development' | 'test' | 'complete'

/**
 * key: 類型
 * value: icon
 */
export const routerTypeIcon: Record<RouterType, [IconType, string]> = {
  system: ['fas', 'i'],

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

  return refactorRoutes<RouterTree>(leafNode => {
    const isShow = checkTypeInInjectType(leafNode.systemType, injectType)

    return {
      refactorNode: {...leafNode},
      isShow
    }
  }, routes)
}