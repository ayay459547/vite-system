import type { RouterTree } from '@/declare/routes'

const testRoutes: RouterTree[] = [
  {
    name: 'components-test',
    title: '組件測試',
    systemType: ['system', 'development'],
    icon: 'flask-vial',
    leaves: [
      {
        name: 'page1-test',
        title: '範例頁面-1',
        meta: {
          keepAlive: true
        },
        systemType: ['development', 'test', 'complete'],
        path: '/page1-test',
        component: () => import('@/views/ComponentsTest/Page1-test/Page1-test.vue')
      },
      {
        name: 'week-schedule-test',
        title: '一周時間分配組件測試',
        meta: {
          keepAlive: false
        },
        systemType: ['development', 'test', 'complete'],
        path: '/week-schedule-test',
        component: () => import('@/views/ComponentsTest/Week-schedule-test.vue')
      },
      {
        name: 'ajax-test',
        title: 'AJAX測試',
        meta: {
          keepAlive: true
        },
        systemType: ['development'],
        path: '/ajax-test',
        component: () => import('@/views/ComponentsTest/Ajax-test.vue')
      },
      {
        name: 'data-table-test',
        title: '純資料表單測試',
        systemType: ['development'],
        path: '/data-table-test',
        component: () => import('@/views/ComponentsTest/Data-table-test.vue')
      },
      {
        name: 'input-test',
        title: '輸入框測試',
        systemType: ['development'],
        path: '/input-test',
        component: () => import('@/views/ComponentsTest/Input-test.vue')
      },
      {
        name: 'alert-test',
        title: '彈窗測試',
        systemType: ['development'],
        path: '/alert-test',
        component: () => import('@/views/ComponentsTest/Alert-test.vue')
      },
      {
        name: 'i18n-test',
        title: 'i18n翻譯測試',
        systemType: ['development'],
        path: '/i18n-test',
        component: () => import('@/views/ComponentsTest/I18n-test.vue')
      },
      {
        name: 'table-test',
        title: '表單測試',
        systemType: ['development'],
        path: '/table-test',
        component: () => import('@/views/ComponentsTest/Table-test.vue')
      },
      {
        name: 'excel-test',
        title: 'Excel測試',
        systemType: ['development'],
        path: '/excel-test',
        component: () => import('@/views/ComponentsTest/Excel-test.vue')
      }
    ]
  },
  {
    name: 'educate-test',
    title: '教育訓練',
    systemType: ['system', 'development'],
    icon: 'feather',
    path: '/educate-test',
    component: () => import('@/views/Educate-test.vue')
  }
]

export default testRoutes