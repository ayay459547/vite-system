
import type { RouteRecordRaw } from 'vue-router'


import HomeView from '@/views/Common/HomeView/HomeView.vue'
import LoginView from '@/views/Common/LoginView/LoginView.vue'
import Page_404 from '@/views/Common/Page_404.vue'

// 網址前綴
const systemUrl = (import.meta as any).env.VITE_API_SYSTEM_URL

export const commonRoutes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: { name: 'locatehome' }
  },
  {
    path: `/${systemUrl}`,
    redirect: { name: 'locatehome' }
  },
  {
    path: `${systemUrl}`,
    redirect: { name: 'locatehome' }
  },
  {
    name: 'locatehome',
    meta: { title: '首頁' },
    path: `${systemUrl}/locatehome`,
    component: HomeView
  },
  {
    name: 'login',
    meta: { title: '登入' },
    path: `${systemUrl}/login`,
    component: LoginView
  },
  {
    name: 'page404',
    meta: { title: '頁面不存在' },
    path: `${systemUrl}/page404`,
    component: Page_404
  },
  {
    path: '/:pathMatch(.*)',
    redirect: { name: 'page404' }
    // beforeEnter: (to, from) => {
    //   console.log('beforeEnter => ', { to, from })
    // }
  }
]