import type { RouterTree } from '@/declare/routes'

const testRoutes: RouterTree[] = [
  {
    name: 'components-test',
    title: '組件測試',
    inject: true,
    complete: true,
    icon: 'flask-vial',
    leaves: [
      {
        name: 'page1-test',
        title: '範例頁面-1',
        meta: {
          keepAlive: true
        },
        inject: true,
        complete: true,
        path: '/page1-test',
        component: () => import('@/views/ComponentsTest/Page1-test/Page1-test.vue')
      },
      {
          name: 'input-test',
          title: '輸入框測試',
          inject: true,
          complete: true,
          path: '/input-test',
          component: () => import('@/views/ComponentsTest/Input-test.vue')
      },
      {
        name: 'alert-test',
        title: '彈窗測試',
        inject: true,
        complete: true,
        path: '/alert-test',
        component: () => import('@/views/ComponentsTest/Alert-test.vue')
      },
      {
        name: 'i18n-test',
        title: 'i18n翻譯測試',
        inject: true,
        complete: true,
        path: '/i18n-test',
        component: () => import('@/views/ComponentsTest/I18n-test.vue')
      },
      {
        name: 'table-test',
        title: '表單測試',
        inject: true,
        complete: true,
        path: '/table-test',
        component: () => import('@/views/ComponentsTest/Table-test.vue')
      },
      {
        name: 'excel-test',
        title: 'Excel測試',
        inject: true,
        complete: true,
        path: '/excel-test',
        component: () => import('@/views/ComponentsTest/Excel-test.vue')
      }
    ]
  }
]

export default testRoutes