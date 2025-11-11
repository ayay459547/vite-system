import type { RouterTree } from '@/types/types_routes'
import { totalPermission } from '@/lib/lib_permission' // 權限

const testRoutes: RouterTree[] = [
  {
    name: 'test-page',
    title: '測試',
    meta: {
      isEnabled: true,
      permission: totalPermission,
      icon: 'vial'
    },
    leaves: [
      {
        name: 'caleb-new-test-1',
        title: '新建測試1',
        component: () => import('@/views/TestPage/NewTest1/NewTest1.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission,
          icon: 'arrow-down-up-across-line'
        }
      },
      {
        name: 'test-caleb',
        title: 'Caleb',
        meta: {
          isEnabled: true,
          permission: totalPermission,
          icon: 'paw'
        },
        leaves: [
          {
            name: 'test-Caleb-excel',
            title: 'Excel',
            component: () => import('@/views/TestPage/Caleb/ExcelTest/ExcelTest.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission,
              icon: 'file-excel'
            }
          },
          {
            name: 'test-Caleb-chart1',
            title: '圖表測試1',
            component: () => import('@/views/TestPage/Caleb/TestChart1.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission,
              icon: 'chart-pie'
            }
          },
          {
            name: 'test-Caleb-chart2',
            title: '圖表測試2',
            component: () => import('@/views/TestPage/Caleb/TestChart2.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission,
              icon: 'satellite-dish'
            }
          },
          {
            name: 'test-Caleb-chart3',
            title: '圖表測試3',
            component: () => import('@/views/TestPage/Caleb/TestChart3.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission,
              icon: 'chart-column'
            }
          },
          {
            name: 'test-Caleb-chart4',
            title: '圖表測試4',
            component: () => import('@/views/TestPage/Caleb/TestChart4.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission,
              icon: 'chart-simple'
            }
          },
          {
            name: 'test-Caleb-chart5',
            title: '圖表測試5',
            component: () => import('@/views/TestPage/Caleb/TestChart5.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission,
              icon: 'chart-line'
            }
          },
          {
            name: 'test-Caleb-chart6',
            title: '圖表測試6',
            component: () => import('@/views/TestPage/Caleb/TestChart6.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission,
              icon: 'square-poll-vertical'
            }
          },
          {
            name: 'test-Caleb-chart7',
            title: '圖表測試7',
            component: () => import('@/views/TestPage/Caleb/TestChart7.vue'),
            meta: {
              isEnabled: true,
              permission: totalPermission,
              icon: 'tornado'
            }
          }
        ]
      },
      {
        name: 'diff-test',
        title: 'diff演算法測試',
        component: () => import('@/views/TestPage/DiffTest.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission,
          icon: ['fab', 'react']
        }
      }
    ]
  },
  {
    name: 'charts-test',
    title: '圖表測試',
    meta: {
      isEnabled: true,
      permission: totalPermission,
      icon: 'chart-simple'
    },
    leaves: [
      {
        name: 'chart-ColorPicker',
        title: '顏色選擇圖',
        component: () => import('@/views/ChartsTest/ColorPicker/ColorPicker.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission,
          icon: 'chart-pie'
        }
      },
      {
        name: 'chart-flow',
        title: 'Flow 圖',
        component: () => import('@/views/ChartsTest/FlowView/FlowView.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission,
          icon: 'chart-pie'
        }
      },
      {
        name: 'chart-1',
        title: '南丁格爾玫瑰圖',
        component: () => import('@/views/ChartsTest/Chart1View.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission,
          icon: 'chart-pie'
        }
      },
      {
        name: 'chart-2',
        title: '柱狀圖',
        component: () => import('@/views/ChartsTest/Chart2View.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission,
          icon: 'chart-column'
        }
      }
    ]
  },
  {
    name: 'components-test',
    title: '組件測試',
    meta: {
      isEnabled: true,
      permission: totalPermission,
      icon: 'flask-vial'
    },
    leaves: [
      {
        name: 'search-test',
        title: '搜尋組件測試',
        component: () => import('@/views/ComponentsTest/Search-test.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'test-page-1',
        title: '測試頁面-1',
        component: () => import('@/views/ComponentsTest/Page1-test/Page1-test.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'form-list-test',
        title: '多行編輯測試',
        component: () => import('@/views/ComponentsTest/Form-list-test/Form-list-test.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'week-schedule-test',
        title: '一周時間分配組件測試',
        component: () => import('@/views/ComponentsTest/Week-schedule-test.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'ajax-test',
        title: 'AJAX測試',
        component: () => import('@/views/ComponentsTest/Ajax-test.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'data-table-test',
        title: '純資料表單測試',
        component: () => import('@/views/ComponentsTest/Data-table-test.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'input-test',
        title: '輸入框測試',
        component: () => import('@/views/ComponentsTest/Input-test.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'alert-test',
        title: '彈窗測試',
        component: () => import('@/views/ComponentsTest/Alert-test.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'i18n-test',
        title: 'i18n翻譯測試',
        component: () => import('@/views/ComponentsTest/I18n-test.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'table-test',
        title: '表單測試',
        component: () => import('@/views/ComponentsTest/Table-test.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'excel-test',
        title: 'Excel測試',
        component: () => import('@/views/ComponentsTest/Excel-test.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'educate-test',
        title: '教育訓練',
        component: () => import('@/views/Educate-test.vue'),
        meta: {
          isEnabled: true,
          permission: totalPermission,
          icon: 'feather'
        }
      }
    ]
  }
]

export default testRoutes
