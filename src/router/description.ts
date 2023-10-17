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
        component: () => import('@/views/ComponentsDescription/Des_Badge.vue'),
        icon: 'medal'
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
        component: () => import('@/views/ComponentsDescription/Des_Button.vue'),
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
        component: () => import('@/views/ComponentsDescription/Des_Divider.vue'),
        icon: 'slash'
      },
      {
        name: 'description-draggable',
        title: 'CustomDraggable',
        meta: {
          keepAlive: false,
          status: 'completed'
        },
        systemType: ['development', 'test'],
        path: '/description-draggable',
        component: () => import('@/views/ComponentsDescription/Des_Draggable.vue'),
        icon: 'grip-vertical'
      },
      {
        name: 'description-drawer',
        title: 'CustomDrawer',
        meta: {
          keepAlive: false,
          status: 'completed'
        },
        systemType: ['development', 'test'],
        path: '/description-drawer',
        component: () => import('@/views/ComponentsDescription/Des_Drawer.vue'),
        icon: 'square-caret-down'
      },
      {
        name: 'description-empty',
        title: 'CustomEmpty',
        meta: {
          keepAlive: false,
          status: 'completed'
        },
        systemType: ['development', 'test'],
        path: '/description-empty',
        component: () => import('@/views/ComponentsDescription/Des_Empty.vue'),
        icon: 'cube'
      },
      {
        name: 'description-icon',
        title: 'CustomIcon',
        meta: {
          keepAlive: false,
          status: 'completed'
        },
        systemType: ['development', 'test'],
        path: '/description-icon',
        component: () => import('@/views/ComponentsDescription/Des_Icon.vue'),
        icon: 'flag'
      },
      {
        name: 'description-image',
        title: 'CustomImage',
        meta: {
          keepAlive: false,
          status: 'completed'
        },
        systemType: ['development', 'test'],
        path: '/description-image',
        component: () => import('@/views/ComponentsDescription/Des_Image.vue'),
        icon: 'images'
      },
      {
        name: 'description-modal',
        title: 'CustomModal',
        meta: {
          keepAlive: false,
          status: 'completed'
        },
        systemType: ['development', 'test'],
        path: '/description-modal',
        component: () => import('@/views/ComponentsDescription/Des_Modal.vue'),
        icon: 'window-restore'
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
        component: () => import('@/views/ComponentsDescription/Des_Table.vue'),
        icon: 'table'
      }
    ]
  }
]

export default descriptionRoutes