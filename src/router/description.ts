import type { RouterTree } from '@/declare/routes.ts'

const descriptionRoutes: RouterTree[] = [
  {
    name: 'components-description',
    title: '組件說明',
    meta: {
      systemType: ['development', 'test'],
      icon: 'book'
    },
    leaves: [
      {
        name: 'description-1',
        title: '輸入框組件',
        meta: {
          systemType: ['new']
        },
        leaves: []
      },
      {
        name: 'description-2',
        title: '表格組件',
        meta: {
          systemType: ['new']
        },
        leaves: [
          {
            name: 'description-table',
            title: 'CustomTable',
            component: () => import('@/views/ComponentsDescription/Des_Table.vue'),
            meta: {
              keepAlive: false,
              systemType: ['development', 'test']
            }
          }
        ]
      },
      {
        name: 'description-3',
        title: '常用組件',
        meta: {
          systemType: ['new']
        },
        leaves: [
          {
            name: 'description-button',
            title: 'CustomButton',
            component: () => import('@/views/ComponentsDescription/Des_Button.vue'),
            meta: {
              keepAlive: false,
              systemType: ['development', 'test']
            }
          },
          {
            name: 'description-icon',
            title: 'CustomIcon',
            component: () => import('@/views/ComponentsDescription/Des_Icon.vue'),
            meta: {
              keepAlive: false,
              systemType: ['development', 'test']
            }
          },
          {
            name: 'description-modal',
            title: 'CustomModal',
            component: () => import('@/views/ComponentsDescription/Des_Modal.vue'),
            meta: {
              keepAlive: false,
              systemType: ['development', 'test']
            }
          }
        ]
      },
      {
        name: 'description-4',
        title: '其他組件',
        meta: {
          systemType: ['new']
        },
        leaves: [
          {
            name: 'description-badge',
            title: 'CustomBadge',
            component: () => import('@/views/ComponentsDescription/Des_Badge.vue'),
            meta: {
              keepAlive: false,
              systemType: ['development', 'test']
            }
          },
          {
            name: 'description-divider',
            title: 'CustomDivider',
            component: () => import('@/views/ComponentsDescription/Des_Divider.vue'),
            meta: {
              keepAlive: false,
              systemType: ['development', 'test']
            }
          },
          {
            name: 'description-drawer',
            title: 'CustomDrawer',
            component: () => import('@/views/ComponentsDescription/Des_Drawer.vue'),
            meta: {
              keepAlive: false,
              systemType: ['development', 'test']
            }
          },
          {
            name: 'description-empty',
            title: 'CustomEmpty',
            component: () => import('@/views/ComponentsDescription/Des_Empty.vue'),
            meta: {
              keepAlive: false,
              systemType: ['development', 'test']
            }
          },
          {
            name: 'description-image',
            title: 'CustomImage',
            component: () => import('@/views/ComponentsDescription/Des_Image.vue'),
            meta: {
              keepAlive: false,
              systemType: ['development', 'test']
            }
          },
          {
            name: 'description-popover',
            title: 'CustomPopover',
            component: () => import('@/views/ComponentsDescription/Des_Popover.vue'),
            meta: {
              keepAlive: false,
              systemType: ['development', 'test']
            }
          },
          {
            name: 'description-tooltip',
            title: 'CustomTooltip',
            component: () => import('@/views/ComponentsDescription/Des_Tooltip.vue'),
            meta: {
              keepAlive: false,
              systemType: ['development', 'test']
            }
          },
          {
            name: 'description-collapse',
            title: 'CustomCollapse',
            component: () => import('@/views/ComponentsDescription/Des_Collapse.vue'),
            meta: {
              keepAlive: false,
              systemType: ['development', 'test']
            }
          },
          {
            name: 'description-switch',
            title: 'CustomSwitch',
            component: () => import('@/views/ComponentsDescription/Des_Switch.vue'),
            meta: {
              keepAlive: false,
              systemType: ['development', 'test']
            }
          }
        ]
      }
    ]
  }
]

export default descriptionRoutes
