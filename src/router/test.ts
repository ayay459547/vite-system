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
          name: 'input-test',
          title: '輸入框測試',
          inject: true,
          complete: true,
          path: '/input-test',
          component: () => import('@/views/ComponentsTest/Test-input.vue')
      },
      {
        name: 'indexed-db',
        title: 'indexedDB測試',
        inject: true,
        complete: true,
        path: '/indexed-db',
        component: () => import('@/views/ComponentsTest/Indexed-db.vue')
      },
      {
        name: 'table-test',
        title: '表單測試',
        inject: true,
        complete: true,
        path: '/table-test',
        component: () => import('@/views/ComponentsTest/Table-test.vue')
      }
    ]
  }
]

export default testRoutes