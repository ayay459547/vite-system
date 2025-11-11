import type { RouterTree } from '@/types/types_routes'
import { totalPermission } from '@/lib/lib_permission' // 權限
import { CalebTestRoutes } from './Caleb'

export const testRoutes: RouterTree[] = [
  ...CalebTestRoutes
]

export const testRoutesRoot: RouterTree = {
  name: 'test',
  title: '測試',
  meta: {
    isEnabled: true,
    isInProgress: false,
    isFix: false,
    isMain: false,
    permission: totalPermission,
    serviceLevels: 'Basic'
  },
  leaves: testRoutes
}

export default testRoutes
