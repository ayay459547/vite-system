import type { RouterTree } from '@/declare/router'


export const routes: Array<RouterTree> = [
  {
    name: 'about',
    title: '關於',
    inject: true,
    complete: false,
    icon: 'gear',
    path: '/about',
    component: () => import('@/views/AboutView.vue')
  },
  {
    name: 'nav-1',
    title: '選單1',
    inject: true,
    complete: true,
    icon: 'cloud',
    leaves: [
      {
        name: 'nav-1-1',
        title: '選單1-1',
        inject: true,
        complete: false,
        leaves: [
          {
            name: 'nav-1-1-1',
            title: '選單1-1-1',
            inject: true,
            complete: true,
            path: '/nav-1-1-1',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-1-1-2',
            title: '選單1-1-2',
            inject: true,
            complete: true,
            path: '/nav-1-1-2',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-1-1-3',
            title: '選單1-1-3',
            inject: true,
            complete: true,
            path: '/nav-1-1-3',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-1-1-4',
            title: '選單1-1-4',
            inject: true,
            complete: true,
            path: '/nav-1-1-4',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-1-1-5',
            title: '選單1-1-5',
            inject: true,
            complete: true,
            path: '/nav-1-1-5',
            component: () => import('@/views/EmptyView.vue')
          }
        ]
      },
      {
        name: 'nav-1-2',
        title: '選單1-2',
        inject: true,
        complete: true,
        leaves: [
          {
            name: 'nav-1-2-1',
            title: '選單1-2-1',
            inject: true,
            complete: true,
            path: '/nav-1-2-1',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-1-2-2',
            title: '選單1-2-1',
            inject: true,
            complete: true,
            path: '/nav-1-2-2',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-1-2-3',
            title: '選單1-2-3',
            inject: true,
            complete: true,
            path: '/nav-1-2-3',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-1-2-4',
            title: '選單1-2-4',
            inject: true,
            complete: true,
            path: '/nav-1-2-4',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-1-2-5',
            title: '選單1-2-5',
            inject: true,
            complete: true,
            path: '/nav-1-2-5',
            component: () => import('@/views/EmptyView.vue')
          }
        ]
      },
      {
        name: 'nav-1-3',
        title: '選單1-3',
        inject: true,
        complete: true,
        path: '/nav-1-3',
        component: () => import('@/views/EmptyView.vue')
      },
      {
        name: 'nav-1-4',
        title: '選單1-4',
        inject: true,
        complete: true,
        leaves: [
          {
            name: 'nav-1-4-1',
            title: '選單1-4-1',
            inject: true,
            complete: true,
            path: '/nav-1-4-1',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-1-4-2',
            title: '選單1-4-1',
            inject: true,
            complete: true,
            path: '/nav-1-4-2',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-1-4-3',
            title: '選單1-4-3',
            inject: true,
            complete: true,
            path: '/nav-1-4-3',
            component: () => import('@/views/EmptyView.vue')
          }
        ]
      }
    ]
  },
  {
    name: 'nav-2',
    title: '選單2',
    inject: true,
    complete: true,
    icon: 'shield-halved',
    path: '/nav-2',
    component: () => import('@/views/Nav-2/Nav-2.vue')
  },
  {
    name: 'nav-3',
    title: '選單3',
    inject: true,
    complete: true,
    icon: 'cloud',
    leaves: [
      {
        name: 'nav-3-1',
        title: '選單3-1',
        inject: true,
        complete: true,
        leaves: [
          {
            name: 'nav-3-1-1',
            title: '選單3-1-1',
            inject: true,
            complete: true,
            path: '/nav-3-1-1',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-3-1-2',
            title: '選單3-1-2',
            inject: true,
            complete: true,
            path: '/nav-3-1-2',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-3-1-3',
            title: '選單3-1-3',
            inject: true,
            complete: true,
            path: '/nav-3-1-3',
            component: () => import('@/views/EmptyView.vue')
          }
        ]
      },
      {
        name: 'nav-3-2',
        title: '選單3-2',
        inject: true,
        complete: true,
        leaves: [
          {
            name: 'nav-3-2-1',
            title: '選單3-2-1',
            inject: true,
            complete: true,
            path: '/nav-3-2-1',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-3-2-2',
            title: '選單3-2-1',
            inject: true,
            complete: true,
            path: '/nav-3-2-2',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-3-2-3',
            title: '選單3-2-3',
            inject: true,
            complete: true,
            path: '/nav-3-2-3',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-3-2-4',
            title: '選單3-2-4',
            inject: true,
            complete: true,
            path: '/nav-3-2-4',
            component: () => import('@/views/EmptyView.vue')
          }
        ]
      },
      {
        name: 'nav-3-3',
        title: '選單3-3',
        inject: true,
        complete: true,
        leaves: [
          {
            name: 'nav-3-3-1',
            title: '選單3-3-1',
            inject: true,
            complete: true,
            path: '/nav-3-3-1',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-3-3-3',
            title: '選單3-3-3',
            inject: true,
            complete: true,
            path: '/nav-3-3-3',
            component: () => import('@/views/EmptyView.vue')
          },
          {
            name: 'nav-3-3-4',
            title: '選單3-3-4',
            inject: true,
            complete: true,
            path: '/nav-3-3-4',
            component: () => import('@/views/EmptyView.vue')
          }
        ]
      }
    ]
  }
]

/**
 * @author Caleb
 * @description 取的指定的階層的子路由
 * @param routerList 路由
 * @param level 想取的的階層
 * @param hasLeaves 是否包含子路由
 * @returns {Array} 返回路由
 */
export const getRouterLeaf = (routerList: RouterTree[], level = 1, hasLeaves = true): Array<RouterTree> => {
  const res = []

  const _getRouterLeaf = (
    routerList: RouterTree[] = [],
    res: RouterTree[] = [],
    options = {
      currLevel: 1,    // 目前階層
      getLevel: 1,     // 想取得的階層
      hasLeaves: true, // 是否包含子路由
      parent: 'root'   // 父節點的 name
    }
  ): void => {
    const { currLevel, getLevel, hasLeaves, parent } = options

    if (currLevel > getLevel) return  // 超過指定層數就結束

    routerList.forEach(routerItem => {
      if (currLevel === getLevel) {
        const pushItem = {
          parent,
          ...routerItem
        }
        // 去掉子路由
        if (!hasLeaves && Object.hasOwnProperty.call(pushItem, 'leaves')) {
          delete pushItem.leaves
        }
        res.push(pushItem)
      }
      if (Object.hasOwnProperty.call(routerItem, 'leaves')) {
        _getRouterLeaf(routerItem.leaves, res, {
          currLevel: currLevel + 1,
          getLevel,
          hasLeaves,
          parent: routerItem.name
        })
      }
    })
  }

  _getRouterLeaf(routerList, res, {
    currLevel: 1,
    getLevel: level,
    hasLeaves,
    parent: 'root'
  })

  return res
}

export default routes