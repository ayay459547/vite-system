import type { Api } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import { fakeUserData, allPermissionData } from './stores_fakeData'

export type AuthData = {
  id: number
  name: string
}

export const getUserData = async (token: number) => {
  const resData = await ajax<Api<AuthData>>({
    url: '/page1/get',
    method: 'get',
    data: { token }
  }, {
    getFakeData: true,
    fakeData: {
      data: fakeUserData,
      status: 'success'
    },
    delay: 300
  })
  return resData
}

export type PermissionData = {
  autoGeneratingId: boolean
  createDate: string
  lastUpdateTimestamp: string
  routerName: string

  readPermissions: boolean
  createPermissions: boolean
  updatePermissions: boolean
  deletePermissions: boolean
  executePermissions: boolean
}

export const getRoutesPermission = async (userId: number) => {
  const resData = await ajax<Api<PermissionData[]>>({
    url: '/page1/get',
    method: 'get',
    data: {
      id: userId
    }
  }, {
    getFakeData: true,
    fakeData: {
      data: allPermissionData,
      status: 'success'
    },
    delay: 500,
    callback: (config, fakeData) => {
      if (config.data.id) {
        return fakeData
      } else {
        return []
      }
    }
  })
  return resData
}