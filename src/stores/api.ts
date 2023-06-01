import { ajax } from '@/lib/utils'
import { fakePermissionData } from './_fakeData'

export type PermissionData = {
  autoGeneratingId: boolean
  createDate: string
  lastUpdateTimestamp: string
  pk: {
    roleID: number
    functionID: string
  }
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
    fakeData: fakePermissionData,
    status: 'success',
    delay: 300,
    callback: (config, fakeData) => {
      console.log(config)
      return fakeData
    }
  })
  return resData
}