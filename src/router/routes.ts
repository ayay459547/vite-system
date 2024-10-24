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
// Test 用頁面
import testRoutes from './test'

const routes: Array<RouterTree> = [
  {
    name: 'Test-system-feature',
    title: 'Feature Test',
    meta: {
      systemType: ['new'],
      icon: 'table',
      permission: totlaPermission
    },
    leaves: [
      {
        name: 'Test-feat',
        title: 'Test TSX',
        meta: {
          systemType: ['new'],
          permission: totlaPermission
        },
        component: () => import('@/views/TSX/TSX.vue')
      },
      {
        name: 'Test-feat',
        title: 'Test New Feature',
        meta: {
          systemType: ['new'],
          permission: totlaPermission
        },
        leaves: [
          {
            name: 'feat-gantt',
            title: 'Chart TEST',
            component: () => import('@/views/Feat-gantt/Feat-gantt.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'gantt'
            }
          },
          {
            name: 'feat-gantt-old',
            title: 'Gantt Old',
            component: () => import('@/views/Feat-gantt-old/Feat-gantt-old.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'gantt'
            }
          },
          {
            name: 'feat-gantt-flight',
            title: 'Flight Gantt',
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
        name: 'Test-fund',
        title: 'Test-fund',
        meta: {
          keepAlive: false,
          systemType: ['new'],
          permission: totlaPermission
        },
        leaves: [
          {
            name: 'Test-new',
            title: 'Test Table',
            component: () => import('@/views/Test-new/Test-new.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'file-circle-check'
            }
          },
          {
            name: 'Test-fund-122',
            title: 'Test Fund-122',
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
        name: 'Test-auto',
        title: 'Test-auto',
        meta: {
          systemType: ['new'],
          permission: totlaPermission
        },
        leaves: [
          {
            name: 'Test-auto-114',
            title: 'Test Auto-114',
            component: () => import('@/views/Test-auto-114/Test-auto-114.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'file-circle-check'
            }
          },
          {
            name: 'Test-auto-32',
            title: 'Test Auto-32',
            component: () => import('@/views/Test-auto-32/Test-auto-32.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'file-circle-check'
            }
          }
        ]
      },
      {
        name: 'Test-dmd',
        title: 'Test-dmd',
        meta: {
          systemType: ['new'],
          permission: totlaPermission
        },
        leaves: [
          {
            name: 'Test-dmd-42',
            title: 'Test Dmd-42',
            component: () => import('@/views/Test-dmd-42/Test-dmd-42.vue'),
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
    title: 'Nav 1',
    meta: {
      systemType: ['new'],
      icon: 'cloud',
      permission: totlaPermission
    },
    leaves: [
      {
        name: 'nav1-1',
        title: 'Nav 1-1',
        meta: {
          systemType: ['new'],
          permission: totlaPermission
        },
        leaves: [
          {
            name: 'nav1-1-1',
            title: 'Table-可展開',
            component: () => import('@/views/Nav1-1-1/Nav1-1-1.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'info'
            }
          },
          {
            name: 'nav1-1-2',
            title: 'Table-詳細資料',
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
        title: 'Nav 1-2',
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
            title: '時間線Test +QRcode',
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
        title: 'Test 檔案上傳',
        component: () => import('@/views/Nav1-3/Nav1-3.vue'),
        meta: {
          keepAlive: false,
          systemType: ['new'],
          permission: totlaPermission
        }
      },
      {
        name: 'nav1-4',
        title: 'Nav 1-4',
        meta: {
          systemType: ['new'],
          permission: totlaPermission
        },
        leaves: [
          {
            name: 'nav1-4-1',
            title: '甘特圖Test ',
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
            title: '柱狀圖Test ',
            component: () => import('@/views/Nav1-4-3/Nav1-4-3.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new']
            }
          },
          {
            name: 'nav1-4-4',
            title: '虛擬TableTest ',
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
    title: 'Nav 2',
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
    title: 'Nav 3',
    meta: {
      systemType: ['new'],
      icon: 'cloud',
      permission: totlaPermission
    },
    leaves: [
      {
        name: 'nav3-1',
        title: 'Nav 3-1',
        meta: {
          systemType: ['new'],
          icon: 'table-list'
        },
        leaves: [
          {
            name: 'nav3-1-1',
            title: 'Infinite Scroll',
            component: () => import('@/views/Nav3-1-1/Nav3-1-1.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'table'
            }
          },
          {
            name: 'nav3-1-2',
            title: 'VirtralTable-ElementUI',
            component: () => import('@/views/Nav3-1-2/Nav3-1-2.vue'),
            meta: {
              keepAlive: false,
              systemType: ['new'],
              icon: 'table-list'
            }
          },
          {
            name: 'nav3-1-4',
            title: 'VirtralTable-VxeTable',
            component: () => import('@/views/Nav3-1-4/Nav3-1-4.vue'),
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
        title: 'Nav 3-2',
        meta: {
          systemType: ['new'],
          icon: 'e'
        },
        leaves: [
          {
            name: 'nav3-2-3',
            title: '拖拉Test +其他',
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
        title: 'Nav 3-3',
        meta: {
          systemType: ['new'],
          icon: 'dice-d20'
        },
        leaves: [
          {
            name: 'nav3-3-1',
            title: '收放展開組件Test ',
            component: () => import('@/views/Nav3-3-1/Nav3-3-1.vue'),
            meta: {
              systemType: ['new'],
              icon: 'angles-up'
            }
          },
          {
            name: 'nav3-3-3',
            title: '樹結構組件Test ',
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
    title: 'Nav 4',
    meta: {
      systemType: ['new'],
      icon: 'language',
      permission: totlaPermission
    },
    leaves: [
      {
        name: 'nav4-7',
        title: 'Anchor錨點',
        component: () => import('@/views/Nav4-7/Nav4-7.vue'),
        meta: {
          keepAlive: false,
          systemType: ['new'],
          icon: 'v',
          permission: totlaPermission
        }
      },
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
