import type { RouterTree } from '@/declare/routes'

const descriptionRoutes: RouterTree[] = [
  {
    name: 'components-description',
    title: '組件說明',
    systemType: ['development', 'test'],
    icon: 'book',
    leaves: [
      {
        name: 'description-1',
        title: '輸入框組件',
        systemType: ['new'],
        icon: 'wand-magic-sparkles',
        leaves: []
      },
      {
        name: 'description-2',
        title: '表格組件',
        systemType: ['new'],
        icon: 'wand-magic-sparkles',
        leaves: [
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
      },
      {
        name: 'description-3',
        title: '常用組件',
        systemType: ['new'],
        icon: 'wand-magic-sparkles',
        leaves: [
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
          }
        ]
      },
      {
        name: 'description-4',
        title: '其他組件',
        systemType: ['new'],
        icon: 'wand-magic-sparkles',
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
            name: 'description-drawer',
            title: 'CustomDrawer',
            meta: {
              keepAlive: false,
              status: 'completed'
            },
            systemType: ['development', 'test'],
            path: '/description-drawer',
            component: () => import('@/views/ComponentsDescription/Des_Drawer.vue'),
            icon: 'window-maximize'
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
            name: 'description-popover',
            title: 'CustomPopover',
            meta: {
              keepAlive: false,
              status: 'completed'
            },
            systemType: ['development', 'test'],
            path: '/description-popver',
            component: () => import('@/views/ComponentsDescription/Des_Popover.vue'),
            icon: 'arrow-pointer'
          },
          {
            name: 'description-tooltip',
            title: 'CustomTooltip',
            meta: {
              keepAlive: false,
              status: 'completed'
            },
            systemType: ['development', 'test'],
            path: '/description-tooltip',
            component: () => import('@/views/ComponentsDescription/Des_Tooltip.vue'),
            icon: 'arrow-pointer'
          },
          {
            name: 'description-collapse',
            title: 'CustomCollapse',
            meta: {
              keepAlive: false,
              status: 'completed'
            },
            systemType: ['development', 'test'],
            path: '/description-collapse',
            component: () => import('@/views/ComponentsDescription/Des_Collapse.vue'),
            icon: 'square-caret-down'
          },
          {
            name: 'description-switch',
            title: 'CustomSwitch',
            meta: {
              keepAlive: false,
              status: 'completed'
            },
            systemType: ['development', 'test'],
            path: '/description-switch',
            component: () => import('@/views/ComponentsDescription/Des_Switch.vue'),
            icon: 'toggle-off'
          }
        ]
      }
    ]
  }
]

export default descriptionRoutes