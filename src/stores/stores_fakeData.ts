import { getRouterLeafLayer, refactorRoutes } from '@/lib/lib_routes'
import routes from '@/router/routes'

export const fakeUserData = {
  id: 1,
  name: 'USER'
}

export const fakePermissionData = [
  {
    autoGeneratingId: false,
    createDate: '2023-04-21 18:18:48.814',
    lastUpdateTimestamp: '2023-04-21 18:18:48.814',
    routerName: 'nav-1-1-1',

    readPermissions: true,
    createPermissions: true,
    updatePermissions: true,
    deletePermissions: true,
    executePermissions: true
  },
  {
    autoGeneratingId: false,
    createDate: '2023-04-21 18:18:48.814',
    lastUpdateTimestamp: '2023-04-21 18:18:48.814',
    routerName: 'nav-1-1-2',

    readPermissions: true,
    createPermissions: true,
    updatePermissions: true,
    deletePermissions: true,
    executePermissions: true
  },
  {
    autoGeneratingId: false,
    createDate: '2023-04-21 18:18:48.814',
    lastUpdateTimestamp: '2023-04-21 18:18:48.814',
    routerName: 'nav-1-1-3',

    readPermissions: true,
    createPermissions: true,
    updatePermissions: true,
    deletePermissions: true,
    executePermissions: true
  }
]

export const allPermissionData = refactorRoutes(leafNode => {
  const hiddenRoutes = ['nav1-2-1', 'nav1-1-3']
  if (hiddenRoutes.includes(leafNode.name)) {
    return {
      refactorNode: {
        autoGeneratingId: false,
        createDate: '2023-04-21 18:18:48.814',
        lastUpdateTimestamp: '2023-04-21 18:18:48.814',
        routerName: leafNode.name,

        readPermissions: false,
        createPermissions: false,
        updatePermissions: true,
        deletePermissions: true,
        executePermissions: true
      },
      isShow: true
    }
  }
  return {
    refactorNode: {
      autoGeneratingId: false,
      createDate: '2023-04-21 18:18:48.814',
      lastUpdateTimestamp: '2023-04-21 18:18:48.814',
      routerName: leafNode.name,

      readPermissions: true,
      createPermissions: true,
      updatePermissions: true,
      deletePermissions: true,
      executePermissions: true
    },
    isShow: true
  }
}, getRouterLeafLayer(routes, [1, 2, 3], false))