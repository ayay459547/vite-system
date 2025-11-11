
import type { RouteRecordRaw } from 'vue-router'

import HomeView from '@/views/Common/HomeView/HomeView.vue'
import LoginView from '@/views/Common/LoginView/LoginView.vue'
import Page_404 from '@/views/Common/Page_404.vue'

export const commonRoutes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: { name: 'locatehome' }
  },
  {
    path: '/',
    redirect: { name: 'locatehome' }
  },
  {
    name: 'locatehome',
    meta: { title: '首頁' },
    path: '/locatehome',
    component: HomeView
  },
  {
    name: 'login',
    meta: { title: '登入' },
    path: '/login',
    component: LoginView
  },
  {
    name: 'page404',
    meta: { title: '頁面不存在' },
    path: '/page404',
    component: Page_404
  },
  {
    path: '/:pathMatch(.*)',
    component: Page_404
    // redirect: { name: 'page404' }
    // beforeEnter: (to, from) => {
    //   console.log('beforeEnter => ', { to, from })
    // }
  }
]
