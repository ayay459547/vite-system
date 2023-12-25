import type { Api } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import { fakeUserData, allPermissionData } from './fakeData'
import { swal } from '@/lib/lib_utils'

export type PermissionData = {
  autoGeneratingId: boolean
  createDate: string
  lastUpdateTimestamp: string
  routerName: string
  pk: {
    functionID: string
    roleID: number
  }

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

export type AuthData = {
  id?: number
  roleName?: string
  roleFunction: Array<PermissionData>
}

export const getAuthData = async (token: number): Promise<AuthData> => {
  const resData = await ajax<Api<AuthData>>({
    baseURL: '/rest-common',
    url: '/role/getRole',
    method: 'get',
    params: {
      id: token
    }
  }, {
    getFakeData: true,
    fakeData: {
      data: fakeUserData,
      status: 'success'
    },
    delay: 300
  })
  const { data, status, msg } = resData

  if (status === 'success') {
    return data
  } else {
    swal({
      icon: 'error',
      title: '取得資料失敗',
      text: msg ?? '請聯絡資訊人員',
      showCancelButton: false
    })
    return {
      id: null,
      roleName: null,
      roleFunction: []
    }
  }
}
