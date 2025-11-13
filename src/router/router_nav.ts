import type { RouterTree } from '@/types/types_routes'
import { defaultPermission, totalPermission } from '@/lib/lib_permission' // 權限

export const navMap: Record<string, RouterTree> = {
  'nav': {
    name: 'nav',
    title: '功能',
    meta: {
      icon: {
        xType: 'material',
        name: 'SecurityFilled'
      },
      permission: defaultPermission
    }
  },
  'chart': {
    name: 'chart',
    title: '圖表',
    meta: {
      icon: {
        xType: 'ionicons5',
        name: 'BarChart'
      },
      permission: defaultPermission
    }
  },
  'components': {
    name: 'components',
    title: '組件',
    meta: {
      icon: {
        xType: 'fluent',
        name: 'DocumentTableCube20Filled'
      },
      permission: defaultPermission
    }
  },
  'nav1-1-1': {
    name: 'nav1-1-1',
    title: '功能1',
    component: () => import('@/views/Nav1-1-1/Nav1-1-1.vue'),
    meta: {
      isKeepAlive: false,
      isEnabled: true,
      permission: totalPermission
    }
  },
  'nav1-1-2': {
    name: 'nav1-1-2',
    title: '功能2',
    component: () => import('@/views/Nav1-1-2/Nav1-1-2.vue'),
    meta: {
      isKeepAlive: false,
      isEnabled: true,
      permission: totalPermission
    }
  },
  'nav1-1-4': {
    name: 'nav1-1-4',
    title: '功能4',
    component: () => import('@/views/Nav1-1-4/Nav1-1-4.vue'),
    meta: {
      isKeepAlive: false,
      isEnabled: true,
      permission: totalPermission
    }
  }
}
