import type { RouterTree } from '@/declare/routes'

const testRoutes: RouterTree[] = [
  {
    name: 'development',
    title: '開發工具',
    systemType: ['development'],
    icon: 'code',
    leaves: [
      {
        name: 'feature-list',
        title: '功能列表',
        meta: {
          keepAlive: false,
          status: 'completed'
        },
        systemType: ['development'],
        path: '/feature-list',
        component: () => import('@/views/Development/FeatureList/FeatureList.vue')
      },
      {
        name: 'i18n-list',
        title: '翻譯值列表',
        meta: {
          keepAlive: false,
          status: 'inProgress'
        },
        systemType: ['development'],
        path: '/i18n-list',
        component: () => import('@/views/Development/I18nList/I18nList.vue')
      },
      {
        name: 'excel-utils',
        title: 'Excel工具',
        meta: {
          keepAlive: false,
          status: 'inProgress'
        },
        systemType: ['development'],
        path: '/excel-utils',
        component: () => import('@/views/Development/ExcelUtils/ExcelUtils.vue')
      },
      {
        name: 'search-view',
        title: '功能樹狀表',
        meta: {
          keepAlive: true,
          status: 'completed'
        },
        systemType: ['development'],
        path: '/search-view',
        component: () => import('@/views/Development/SearchView/SearchView.vue')
      },
      {
        name: 'schedule',
        title: '工作進度表',
        meta: {
          keepAlive: true,
          status: 'completed'
        },
        systemType: ['development'],
        path: '/schedule',
        component: () => import('@/views/Development/ScheduleView/ScheduleView.vue')
      }
    ]
  }
]

export default testRoutes