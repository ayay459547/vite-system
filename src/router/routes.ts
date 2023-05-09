import type { RouterTree } from '@/declare/routes'
import testRoutes from './test'

const routes: Array<RouterTree> = [
  {
    name: 'about',
    title: '關於',
    inject: true,
    complete: false,
    icon: 'gear',
    path: '/about',
    component: () => import('@/views/AboutView.vue')
  },
  {
    name: 'nav-1',
    title: '選單1',
    inject: true,
    complete: true,
    icon: 'cloud',
    leaves: [
      {
        name: 'nav-1-1',
        title: '選單1-1',
        inject: true,
        complete: false,
        leaves: [
          {
            name: 'nav-1-1-1',
            title: '選單1-1-1',
            inject: true,
            complete: true,
            path: '/nav-1-1-1',
            component: () => import('@/views/nav-1-1-1/nav-1-1-1.vue')
          },
          {
            name: 'nav-1-1-2',
            title: '選單1-1-2',
            inject: true,
            complete: true,
            path: '/nav-1-1-2',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-1-1-3',
            title: '選單1-1-3',
            inject: true,
            complete: true,
            path: '/nav-1-1-3',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-1-1-4',
            title: '選單1-1-4',
            inject: true,
            complete: true,
            path: '/nav-1-1-4',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-1-1-5',
            title: '選單1-1-5',
            inject: true,
            complete: true,
            path: '/nav-1-1-5',
            component: () => import('@/views/EmptyView.vue')
          }
        ]
      },
      {
        name: 'nav-1-2',
        title: '選單1-2',
        inject: true,
        complete: true,
        leaves: [
          {
            name: 'nav-1-2-1',
            title: '選單1-2-1',
            inject: true,
            complete: true,
            path: '/nav-1-2-1',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-1-2-2',
            title: '選單1-2-1',
            inject: true,
            complete: true,
            path: '/nav-1-2-2',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-1-2-3',
            title: '選單1-2-3',
            inject: true,
            complete: true,
            path: '/nav-1-2-3',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-1-2-4',
            title: '選單1-2-4',
            inject: true,
            complete: true,
            path: '/nav-1-2-4',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-1-2-5',
            title: '選單1-2-5',
            inject: true,
            complete: true,
            path: '/nav-1-2-5',
            component: () => import('@/views/EmptyView.vue')
          }
        ]
      },
      {
        name: 'nav-1-3',
        title: '選單1-3',
        inject: true,
        complete: true,
        path: '/nav-1-3',
        component: () => import('@/views/EmptyView.vue')
      },
      {
        name: 'nav-1-4',
        title: '選單1-4',
        inject: true,
        complete: true,
        leaves: [
          {
            name: 'nav-1-4-1',
            title: '選單1-4-1',
            inject: true,
            complete: true,
            path: '/nav-1-4-1',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-1-4-2',
            title: '選單1-4-1',
            inject: true,
            complete: true,
            path: '/nav-1-4-2',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-1-4-3',
            title: '選單1-4-3',
            inject: true,
            complete: true,
            path: '/nav-1-4-3',
            component: () => import('@/views/EmptyView.vue')
          }
        ]
      }
    ]
  },
  {
    name: 'nav-2',
    title: '選單2',
    inject: true,
    complete: true,
    icon: 'shield-halved',
    path: '/nav-2',
    component: () => import('@/views/Nav-2/Nav-2.vue')
  },
  {
    name: 'nav-3',
    title: '選單3',
    inject: true,
    complete: true,
    icon: 'cloud',
    leaves: [
      {
        name: 'nav-3-1',
        title: '選單3-1',
        inject: true,
        complete: true,
        leaves: [
          {
            name: 'nav-3-1-1',
            title: '選單3-1-1',
            inject: true,
            complete: true,
            path: '/nav-3-1-1',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-3-1-2',
            title: '選單3-1-2',
            inject: true,
            complete: true,
            path: '/nav-3-1-2',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-3-1-3',
            title: '選單3-1-3',
            inject: true,
            complete: true,
            path: '/nav-3-1-3',
            component: () => import('@/views/EmptyView.vue')
          }
        ]
      },
      {
        name: 'nav-3-2',
        title: '選單3-2',
        inject: true,
        complete: true,
        leaves: [
          {
            name: 'nav-3-2-1',
            title: '選單3-2-1',
            inject: true,
            complete: true,
            path: '/nav-3-2-1',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-3-2-2',
            title: '選單3-2-1',
            inject: true,
            complete: true,
            path: '/nav-3-2-2',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-3-2-3',
            title: '選單3-2-3',
            inject: true,
            complete: true,
            path: '/nav-3-2-3',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-3-2-4',
            title: '選單3-2-4',
            inject: true,
            complete: true,
            path: '/nav-3-2-4',
            component: () => import('@/views/EmptyView.vue')
          }
        ]
      },
      {
        name: 'nav-3-3',
        title: '選單3-3',
        inject: true,
        complete: true,
        leaves: [
          {
            name: 'nav-3-3-1',
            title: '選單3-3-1',
            inject: true,
            complete: true,
            path: '/nav-3-3-1',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-3-3-3',
            title: '選單3-3-3',
            inject: true,
            complete: true,
            path: '/nav-3-3-3',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-3-3-4',
            title: '選單3-3-4',
            inject: true,
            complete: true,
            path: '/nav-3-3-4',
            component: () => import('@/views/EmptyView.vue')
          }
        ]
      }
    ]
  }
]

export default [...routes, ...testRoutes]