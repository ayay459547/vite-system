import { ajax } from '@/lib/utils'
import { fakeUserData, allPermissionData } from './_fakeData'

export type AuthData = {
  id: number
  name: string
}

export const getUserData = async (token: number) => {
  const resData = await ajax<AuthData>({
    url: '/page1/get',
    method: 'get',
    data: { token }
  }, {
    getFakeData: true,
    fakeData: fakeUserData,
    status: 'success',
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
  const resData = await ajax<PermissionData[]>({
    url: '/page1/get',
    method: 'get',
    data: {
      id: userId
    }
  }, {
    getFakeData: true,
    fakeData: allPermissionData,
    status: 'success',
    delay: 300,
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