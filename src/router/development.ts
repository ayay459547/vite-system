import type { RouterTree } from '@/declare/routes'

const testRoutes: RouterTree[] = [
  {
    name: 'system',
    title: '開發工具',
    meta: {
      systemType: ['system'],
      icon: 'code'
    },
    leaves: [
      {
        name: 'feature-list',
        title: '功能列表',
        component: () => import('@/views/Development/FeatureList/FeatureList.vue'),
        meta: {
          keepAlive: false,
          systemType: ['system']
        }
      },
      {
        name: 'i18n-list',
        title: '翻譯值列表',
        component: () => import('@/views/Development/I18nList/I18nList.vue'),
        meta: {
          keepAlive: false,
          systemType: ['system']
        }
      },
      {
        name: 'excel-utils',
        title: 'Excel工具',
        component: () => import('@/views/Development/ExcelUtils/ExcelUtils.vue'),
        meta: {
          keepAlive: false,
          systemType: ['system']
        }
      },
      {
        name: 'search-view',
        title: '功能樹狀表',
        component: () => import('@/views/Development/SearchView/SearchView.vue'),
        meta: {
          keepAlive: true,
          systemType: ['system']
        }
      },
      {
        name: 'do-scheduling',
        title: '工作進度表',
        component: () => import('@/views/Development/ScheduleView/ScheduleView.vue'),
        meta: {
          keepAlive: true,
          systemType: ['system']
        }
      }
    ]
  }
]

export default testRoutes
