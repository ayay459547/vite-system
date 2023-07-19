import type { RouterTree } from '@/declare/routes'

const testRoutes: RouterTree[] = [
  {
    name: 'development',
    title: '開發查詢工具',
    systemType: ['development'],
    icon: 'code',
    leaves: [
      {
        name: 'search-view',
        title: '功能樹狀表',
        meta: {
          keepAlive: true
        },
        systemType: ['development'],
        path: '/search-view',
        component: () => import('@/views/Development/SearchView/SearchView.vue')
      },
      {
        name: 'feature-list',
        title: '功能列表',
        meta: {
          keepAlive: false
        },
        systemType: ['development'],
        path: '/feature-list',
        component: () => import('@/views/Development/FeatureList/FeatureList.vue')
      },
      {
        name: 'i18n-list',
        title: '翻譯值列表',
        meta: {
          keepAlive: false
        },
        systemType: ['development'],
        path: '/i18n-list',
        component: () => import('@/views/Development/I18nList/I18nList.vue')
      }
    ]
  }
]

export default testRoutes