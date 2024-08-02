import type { RouterTree } from '@/declare/routes.ts'
import { totlaPermission } from '@/lib/lib_permission.ts'

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
    meta: {
      systemType: ['new'],
      icon: 'table',
      permission: totlaPermission
    },
    leaves: [
      {
        name: 'test-feat',
        title: '測試TSX',
        meta: {
          systemType: ['new'],
          permission: totlaPermission
        },
        component: () => import('@/views/TSX/TSX.vue')
      },
      {
        name: 'test-feat',
        title: '測試新功能',
        meta: {
          systemType: ['new'],
          permission: totlaPermission
        },
        leaves: [
          {
            name: 'feat-gantt',
            title: '甘特圖(新)',
            component: () => import('@/views/Feat-gantt/Feat-gantt.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'gantt'
            }
          },
          {
            name: 'feat-gantt-old',
            title: '甘特圖(舊)',
            component: () => import('@/views/Feat-gantt-old/Feat-gantt-old.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'gantt'
            }
          },
          {
            name: 'feat-gantt-flight',
            title: '飛機航班甘特圖',
            component: () => import('@/views/Feat-gantt-flight/Feat-gantt-flight.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'gantt'
            }
          }
        ]
      },
      {
        name: 'test-fund',
        title: 'test-fund',
        meta: {
          keepAlive: false,
          systemType: ['new'],
          permission: totlaPermission
        },
        leaves: [
          {
            name: 'test-new',
            title: '測試表格',
            component: () => import('@/views/Test-new/Test-new.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'file-circle-check'
            }
          },
          {
            name: 'test-fund-1417',
            title: '測試Fund-1417',
            component: () => import('@/views/Test-fund-1417/Test-fund-1417.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'file-circle-check'
            }
          },
          {
            name: 'test-fund-1417-v2',
            title: '測試Fund-1417-v2',
            component: () => import('@/views/Test-fund-1417-v2/Test-fund-1417-v2.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'file-circle-check'
            }
          },
          {
            name: 'test-fund-122',
            title: '測試Fund-122',
            component: () => import('@/views/Test-fund-122/Test-fund-122.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'file-circle-check'
            }
          }
        ]
      },
      {
        name: 'test-auto',
        title: 'test-auto',
        meta: {
          systemType: ['new'],
          permission: totlaPermission
        },
        leaves: [
          {
            name: 'test-auto-114',
            title: '測試Auto-114',
            component: () => import('@/views/Test-auto-114/Test-auto-114.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'file-circle-check'
            }
          }
        ]
      }
    ]
  },
  {
    name: 'nav1',
    title: '選單1',
    meta: {
      systemType: ['new'],
      icon: 'cloud',
      permission: totlaPermission
    },
    leaves: [
      {
        name: 'nav1-1',
        title: '選單1-1',
        meta: {
          systemType: ['new'],
          permission: totlaPermission
        },
        leaves: [
          {
            name: 'nav1-1-1',
            title: '表格-可展開',
            component: () => import('@/views/Nav1-1-1/Nav1-1-1.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'info'
            }
          },
          {
            name: 'nav1-1-2',
            title: '表格-詳細資料',
            component: () => import('@/views/Nav1-1-2/Nav1-1-2.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'info'
            }
          },
          {
            name: 'nav1-1-3',
            title: '功能維護中',
            component: FixView,
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'info'
            }
          },
          {
            name: 'nav1-1-4',
            title: '日期表',
            component: () => import('@/views/Nav1-1-4/Nav1-1-4.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'info'
            }
          },
          {
            name: 'nav1-1-5',
            title: '卡片+拖拉+彈窗',
            component: () => import('@/views/Nav1-1-5/Nav1-1-5.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'info'
            }
          }
        ]
      },
      {
        name: 'nav1-2',
        title: '選單1-2',
        meta: {
          systemType: ['new'],
          permission: totlaPermission
        },
        leaves: [
          {
            name: 'nav1-2-1',
            title: '功能開發中',
            component: InProgress,
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'info'
            }
          },
          {
            name: 'nav1-2-2',
            title: '時間線測試+QRcode',
            component: () => import('@/views/Nav1-2-2/Nav1-2-2.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'timeline'
            }
          },
          {
            name: 'nav1-2-3',
            title: '多列表單編輯',
            component: () => import('@/views/Nav1-2-3/Nav1-2-3.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'file-pen'
            }
          },
          {
            name: 'nav1-2-4',
            title: '眼睛跟滑鼠',
            component: () => import('@/views/Nav1-2-4/Nav1-2-4.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'face-laugh-beam'
            }
          }
        ]
      },
      {
        name: 'nav1-3',
        title: '測試檔案上傳',
        component: () => import('@/views/Nav1-3/Nav1-3.vue'),
        meta: {
          keepAlive: false,
          systemType: ['new'],
          permission: totlaPermission
        }
      },
      {
        name: 'nav1-4',
        title: '選單1-4',
        meta: {
          systemType: ['new'],
          permission: totlaPermission
        },
        leaves: [
          {
            name: 'nav1-4-1',
            title: '甘特圖測試',
            component: () => import('@/views/Nav1-4-1/Nav1-4-1.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              permission: totlaPermission
            }
          },
          {
            name: 'nav1-4-2',
            title: '輸入框換架構',
            component: () => import('@/views/Nav1-4-2/Nav1-4-2.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new']
            }
          },
          {
            name: 'nav1-4-3',
            title: '柱狀圖測試',
            component: () => import('@/views/Nav1-4-3/Nav1-4-3.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new']
            }
          },
          {
            name: 'nav1-4-4',
            title: '虛擬表格測試',
            component: () => import('@/views/Nav1-4-4/Nav1-4-4.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new']
            }
          }
        ]
      }
    ]
  },
  {
    name: 'nav2',
    title: '選單2',
    component: () => import('@/views/Nav2/Nav2-1.vue'),
    meta: {
      keepAlive: false,
      systemType: ['new'],
      icon: 'shield-halved',
      permission: totlaPermission
    }
  },
  {
    name: 'nav3',
    title: '選單3',
    meta: {
      systemType: ['new'],
      icon: 'cloud',
      permission: totlaPermission
    },
    leaves: [
      {
        name: 'nav3-1',
        title: '選單3-1',
        meta: {
          systemType: ['new'],
          icon: 'table-list'
        },
        leaves: [
          {
            name: 'nav3-1-1',
            title: '手寫虛擬列表',
            component: () => import('@/views/Nav3-1-1/Nav3-1-1.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'table'
            }
          },
          {
            name: 'nav3-1-3',
            title: '一般列表懶加載',
            component: () => import('@/views/Nav3-1-3/Nav3-1-3.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'table-list'
            }
          }
        ]
      },
      {
        name: 'nav3-2',
        title: '選單3-2',
        meta: {
          systemType: ['new'],
          icon: 'e'
        },
        leaves: [
          {
            name: 'nav3-2-1',
            title: '虛擬列表資訊來源',
            component: () => import('@/views/Nav3-2-1/Nav3-2-1.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'link'
            }
          },
          {
            name: 'nav3-2-3',
            title: '拖拉測試+其他',
            component: () => import('@/views/Nav3-2-3/Nav3-2-3.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'table-columns'
            }
          }
        ]
      },
      {
        name: 'nav3-3',
        title: '選單3-3',
        meta: {
          systemType: ['new'],
          icon: 'dice-d20'
        },
        leaves: [
          {
            name: 'nav3-3-1',
            title: '收放展開組件測試',
            component: () => import('@/views/Nav3-3-1/Nav3-3-1.vue'),
            meta: {
              systemType: ['new'],
              icon: 'angles-up'
            }
          },
          {
            name: 'nav3-3-3',
            title: '樹結構組件測試',
            component: () => import('@/views/Nav3-3-3/Nav3-3-3.vue'),
            meta: {
              systemType: ['new'],
              icon: 'folder-tree'
            }
          },
          {
            name: 'nav3-3-4',
            title: '多欄位自訂排序合併',
            component: () => import('@/views/Nav3-3-4/Nav3-3-4.vue'),
            meta: {
              systemType: ['new'],
              icon: 'folder-tree'
            }
          }
        ]
      }
    ]
  },
  {
    name: 'nav4',
    title: '選單4',
    meta: {
      systemType: ['new'],
      icon: 'language',
      permission: totlaPermission
    },
    leaves: [
      {
        name: 'nav4-6',
        title: '分隔顯示+引導',
        component: () => import('@/views/Nav4-6/Nav4-6.vue'),
        meta: {
          keepAlive: false,
          systemType: ['new'],
          icon: 'v',
          permission: totlaPermission
        }
      },
      {
        name: 'nav4-5',
        title: '虛擬select',
        component: () => import('@/views/Nav4-5/Nav4-5.vue'),
        meta: {
          keepAlive: false,
          systemType: ['new'],
          icon: 'v',
          permission: totlaPermission
        }
      },
      {
        name: 'nav4-1',
        title: 'system翻譯',
        component: () => import('@/views/Nav4-1/Nav4-1.vue'),
        meta: {
          keepAlive: false,
          systemType: ['new'],
          icon: 's',
          permission: totlaPermission
        }
      },
      {
        name: 'nav4-2',
        title: 'test翻譯',
        component: () => import('@/views/Nav4-2/Nav4-2.vue'),
        meta: {
          keepAlive: false,
          systemType: ['new'],
          icon: 't',
          permission: totlaPermission
        }
      },
      {
        name: 'nav4-3',
        title: 'view翻譯',
        component: () => import('@/views/Nav4-3/Nav4-3.vue'),
        meta: {
          keepAlive: false,
          systemType: ['new'],
          icon: 'v',
          permission: totlaPermission
        }
      },
      {
        name: 'nav4-4',
        title: 'CustomWatermark+CustomLockedView+v-fixed',
        component: () => import('@/views/Nav4-4/Nav4-4.vue'),
        meta: {
          keepAlive: false,
          systemType: ['new'],
          icon: 'water',
          permission: totlaPermission
        }
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
