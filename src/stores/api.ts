import type { Api } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import { swal } from '@/lib/lib_utils'
import type { AuthData, PermissionData } from '@/declare/hook'

import { fakeUserData, allPermissionData } from './fakeData'

export const getRoutesPermission = async (userId: number) => {
  const resData = await ajax<Api<PermissionData[]>>(
    {
      url: '/api/getTableDataCount',
      method: 'get',
      data: {
        id: userId
      }
    },
    {
      isFakeData: true,
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
    }
  )
  return resData
}

export const defaultAuthData = {
  user: {
    id: null,
    loginName: null,
    fullName: null,
    enabled: false,
    password: null
  },
  role: {
    id: null,
    roleName: null,
    description: null
  },
  roleFunction: [],
  groups: [{ id: null, fullName: null }]
}

export const getAuthData = async (token: number): Promise<AuthData> => {
  const resData = await ajax<Api<AuthData>>(
    {
      baseURL: '/rest-common',
      // url: '/role/getRole',
      url: '/role/getRoleByUserId',
      method: 'get',
      params: {
        id: token
      }
    },
    {
      isFakeData: true,
      fakeData: {
        data: fakeUserData,
        status: 'success'
      },
      delay: 300
    }
  )
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
    return defaultAuthData
  }
}
