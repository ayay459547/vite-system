import type { RouterTree } from '@/declare/routes'

const descriptionRoutes: RouterTree[] = [
  {
    name: 'components-description',
    title: '組件說明',
    systemType: ['development', 'test'],
    icon: 'book',
    leaves: [
      {
        name: 'description-badge',
        title: 'CustomBadge',
        meta: {
          keepAlive: false,
          status: 'completed'
        },
        systemType: ['development', 'test'],
        path: '/description-badge',
        component: () => import('@/views/ComponentsDescription/DescriptionBadge.vue'),
        icon: 'ribbon'
      },
      {
        name: 'description-button',
        title: 'CustomButton',
        meta: {
          keepAlive: false,
          status: 'completed'
        },
        systemType: ['development', 'test'],
        path: '/description-button',
        component: () => import('@/views/ComponentsDescription/DescriptionButton.vue'),
        icon: 'hand-pointer'
      },
      {
        name: 'description-divider',
        title: 'CustomDivider',
        meta: {
          keepAlive: false,
          status: 'completed'
        },
        systemType: ['development', 'test'],
        path: '/description-divider',
        component: () => import('@/views/ComponentsDescription/DescriptionDivider.vue'),
        icon: 'slash'
      },
      {
        name: 'description-table',
        title: 'CustomTable',
        meta: {
          keepAlive: false,
          status: 'completed'
        },
        systemType: ['development', 'test'],
        path: '/description-table',
        component: () => import('@/views/ComponentsDescription/DescriptionTable.vue'),
        icon: 'table'
      }
    ]
  }
]

export default descriptionRoutes