import type { RouterTree } from '@/types/types_routes'
import { totalPermission } from '@/lib/lib_permission' // 權限

const testRoutes: RouterTree[] = [
  {
    name: 'system',
    title: '開發工具',
    meta: {
      isEnabled: true,
      permission: totalPermission,
      icon: 'code'
    },
    leaves: [
      {
        name: 'feature-list',
        title: '功能列表',
        component: () => import('@/views/Development/FeatureList/FeatureList.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'i18n-list',
        title: '翻譯值列表',
        component: () => import('@/views/Development/I18nList/I18nList.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'excel-utils',
        title: 'Excel工具',
        component: () => import('@/views/Development/ExcelUtils/ExcelUtils.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'search-view',
        title: '功能樹狀表',
        component: () => import('@/views/Development/SearchView/SearchView.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'do-scheduling',
        title: '工作進度表',
        component: () => import('@/views/Development/ScheduleView/ScheduleView.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission
        }
      }
    ]
  }
]

export default testRoutes
