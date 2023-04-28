import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import type { RouterTree } from '@/declare/router'
import { routes } from '@/router/routes'

import HomeView from '@/views/HomeView.vue'

/**
 * @author Caleb
 * @description 將路由樹轉換成可使用路由
 * @param routes 路由樹
 * @returns {Array} vue-router 指定格式
 */
const treeToRoutes = (routes: RouterTree[]): RouteRecordRaw[] => {
  const res = []

  const _treeToRoutes = (routes: RouterTree[], res: RouteRecordRaw[]): void => {
    routes.forEach(route => {
      if (Object.hasOwnProperty.call(route, 'path')) {
        const { title, name,  meta, path, component } = route

        const pushItem = {
          path,
          name,
          component,
          meta: {
            ...meta,
            title
          }
        }
        res.push(pushItem)
      }
      if (Object.hasOwnProperty.call(route, 'leaves')) {
        _treeToRoutes(route.leaves, res)
      }
    })
  }

  _treeToRoutes(routes, res)
  return res
}

const resRoutes: ComputedRef<RouteRecordRaw[]> = computed(() => {
  return treeToRoutes(routes)
})

const baseRoutes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: { name: 'home' }
  },
  {
    name: 'home',
    meta: {
      title: '首頁'
    },
    path: '/home',
    component: HomeView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...baseRoutes, ...resRoutes.value]
})

export default router
