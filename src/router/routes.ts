import type { RouterTree } from '@/declare/routes'
import { totlaPermission } from '@/lib/lib_permission'

import { getInjectRoutes } from './setting'
// 功能開發中
export function InProgress() {
  return import('@/views/Common/InProgress.vue')
}
// 功能維護中
export function FixView() {
  return import('@/views/Common/FixView.vue')
}

// 組件說明
import descriptionRoutes from './description'
// 開發用頁面
import developmentRoutes from './development'
// 測試用頁面
import testRoutes from './test'

const routes: Array<RouterTree> = [
  {
    name: 'test-system-feature',
    title: '功能測試',
    systemType: ['new'],
    icon: 'table',
    permission: totlaPermission,
    leaves: [
      {
        name: 'test-feat',
        title: '測試新功能',
        systemType: ['new'],
        icon: 'f',
        permission: totlaPermission,
        leaves: [
          {
            name: 'feat-gantt',
            title: '甘特圖(新)',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-11',
              completedDate: '2023-11'
            },
            systemType: ['new'],
            path: '/feat-gantt',
            icon: 'gantt',
            component: () => import('@/views/Feat-gantt/Feat-gantt.vue')
          },
          {
            name: 'feat-gantt-old',
            title: '甘特圖(舊)',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-11',
              completedDate: '2023-11'
            },
            systemType: ['new'],
            path: '/feat-gantt-old',
            icon: 'gantt',
            component: () => import('@/views/Feat-gantt-old/Feat-gantt-old.vue')
          },
          {
            name: 'feat-gantt-flight',
            title: '飛機航班甘特圖',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-11',
              completedDate: '2023-11'
            },
            systemType: ['new'],
            path: '/feat-gantt-flight',
            icon: 'gantt',
            component: () => import('@/views/Feat-gantt-flight/Feat-gantt-flight.vue')
          }
        ]
      },
      {
        name: 'test-fund',
        title: 'test-fund',
        systemType: ['new'],
        icon: 'f',
        permission: totlaPermission,
        leaves: [
          {
            name: 'test-new',
            title: '測試表格',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-11',
              completedDate: '2023-11'
            },
            systemType: ['new'],
            path: '/test-new',
            icon: 'file-circle-check',
            component: () => import('@/views/Test-new/Test-new.vue')
          },
          {
            name: 'test-fund-1417',
            title: '測試Fund-1417',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-11',
              completedDate: '2023-11'
            },
            systemType: ['new'],
            path: '/test-fund-1417',
            icon: 'file-circle-check',
            component: () => import('@/views/Test-fund-1417/Test-fund-1417.vue')
          },
          {
            name: 'test-fund-1417-v2',
            title: '測試Fund-1417-v2',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-11',
              completedDate: '2023-11'
            },
            systemType: ['new'],
            path: '/test-fund-1417-v2',
            icon: 'file-circle-check',
            component: () => import('@/views/Test-fund-1417-v2/Test-fund-1417-v2.vue')
          },
          {
            name: 'test-fund-122',
            title: '測試Fund-122',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-11',
              completedDate: '2023-11'
            },
            systemType: ['new'],
            path: '/test-fund-122',
            icon: 'file-circle-check',
            component: () => import('@/views/Test-fund-122/Test-fund-122.vue')
          }
        ]
      },
      {
        name: 'test-auto',
        title: 'test-auto',
        systemType: ['new'],
        icon: 'a',
        permission: totlaPermission,
        leaves: [
          {
            name: 'test-auto-114',
            title: '測試Auto-114',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-11',
              completedDate: '2023-11'
            },
            systemType: ['new'],
            path: '/test-auto-114',
            icon: 'file-circle-check',
            component: () => import('@/views/Test-auto-114/Test-auto-114.vue')
          }
        ]
      }
    ]
  },
  {
    name: 'nav1',
    title: '選單1',
    systemType: ['new'],
    icon: 'cloud',
    permission: totlaPermission,
    leaves: [
      {
        name: 'nav1-1',
        title: '選單1-1',
        systemType: ['new'],
        icon: 'table',
        permission: totlaPermission,
        leaves: [
          {
            name: 'nav1-1-1',
            title: '表格-可展開',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-1-1',
            icon: 'info',
            component: () => import('@/views/Nav1-1-1/Nav1-1-1.vue')
          },
          {
            name: 'nav1-1-2',
            title: '表格-詳細資料',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-1-2',
            icon: 'info',
            component: () => import('@/views/Nav1-1-2/Nav1-1-2.vue')
          },
          {
            name: 'nav1-1-3',
            title: '功能維護中',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-1-3',
            icon: 'info',
            component: FixView
          },
          {
            name: 'nav1-1-4',
            title: '日期表',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-1-4',
            icon: 'info',
            component: () => import('@/views/Nav1-1-4/Nav1-1-4.vue')
          },
          {
            name: 'nav1-1-5',
            title: '卡片+拖拉+彈窗',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-1-5',
            icon: 'info',
            component: () => import('@/views/Nav1-1-5/Nav1-1-5.vue')
          }
        ]
      },
      {
        name: 'nav1-2',
        title: '選單1-2',
        systemType: ['new'],
        icon: 'lemon',
        permission: totlaPermission,
        leaves: [
          {
            name: 'nav1-2-1',
            title: '功能開發中',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-2-1',
            icon: 'info',
            component: InProgress
          },
          {
            name: 'nav1-2-2',
            title: '時間線測試+QRcode',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-2-2',
            icon: 'timeline',
            component: () => import('@/views/Nav1-2-2/Nav1-2-2.vue')
          },
          {
            name: 'nav1-2-3',
            title: '多列表單編輯',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-2-3',
            icon: 'file-pen',
            component: () => import('@/views/Nav1-2-3/Nav1-2-3.vue')
          },
          {
            name: 'nav1-2-4',
            title: '眼睛跟滑鼠',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-2-4',
            icon: 'face-laugh-beam',
            component: () => import('@/views/Nav1-2-4/Nav1-2-4.vue')
          }
        ]
      },
      {
        name: 'nav1-3',
        title: '測試檔案上傳',
        meta: {
          keepAlive: false,
          status: 'completed',
          startDate: '2023-08',
          completedDate: '2023-08'
        },
        systemType: ['new'],
        path: '/nav1-3',
        component: () => import('@/views/Nav1-3/Nav1-3.vue'),
        icon: 'file-arrow-up',
        permission: totlaPermission
      },
      {
        name: 'nav1-4',
        title: '選單1-4',
        systemType: ['new'],
        icon: 'mug-hot',
        permission: totlaPermission,
        leaves: [
          {
            name: 'nav1-4-1',
            title: '甘特圖測試',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-4-1',
            component: () => import('@/views/Nav1-4-1/Nav1-4-1.vue'),
            icon: 'chart-gantt',
            permission: totlaPermission
          },
          {
            name: 'nav1-4-2',
            title: '輸入框換架構',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-09',
              completedDate: '2023-09'
            },
            systemType: ['new'],
            path: '/nav1-4-2',
            component: () => import('@/views/Nav1-4-2/Nav1-4-2.vue'),
            icon: 'keyboard'
          },
          {
            name: 'nav1-4-3',
            title: '柱狀圖測試',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-4-3',
            component: () => import('@/views/Nav1-4-3/Nav1-4-3.vue'),
            icon: 'chart-column'
          },
          {
            name: 'nav1-4-4',
            title: '虛擬表格測試',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav1-4-4',
            component: () => import('@/views/Nav1-4-4/Nav1-4-4.vue'),
            icon: 'table-list'
          }
        ]
      }
    ]
  },
  {
    name: 'nav2',
    title: '選單2',
    meta: {
      keepAlive: false,
      status: 'completed',
      startDate: '2023-08',
      completedDate: '2023-08'
    },
    systemType: ['new'],
    icon: 'shield-halved',
    permission: totlaPermission,
    path: '/nav2',
    component: () => import('@/views/Nav2/Nav2-1.vue')
  },
  {
    name: 'nav3',
    title: '選單3',
    systemType: ['new'],
    icon: 'cloud',
    permission: totlaPermission,
    leaves: [
      {
        name: 'nav3-1',
        title: '選單3-1',
        systemType: ['new'],
        icon: 'table-list',
        leaves: [
          {
            name: 'nav3-1-1',
            title: '手寫虛擬列表',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav3-1-1',
            icon: 'table',
            component: () => import('@/views/Nav3-1-1/Nav3-1-1.vue')
          },
          {
            name: 'nav3-1-3',
            title: '一般列表懶加載',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav3-1-3',
            icon: 'table-list',
            component: () => import('@/views/Nav3-1-3/Nav3-1-3.vue')
          }
        ]
      },
      {
        name: 'nav3-2',
        title: '選單3-2',
        systemType: ['new'],
        icon: 'e',
        leaves: [
          {
            name: 'nav3-2-1',
            title: '虛擬列表資訊來源',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav3-2-1',
            icon: 'link',
            component: () => import('@/views/Nav3-2-1/Nav3-2-1.vue')
          },
          {
            name: 'nav3-2-3',
            title: '拖拉測試+其他',
            meta: {
              keepAlive: false,
              status: 'completed',
              startDate: '2023-08',
              completedDate: '2023-08'
            },
            systemType: ['new'],
            path: '/nav3-2-3',
            component: () => import('@/views/Nav3-2-3/Nav3-2-3.vue'),
            icon: 'table-columns'
          }
        ]
      },
      {
        name: 'nav3-3',
        title: '選單3-3',
        systemType: ['new'],
        icon: 'dice-d20',
        leaves: [
          {
            name: 'nav3-3-1',
            title: '收放展開組件測試',
            systemType: ['new'],
            path: '/nav3-3-1',
            component: () => import('@/views/Nav3-3-1/Nav3-3-1.vue'),
            icon: 'angles-up'
          },
          {
            name: 'nav3-3-3',
            title: '樹結構組件測試',
            systemType: ['new'],
            path: '/nav3-3-3',
            component: () => import('@/views/Nav3-3-3/Nav3-3-3.vue'),
            icon: 'folder-tree'
          },
          {
            name: 'nav3-3-4',
            title: '多欄位自訂排序合併',
            systemType: ['new'],
            path: '/nav3-3-4',
            component: () => import('@/views/Nav3-3-4/Nav3-3-4.vue'),
            icon: 'folder-tree'
          }
        ]
      }
    ]
  },
  {
    name: 'nav4',
    title: '選單4',
    systemType: ['new'],
    icon: 'language',
    permission: totlaPermission,
    leaves: [
      {
        name: 'nav4-6',
        title: '分隔顯示+引導',
        meta: {
          keepAlive: false,
          status: 'completed',
          startDate: '2024-01',
          completedDate: '2024-01'
        },
        systemType: ['new'],
        icon: 'v',
        permission: totlaPermission,
        path: '/nav4-6',
        i18nModule: 'view',
        component: () => import('@/views/Nav4-6/Nav4-6.vue')
      },
      {
        name: 'nav4-5',
        title: '虛擬select',
        meta: {
          keepAlive: false,
          status: 'completed',
          startDate: '2024-01',
          completedDate: '2024-01'
        },
        systemType: ['new'],
        icon: 'v',
        permission: totlaPermission,
        path: '/nav4-5',
        i18nModule: 'view',
        component: () => import('@/views/Nav4-5/Nav4-5.vue')
      },
      {
        name: 'nav4-1',
        title: 'system翻譯',
        meta: {
          keepAlive: false,
          status: 'completed',
          startDate: '2024-01',
          completedDate: '2024-01'
        },
        systemType: ['new'],
        icon: 's',
        permission: totlaPermission,
        path: '/nav4-1',
        i18nModule: 'system',
        component: () => import('@/views/Nav4-1/Nav4-1.vue')
      },
      {
        name: 'nav4-2',
        title: 'test翻譯',
        meta: {
          keepAlive: false,
          status: 'completed',
          startDate: '2024-01',
          completedDate: '2024-01'
        },
        systemType: ['new'],
        icon: 't',
        permission: totlaPermission,
        path: '/nav4-2',
        i18nModule: 'test',
        component: () => import('@/views/Nav4-2/Nav4-2.vue')
      },
      {
        name: 'nav4-3',
        title: 'view翻譯',
        meta: {
          keepAlive: false,
          status: 'completed',
          startDate: '2024-01',
          completedDate: '2024-01'
        },
        systemType: ['new'],
        icon: 'v',
        permission: totlaPermission,
        path: '/nav4-3',
        i18nModule: 'view',
        component: () => import('@/views/Nav4-3/Nav4-3.vue')
      },
      {
        name: 'nav4-4',
        title: 'CustomWatermark+CustomLockedView+v-fixed',
        meta: {
          keepAlive: false,
          status: 'completed',
          startDate: '2024-01',
          completedDate: '2024-01'
        },
        systemType: ['new'],
        icon: 'water',
        permission: totlaPermission,
        path: '/nav4-4',
        i18nModule: 'view',
        component: () => import('@/views/Nav4-4/Nav4-4.vue')
      }
    ]
  }
]

export default getInjectRoutes([
  ...routes,
  ...descriptionRoutes,
  ...developmentRoutes,
  ...testRoutes
])
