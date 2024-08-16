
import type { RouteRecordRaw } from 'vue-router'

import HomeView from '@/views/Common/HomeView/HomeView.vue'
import LoginView from '@/views/Common/LoginView/LoginView.vue'
import CheckStatus from '@/views/Common/CheckStatus.vue'
const NoPermissions = () => import('@/views/Common/NoPermissions.vue')
const InProgress = () => import('@/views/Common/InProgress.vue')
const Page_404 = () => import('@/views/Common/Page_404.vue')
const FixView = () => import('@/views/Common/FixView.vue')

const Async_Skeleton = () => import('@/views/Common/Async_Skeleton.vue')
const Async_Error = () => import('@/views/Common/Async_Error.vue')

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
    name: 'Async_Skeleton',
    meta: { title: '404' },
    path: `${systemUrl}/Async_Skeleton`,
    component: Async_Skeleton
  },
  {
    name: 'Async_Error',
    meta: { title: '404' },
    path: `${systemUrl}/Async_Error`,
    component: Async_Error
  },
  {
    path: '/:pathMatch(.*)',
    redirect: { name: 'page404' }
  }
]