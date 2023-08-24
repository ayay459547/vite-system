import type { RouterTree } from '@/declare/routes'
import testRoutes from './test'
import developmentRoutes from './development'
import { getInjectRoutes } from './setting'

const routes: Array<RouterTree> = [
  {
    name: 'nav1',
    title: '選單1',
    systemType: ['new'],
    icon: 'cloud',
    leaves: [
      {
        name: 'nav1-1',
        title: '選單1-1',
        systemType: ['new'],
        icon: 'wand-magic-sparkles',
        leaves: [
          {
            name: 'nav1-1-1',
            title: '測試表單',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-1-1',
            icon: 'table',
            component: () => import('@/views/Nav1-1-1/Nav1-1-1.vue')
          },
          {
            name: 'nav1-1-2',
            title: '清單列表',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-1-2',
            icon: 'table-list',
            component: () => import('@/views/Nav1-1-2/Nav1-1-2.vue')
          },
          {
            name: 'nav1-1-3',
            title: '無權限1-1-3',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-1-3',
            icon: 'info',
            component: () => import('@/views/Common/FixView.vue')
          },
          {
            name: 'nav1-1-4',
            title: '行事曆',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-1-4',
            icon: 'calendar-days',
            component: () => import('@/views/Nav1-1-4/Nav1-1-4.vue')
          },
          {
            name: 'nav1-1-5',
            title: '時間線測試',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-1-5',
            icon: 'timeline',
            component: () => import('@/views/Nav1-1-5/Nav1-1-5.vue')
          }
        ]
      },
      {
        name: 'nav1-2',
        title: '選單1-2',
        systemType: ['new'],
        icon: 'lemon',
        leaves: [
          {
            name: 'nav1-2-1',
            title: '無權限1-2-1',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-2-1',
            icon: 'info',
            component: () => import('@/views/Common/EmptyView.vue')
          },
          {
            name: 'nav1-2-2',
            title: '時間線測試2',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-2-2',
            icon: 'timeline',
            component: () => import('@/views/Nav1-2-2/Nav1-2-2.vue')
          },
          {
            name: 'nav1-2-3',
            title: '多列表單編輯',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-2-3',
            icon: 'file-pen',
            component: () => import('@/views/Nav1-2-3/Nav1-2-3.vue')
          },
          {
            name: 'nav1-2-4',
            title: '眼睛跟滑鼠',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-2-4',
            icon: 'face-laugh-beam',
            component: () => import('@/views/Nav1-2-4/Nav1-2-4.vue')
          },
          {
            name: 'nav-1-2-5',
            title: 'QRcode',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav-1-2-5',
            icon: 'qrcode',
            component: () => import('@/views/Nav1-2-5/Nav1-2-5.vue')
          }
        ]
      },
      {
        name: 'nav1-3',
        title: '選單1-3',
        meta: {
          keepAlive: false,
          status: 'completed',
          startDate: '2023-08',
          completedDate: '2023-08'
        },
        systemType: ['new'],
        path: '/nav1-3',
        component: () => import('@/views/Common/EmptyView.vue')
      },
      {
        name: 'nav1-4',
        title: '選單1-4',
        systemType: ['new'],
        leaves: [
          {
            name: 'nav1-4-1',
            title: '選單1-4-1',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-4-1',
            component: () => import('@/views/Common/EmptyView.vue')
          },
          {
            name: 'nav1-4-2',
            title: '選單1-4-1',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-4-2',
            component: () => import('@/views/Common/EmptyView.vue')
          },
          {
            name: 'nav1-4-3',
            title: '選單1-4-3',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-4-3',
            component: () => import('@/views/Common/EmptyView.vue')
          }
        ]
      }
    ]
  },
  {
    name: 'nav2',
    title: '選單2',
    meta: {
      keepAlive: false,
      status: 'completed',
      startDate: '2023-08',
      completedDate: '2023-08'
    },
    systemType: ['new'],
    icon: 'shield-halved',
    path: '/nav2',
    component: () => import('@/views/Nav2/Nav2.vue')
  },
  {
    name: 'nav3',
    title: '選單3',
    systemType: ['new'],
    icon: 'cloud',
    leaves: [
      {
        name: 'nav3-1',
        title: '選單3-1',
        systemType: ['new'],
        icon: 'table-list',
        leaves: [
          {
            name: 'nav3-1-1',
            title: '手寫虛擬列表',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav3-1-1',
            icon: 'table',
            component: () => import('@/views/Nav3-1-1/Nav3-1-1.vue')
          },
          {
            name: 'nav3-1-2',
            title: 'Clusterize.js虛擬列表',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav3-1-2',
            icon: 'table-cells',
            component: () => import('@/views/Nav3-1-2/Nav3-1-2.vue')
          },
          {
            name: 'nav3-1-3',
            title: '一般列表懶加載',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav3-1-3',
            icon: 'table-list',
            component: () => import('@/views/Nav3-1-3/Nav3-1-3.vue')
          }
        ]
      },
      {
        name: 'nav3-2',
        title: '選單3-2',
        systemType: ['new'],
        icon: 'e',
        leaves: [
          {
            name: 'nav3-2-1',
            title: '虛擬列表資訊來源',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav3-2-1',
            icon: 'link',
            component: () => import('@/views/Nav3-2-1/Nav3-2-1.vue')
          },
          {
            name: 'nav3-2-2',
            title: 'UxeTable取代ElTable',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav3-2-2',
            icon: 'u',
            component: () => import('@/views/Nav3-2-2/Nav3-2-2.vue')
          },
          {
            name: 'nav3-2-3',
            title: '選單3-2-3',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav3-2-3',
            component: () => import('@/views/Common/EmptyView.vue')
          },
          {
            name: 'nav3-2-4',
            title: '選單3-2-4',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav3-2-4',
            component: () => import('@/views/Common/EmptyView.vue')
          }
        ]
      },
      {
        name: 'nav3-3',
        title: '選單3-3',
        systemType: ['new'],
        leaves: [
          {
            name: 'nav3-3-1',
            title: '選單3-3-1',
            systemType: ['new'],
            path: '/nav3-3-1',
            component: () => import('@/views/Common/EmptyView.vue')
          },
          {
            name: 'nav3-3-3',
            title: '選單3-3-3',
            systemType: ['new'],
            path: '/nav3-3-3',
            component: () => import('@/views/Common/EmptyView.vue')
          },
          {
            name: 'nav3-3-4',
            title: '選單3-3-4',
            systemType: ['new'],
            path: '/nav3-3-4',
            component: () => import('@/views/Common/EmptyView.vue')
          }
        ]
      }
    ]
  }
]

export default getInjectRoutes([
  ...routes,
  ...developmentRoutes,
  ...testRoutes
])