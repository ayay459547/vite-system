
import type { RouteRecordRaw } from 'vue-router'

import HomeView from '@/views/Common/HomeView/HomeView.vue'
import LoginView from '@/views/Common/LoginView/LoginView.vue'
import CheckStatus from '@/views/Common/CheckStatus.vue'
import NoPermissions from '@/views/Common/NoPermissions.vue'
import InProgress from '@/views/Common/InProgress.vue'
import Page_404 from '@/views/Common/Page_404.vue'
import FixView from '@/views/Common/FixView.vue'

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
    name: 'checkStatus',
    meta: { title: '確認登入狀態中' },
    path: `${systemUrl}/checkStatus`,
    component: CheckStatus
  },
  {
    name: 'noPermissions',
    meta: { title: '無此權限' },
    path: `${systemUrl}/noPermissions`,
    component: NoPermissions
  },
  {
    name: 'inProgress',
    meta: { title: '功能開發中' },
    path: `${systemUrl}/inProgress`,
    component: InProgress
  },
  {
    name: 'fix',
    meta: { title: '功能維護中' },
    path: `${systemUrl}/fix`,
    component: FixView
  },
  {
    name: 'page404',
    meta: { title: '404' },
    path: `${systemUrl}/page404`,
    component: Page_404
  },
  {
    path: '/:pathMatch(.*)',
    redirect: { name: 'page404' }
  }
]