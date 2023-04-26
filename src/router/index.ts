import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import type { RouterTree } from '@/declare/router'
import { routes, getRouterLeaf } from '@/router/routes'

import HomeView from '@/views/HomeView.vue'

const tempRoutes: ComputedRef<RouterTree[]> = computed(() => {
  return getRouterLeaf(routes, 1, true)
})

const resRoutes: ComputedRef<RouteRecordRaw[]> = computed(() => {
  return tempRoutes.value.map(route => {
    const { title, name,  meta, path, component } = route

    return {
      path,
      name,
      component,
      meta: {
        ...meta,
        title
      }
    }
  })
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
