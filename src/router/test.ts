import type { RouterTree } from '@/declare/routes'

const testRoutes: RouterTree[] = [
  {
    name: 'components-test',
    title: '組件測試',
    systemType: ['system', 'new', 'development'],
    icon: 'flask-vial',
    leaves: [
      {
        name: 'page1-test',
        title: '範例頁面-1',
        meta: {
          keepAlive: true
        },
        systemType: ['new', 'development', 'test'],
        path: '/page1-test',
        component: () => import('@/views/ComponentsTest/Page1-test/Page1-test.vue')
      },
      {
        name: 'ajax-test',
        title: 'AJAX測試',
        meta: {
          keepAlive: true
        },
        systemType: ['new', 'development'],
        path: '/ajax-test',
        component: () => import('@/views/ComponentsTest/Ajax-test.vue')
      },
      {
        name: 'data-table-test',
        title: '純資料表單測試',
        systemType: ['new', 'development'],
        path: '/data-table-test',
        component: () => import('@/views/ComponentsTest/Data-table-test.vue')
      },
      {
        name: 'input-test',
        title: '輸入框測試',
        systemType: ['new', 'development'],
        path: '/input-test',
        component: () => import('@/views/ComponentsTest/Input-test.vue')
      },
      {
        name: 'alert-test',
        title: '彈窗測試',
        systemType: ['new', 'development'],
        path: '/alert-test',
        component: () => import('@/views/ComponentsTest/Alert-test.vue')
      },
      {
        name: 'i18n-test',
        title: 'i18n翻譯測試',
        systemType: ['new', 'development'],
        path: '/i18n-test',
        component: () => import('@/views/ComponentsTest/I18n-test.vue')
      },
      {
        name: 'table-test',
        title: '表單測試',
        systemType: ['new', 'development'],
        path: '/table-test',
        component: () => import('@/views/ComponentsTest/Table-test.vue')
      },
      {
        name: 'excel-test',
        title: 'Excel測試',
        systemType: ['new', 'development'],
        path: '/excel-test',
        component: () => import('@/views/ComponentsTest/Excel-test.vue')
      }
    ]
  }
]

export default testRoutes