import type { RouterTree } from '@/declare/routes'
import type { CustomIconProps } from '@/components' // 系統組件
import { refactorRoutes } from '@/lib/lib_routes'

const mode = (import.meta as any).env.MODE

export type RouterType = 'system' | 'new' | 'inProgress' | 'completed' | 'development' | 'test'

/**
 * key: 類型
 * value: icon
 */
export const routerTypeIcon: Record<RouterType, [CustomIconProps.Type, string]> = {
  system: ['fas', 'paper-plane'],
  new: ['fas', 'xmark'],
  inProgress: ['fas', 'hammer'],
  completed: ['far', 'check'],
  development: ['fas', 'wrench'],
  test: ['fas', 'flask-vial']
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
  'completed'
]

/**
 * 打包要顯示的類型
 * production
 */
export const productionInjectType: Array<RouterType> = [
  'new',
  'system'
  // 'completed'
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
    const systemType = leafNode?.meta?.systemType ?? []
    const isShow = checkTypeInInjectType(systemType, injectType)

    return {
      refactorNode: { ...leafNode },
      isShow
    }
  }, routes)
}
