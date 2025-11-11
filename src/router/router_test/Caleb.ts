import type { RouterTree } from '@/types/types_routes'
import { totalPermission } from '@/lib/lib_permission' // 權限

export const CalebTestRoutes: RouterTree[] = [
  // {
  //   name: 'test-views',
  //   title: 'Test views',
  //   component: () => import('@/views/TestPage/Test.vue'),
  //   meta: {
  //     isKeepAlive: false,
  //     isEnabled: true,
  //     permission: totalPermission
  //   }
  // },
  {
    name: 'test-Caleb',
    title: 'Caleb',
    meta: {
      isEnabled: true,
      permission: totalPermission
    },
    leaves: [
      {
        name: 'caleb-tset',
        title: 'Caleb 測試',
        component: () => import('@/views/TestPage/Caleb/TestPage/TestPage.vue'),
        meta: {
          isKeepAlive: false,
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'caleb-vue-flow-tset',
        title: 'VueFlow 測試',
        component: () => import('@/views/TestPage/Caleb/VueFlowTest/VueFlowTest.vue'),
        meta: {
          isKeepAlive: false,
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'caleb-home-v2',
        title: '首頁 v2',
        component: () => import('@/views/TestPage/Caleb/HomeView/HomeView.vue'),
        meta: {
          isKeepAlive: false,
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'caleb-input-test',
        title: 'Input 測試',
        component: () => import('@/views/TestPage/Caleb/InputTest/InputTest.vue'),
        meta: {
          isKeepAlive: false,
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'caleb-LogicMatcherInput',
        title: 'LogicRestriction+Matcher 輸入',
        component: () => import('@/views/TestPage/Caleb/LogicMatcherInput/LogicMatcherInput.vue'),
        meta: {
          isKeepAlive: false,
          isEnabled: true,
          permission: totalPermission
        }
      },
      {
        name: 'caleb-components-markdown',
        title: '組件說明(Markdown)',
        meta: {
          isKeepAlive: false,
          isEnabled: true,
          permission: totalPermission
        },
        component: () => import('@/views/TestPage/Caleb/MD_Components/MD_Components.vue')
      },
      {
        name: 'caleb-components-des',
        title: '組件說明(範例)',
        component: () => import('@/views/TestPage/Caleb/Des_Components/Des_Components.vue'),
        meta: {
          isKeepAlive: false,
          isEnabled: true,
          permission: totalPermission
        }
      }
    ]
  }
]
