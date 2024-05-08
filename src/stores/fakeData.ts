import { getRouterLeafLayer, refactorRoutes } from '@/lib/lib_routes'
import routes from '@/router/routes'

export const fakePermissionData = [
  {
    autoGeneratingId: false,
    createDate: '2023-04-21 18:18:48.814',
    lastUpdateTimestamp: '2023-04-21 18:18:48.814',
    // routerName: 'nav-1-1-1',
    pk: {
      functionID: 'nav-1-1-1',
      roleID: 1
    },

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
    // routerName: 'nav-1-1-2',
    pk: {
      functionID: 'nav-1-1-2',
      roleID: 1
    },

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
    // routerName: 'nav-1-1-3',
    pk: {
      functionID: 'nav-1-1-3',
      roleID: 1
    },

    readPermissions: true,
    createPermissions: true,
    updatePermissions: true,
    deletePermissions: true,
    executePermissions: true
  }
]

export const allPermissionData = refactorRoutes(leafNode => {
  const hiddenRoutes = ['nav-1-2-1', 'nav-1-1-3']
  if (hiddenRoutes.includes(leafNode.name)) {
    return {
      refactorNode: {
        autoGeneratingId: false,
        createDate: '2023-04-21 18:18:48.814',
        lastUpdateTimestamp: '2023-04-21 18:18:48.814',
        routerName: leafNode.name,
        pk: {
          functionID: leafNode.name,
          roleID: 1
        },

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
      pk: {
        functionID: leafNode.name,
        roleID: 1
      },

      readPermissions: true,
      createPermissions: true,
      updatePermissions: true,
      deletePermissions: true,
      executePermissions: true
    },
    isShow: true
  }
}, getRouterLeafLayer(routes, [1, 2, 3], false))

export const fakeUserData = {
  user: {
    id: 1,
    loginName: 'admin',
    fullName: 'admin',
    enabled: true,
    password: ''
  },
  role: {
    id: 1,
    name: 'admin',
    description: 'administrator'
  },
  roleFunction: allPermissionData,
  groups: [{ id: 1, fullName: 'admin' }]
}
