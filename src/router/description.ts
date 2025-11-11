import type { RouterTree } from '@/types/types_routes'
import { totalPermission } from '@/lib/lib_permission' // 權限

const descriptionRoutes: RouterTree[] = [
  {
    name: 'components-description',
    title: '組件說明',
    meta: {
      isEnabled: true,
      permission: totalPermission,
      icon: 'book'
    },
    leaves: [
      {
        name: 'description-1',
        title: '輸入框組件',
        meta: {
          isEnabled: true,
          permission: totalPermission
        },
        leaves: []
      },
      {
        name: 'description-2',
        title: '表格組件',
        meta: {
          isEnabled: true,
          permission: totalPermission
        },
        leaves: [
          {
            name: 'description-table',
            title: 'CustomTable',
            component: () => import('@/views/ComponentsDescription/Des_Table.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission
            }
          }
        ]
      },
      {
        name: 'description-3',
        title: '常用組件',
        meta: {
          isEnabled: true,
          permission: totalPermission
        },
        leaves: [
          {
            name: 'description-button',
            title: 'CustomButton',
            component: () => import('@/views/ComponentsDescription/Des_Button.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission
            }
          },
          {
            name: 'description-icon',
            title: 'CustomIcon',
            component: () => import('@/views/ComponentsDescription/Des_Icon.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission
            }
          },
          {
            name: 'description-modal',
            title: 'CustomModal',
            component: () => import('@/views/ComponentsDescription/Des_Modal.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission
            }
          }
        ]
      },
      {
        name: 'description-4',
        title: '其他組件',
        meta: {
      isEnabled: true,
      permission: totalPermission
        },
        leaves: [
          {
            name: 'description-badge',
            title: 'CustomBadge',
            component: () => import('@/views/ComponentsDescription/Des_Badge.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission
            }
          },
          {
            name: 'description-divider',
            title: 'CustomDivider',
            component: () => import('@/views/ComponentsDescription/Des_Divider.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission
            }
          },
          {
            name: 'description-drawer',
            title: 'CustomDrawer',
            component: () => import('@/views/ComponentsDescription/Des_Drawer.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission
            }
          },
          {
            name: 'description-empty',
            title: 'CustomEmpty',
            component: () => import('@/views/ComponentsDescription/Des_Empty.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission
            }
          },
          {
            name: 'description-image',
            title: 'CustomImage',
            component: () => import('@/views/ComponentsDescription/Des_Image.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission
            }
          },
          {
            name: 'description-popover',
            title: 'CustomPopover',
            component: () => import('@/views/ComponentsDescription/Des_Popover.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission
            }
          },
          {
            name: 'description-tooltip',
            title: 'CustomTooltip',
            component: () => import('@/views/ComponentsDescription/Des_Tooltip.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission
            }
          },
          {
            name: 'description-collapse',
            title: 'CustomCollapse',
            component: () => import('@/views/ComponentsDescription/Des_Collapse.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission
            }
          },
          {
            name: 'description-switch',
            title: 'CustomSwitch',
            component: () => import('@/views/ComponentsDescription/Des_Switch.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission
            }
          }
        ]
      }
    ]
  }
]

export default descriptionRoutes
