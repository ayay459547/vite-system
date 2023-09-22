import type { RouterTree } from '@/declare/routes'

const testRoutes: RouterTree[] = [
  {
    name: 'components-description',
    title: '組件說明',
    systemType: ['development', 'test'],
    icon: 'book',
    leaves: [
      {
        name: 'description-button',
        title: 'CustomButton',
        meta: {
          keepAlive: true,
          status: 'completed'
        },
        systemType: ['development', 'test'],
        path: '/description-button',
        component: () => import('@/views/ComponentsDescription/DescriptionButton.vue'),
        icon: 'hand-pointer'
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
          keepAlive: false,
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
      }
    ]
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

export default testRoutes