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
        leaves: [
          {
            name: 'nav1-1-1',
            title: '選單1-1-1',
            meta: {
              keepAlive: false,
              status: 'completed'
            },
            systemType: ['new'],
            path: '/nav1-1-1',
            component: () => import('@/views/Nav1-1-1/Nav1-1-1.vue')
          },
          {
            name: 'nav1-1-2',
            title: '選單1-1-2',
            systemType: ['new'],
            path: '/nav1-1-2',
            component: () => import('@/views/Nav1-1-2/Nav1-1-2.vue')
          },
          {
            name: 'nav1-1-3',
            title: '選單1-1-3',
            systemType: ['new'],
            path: '/nav1-1-3',
            component: () => import('@/views/Common/FixView.vue')
          },
          {
            name: 'nav1-1-4',
            title: '選單1-1-4',
            systemType: ['new'],
            path: '/nav1-1-4',
            component: () => import('@/views/Nav1-1-4/Nav1-1-4.vue')
          },
          {
            name: 'nav1-1-5',
            title: '選單1-1-5',
            systemType: ['new'],
            path: '/nav1-1-5',
            component: () => import('@/views/Nav1-1-5/Nav1-1-5.vue')
          }
        ]
      },
      {
        name: 'nav1-2',
        title: '選單1-2',
        systemType: ['new'],
        leaves: [
          {
            name: 'nav1-2-1',
            title: '選單1-2-1',
            systemType: ['new'],
            path: '/nav1-2-1',
            component: () => import('@/views/Common/EmptyView.vue')
          },
          {
            name: 'nav1-2-2',
            title: '選單1-2-2',
            systemType: ['new'],
            path: '/nav1-2-2',
            component: () => import('@/views/Nav1-2-2/Nav1-2-2.vue')
          },
          {
            name: 'nav1-2-3',
            title: '選單1-2-3',
            systemType: ['new'],
            path: '/nav1-2-3',
            component: () => import('@/views/Common/EmptyView.vue')
          },
          {
            name: 'nav1-2-4',
            title: '選單1-2-4',
            systemType: ['new'],
            path: '/nav1-2-4',
            component: () => import('@/views/Common/EmptyView.vue')
          },
          {
            name: 'nav-1-2-5',
            title: '選單1-2-5',
            systemType: ['new'],
            path: '/nav-1-2-5',
            component: () => import('@/views/Common/EmptyView.vue')
          }
        ]
      },
      {
        name: 'nav1-3',
        title: '選單1-3',
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
            systemType: ['new'],
            path: '/nav1-4-1',
            component: () => import('@/views/Common/EmptyView.vue')
          },
          {
            name: 'nav1-4-2',
            title: '選單1-4-1',
            systemType: ['new'],
            path: '/nav1-4-2',
            component: () => import('@/views/Common/EmptyView.vue')
          },
          {
            name: 'nav1-4-3',
            title: '選單1-4-3',
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
        leaves: [
          {
            name: 'nav3-1-1',
            title: '選單3-1-1',
            systemType: ['new'],
            path: '/nav3-1-1',
            component: () => import('@/views/Common/EmptyView.vue')
          },
          {
            name: 'nav3-1-2',
            title: '選單3-1-2',
            systemType: ['new'],
            path: '/nav3-1-2',
            component: () => import('@/views/Common/EmptyView.vue')
          },
          {
            name: 'nav3-1-3',
            title: '選單3-1-3',
            systemType: ['new'],
            path: '/nav3-1-3',
            component: () => import('@/views/Common/EmptyView.vue')
          }
        ]
      },
      {
        name: 'nav3-2',
        title: '選單3-2',
        systemType: ['new'],
        leaves: [
          {
            name: 'nav3-2-1',
            title: '選單3-2-1',
            systemType: ['new'],
            path: '/nav3-2-1',
            component: () => import('@/views/Common/EmptyView.vue')
          },
          {
            name: 'nav3-2-2',
            title: '選單3-2-1',
            systemType: ['new'],
            path: '/nav3-2-2',
            component: () => import('@/views/Common/EmptyView.vue')
          },
          {
            name: 'nav3-2-3',
            title: '選單3-2-3',
            systemType: ['new'],
            path: '/nav3-2-3',
            component: () => import('@/views/Common/EmptyView.vue')
          },
          {
            name: 'nav3-2-4',
            title: '選單3-2-4',
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