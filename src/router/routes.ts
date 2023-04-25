import type { RouterTree } from '@/declare/router'

const routes: Array<RouterTree> = [
  {
    name: 'nav-1',
    title: '選單1',
    inject: true,
    complete: false,
    Leaves: [
      {
        name: 'nav-1-1',
        title: '選單1-1',
        inject: true,
        complete: false,
        Leaves: [
          {
            path: 'nav-1-1-1',
            name: 'nav-1-1-1',
            title: '選單1-1-1',
            inject: true,
            complete: false,
            component: () => import('@/views/EmptyView.vue')
          },
          {
            path: 'nav-1-1-2',
            name: 'nav-1-1-2',
            title: '選單1-1-2',
            inject: true,
            complete: false,
            component: () => import('@/views/EmptyView.vue')
          },
          {
            path: 'nav-1-1-3',
            name: 'nav-1-1-3',
            title: '選單1-1-3',
            inject: true,
            complete: false,
            component: () => import('@/views/EmptyView.vue')
          },
          {
            path: 'nav-1-1-4',
            name: 'nav-1-1-4',
            title: '選單1-1-4',
            inject: true,
            complete: false,
            component: () => import('@/views/EmptyView.vue')
          },
          {
            path: 'nav-1-1-5',
            name: 'nav-1-1-5',
            title: '選單1-1-5',
            inject: true,
            complete: false,
            component: () => import('@/views/EmptyView.vue')
          }
        ]
      },
      {
        name: 'nav-1-2',
        title: '選單1-2',
        inject: true,
        complete: false,
        Leaves: [
          {
            path: 'nav-1-2-1',
            name: 'nav-1-2-1',
            title: '選單1-2-1',
            inject: true,
            complete: false,
            component: () => import('@/views/EmptyView.vue')
          },
          {
            path: 'nav-1-2-2',
            name: 'nav-1-2-2',
            title: '選單1-2-1',
            inject: true,
            complete: false,
            component: () => import('@/views/EmptyView.vue')
          },
          {
            path: 'nav-1-2-3',
            name: 'nav-1-2-3',
            title: '選單1-2-3',
            inject: true,
            complete: false,
            component: () => import('@/views/EmptyView.vue')
          },
          {
            path: 'nav-1-2-4',
            name: 'nav-1-2-4',
            title: '選單1-2-4',
            inject: true,
            complete: false,
            component: () => import('@/views/EmptyView.vue')
          },
          {
            path: 'nav-1-2-5',
            name: 'nav-1-2-5',
            title: '選單1-2-5',
            inject: true,
            complete: false,
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
    complete: false,
    Leaves: []
  }
]

export default routes