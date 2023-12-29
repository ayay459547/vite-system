import type { RouterTree } from '@/declare/routes'

const testRoutes: RouterTree[] = [
  {
    name: 'test-page',
    title: '測試',
    systemType: ['development', 'test'],
    icon: 'vial',
    leaves: [
      {
        name: 'test-caleb',
        title: 'Caleb',
        systemType: ['new'],
        icon: 'paw',
        leaves: [
          {
            name: 'test-Caleb-excel',
            title: 'Excel',
            meta: {
              keepAlive: false,
              status: 'completed'
            },
            systemType: ['development', 'test'],
            path: '/test-Caleb-chart1',
            icon: 'file-excel',
            component: () => import('@/views/TestPage/Caleb/ExcelTest/ExcelTest.vue')
          },
          {
            name: 'test-Caleb-chart1',
            title: '測試1',
            meta: {
              keepAlive: false,
              status: 'completed'
            },
            systemType: ['development', 'test'],
            path: '/test-Caleb-chart1',
            icon: 'chart-pie',
            component: () => import('@/views/TestPage/Caleb/TestChart1.vue')
          },
          {
            name: 'test-Caleb-chart2',
            title: '測試2',
            meta: {
              keepAlive: false,
              status: 'completed'
            },
            systemType: ['development', 'test'],
            path: '/test-Caleb-chart2',
            icon: 'satellite-dish',
            component: () => import('@/views/TestPage/Caleb/TestChart2.vue')
          },
          {
            name: 'test-Caleb-chart3',
            title: '測試3',
            meta: {
              keepAlive: false,
              status: 'completed'
            },
            systemType: ['development', 'test'],
            path: '/test-Caleb-chart3',
            icon: 'chart-column',
            component: () => import('@/views/TestPage/Caleb/TestChart3.vue')
          },
          {
            name: 'test-Caleb-chart4',
            title: '測試4',
            meta: {
              keepAlive: false,
              status: 'completed'
            },
            systemType: ['development', 'test'],
            path: '/test-Caleb-chart4',
            icon: 'chart-simple',
            component: () => import('@/views/TestPage/Caleb/TestChart4.vue')
          },
          {
            name: 'test-Caleb-chart5',
            title: '測試5',
            meta: {
              keepAlive: false,
              status: 'completed'
            },
            systemType: ['development', 'test'],
            path: '/test-Caleb-chart5',
            icon: 'chart-line',
            component: () => import('@/views/TestPage/Caleb/TestChart5.vue')
          },
          {
            name: 'test-Caleb-chart6',
            title: '測試6',
            meta: {
              keepAlive: false,
              status: 'completed'
            },
            systemType: ['development', 'test'],
            path: '/test-Caleb-chart6',
            icon: 'square-poll-vertical',
            component: () => import('@/views/TestPage/Caleb/TestChart6.vue')
          },
          {
            name: 'test-Caleb-chart7',
            title: '測試7',
            meta: {
              keepAlive: false,
              status: 'completed'
            },
            systemType: ['development', 'test'],
            path: '/test-Caleb-chart7',
            icon: 'tornado',
            component: () => import('@/views/TestPage/Caleb/TestChart7.vue')
          }
        ]
      },
      {
        name: 'diff-test',
        title: 'diff演算法測試',
        meta: {
          keepAlive: false,
          status: 'completed',
          startDate: '2023-11',
          completedDate: '2023-11'
        },
        systemType: ['new'],
        path: '/diff-test',
        icon: ['fab', 'react'],
        component: () => import('@/views/TestPage/DiffTest.vue')
      }
    ]
  },
  {
    name: 'charts-test',
    title: '圖表測試',
    systemType: ['development', 'test'],
    icon: 'chart-simple',
    leaves: [
      {
        name: 'chart-1',
        title: '南丁格爾玫瑰圖',
        meta: {
          keepAlive: false,
          status: 'completed'
        },
        systemType: ['development', 'test'],
        path: '/chart-1',
        icon: 'chart-pie',
        component: () => import('@/views/ChartsTest/Chart1.vue')
      },
      {
        name: 'chart-2',
        title: '柱狀圖',
        meta: {
          keepAlive: false,
          status: 'completed'
        },
        systemType: ['development', 'test'],
        path: '/chart-2',
        icon: 'chart-column',
        component: () => import('@/views/ChartsTest/Chart2.vue')
      }
    ]
  },
  {
    name: 'components-test',
    title: '組件測試',
    systemType: ['development', 'test'],
    icon: 'flask-vial',
    leaves: [
      {
        name: 'search-test',
        title: '搜尋組件測試',
        meta: {
          keepAlive: false,
          status: 'completed'
        },
        systemType: ['development', 'test'],
        path: '/search-test',
        component: () => import('@/views/ComponentsTest/Search-test.vue')
      },
      {
        name: 'test-page-1',
        title: '測試頁面-1',
        meta: {
          keepAlive: true,
          status: 'completed'
        },
        systemType: ['development', 'test'],
        path: '/page1-test',
        component: () => import('@/views/ComponentsTest/Page1-test/Page1-test.vue')
      },
      {
        name: 'form-list-test',
        title: '多行編輯測試',
        meta: {
          keepAlive: true,
          status: 'completed'
        },
        systemType: ['development', 'test'],
        path: '/form-list-test',
        component: () => import('@/views/ComponentsTest/Form-list-test/Form-list-test.vue')
      },
      {
        name: 'week-schedule-test',
        title: '一周時間分配組件測試',
        meta: {
          keepAlive: false,
          status: 'completed'
        },
        systemType: ['development', 'test'],
        path: '/week-schedule-test',
        component: () => import('@/views/ComponentsTest/Week-schedule-test.vue')
      },
      {
        name: 'ajax-test',
        title: 'AJAX測試',
        meta: {
          keepAlive: true,
          status: 'completed'
        },
        systemType: ['development', 'test'],
        path: '/ajax-test',
        component: () => import('@/views/ComponentsTest/Ajax-test.vue')
      },
      {
        name: 'data-table-test',
        title: '純資料表單測試',
        systemType: ['development', 'test'],
        path: '/data-table-test',
        component: () => import('@/views/ComponentsTest/Data-table-test.vue')
      },
      {
        name: 'input-test',
        title: '輸入框測試',
        systemType: ['development', 'test'],
        path: '/input-test',
        component: () => import('@/views/ComponentsTest/Input-test.vue')
      },
      {
        name: 'alert-test',
        title: '彈窗測試',
        systemType: ['development', 'test'],
        path: '/alert-test',
        component: () => import('@/views/ComponentsTest/Alert-test.vue')
      },
      {
        name: 'i18n-test',
        title: 'i18n翻譯測試',
        systemType: ['development', 'test'],
        path: '/i18n-test',
        component: () => import('@/views/ComponentsTest/I18n-test.vue')
      },
      {
        name: 'table-test',
        title: '表單測試',
        systemType: ['development', 'test'],
        path: '/table-test',
        component: () => import('@/views/ComponentsTest/Table-test.vue')
      },
      {
        name: 'excel-test',
        title: 'Excel測試',
        systemType: ['development', 'test'],
        path: '/excel-test',
        component: () => import('@/views/ComponentsTest/Excel-test.vue')
      },
      {
        name: 'educate-test',
        title: '教育訓練',
        systemType: ['development', 'test'],
        icon: 'feather',
        path: '/educate-test',
        component: () => import('@/views/Educate-test.vue')
      }
    ]
  }
]

export default testRoutes
