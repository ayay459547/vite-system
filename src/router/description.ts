import type { RouterTree } from '@/declare/routes'

const descriptionRoutes: RouterTree[] = [
  {
    name: 'components-description',
    title: '組件說明',
    systemType: ['development', 'test'],
    icon: 'book',
    leaves: [
      {
        name: 'description-button',
        title: 'CustomButton',
        meta: {
          keepAlive: true,
          status: 'completed'
        },
        systemType: ['development', 'test'],
        path: '/description-button',
        component: () => import('@/views/ComponentsDescription/DescriptionButton.vue'),
        icon: 'hand-pointer'
      },
      {
        name: 'description-table',
        title: 'CustomTable',
        meta: {
          keepAlive: true,
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