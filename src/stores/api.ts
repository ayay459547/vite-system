import type { Api, ApiRes } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import type { AuthData, PermissionData } from '@/declare/hook' // 全域功能類型

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

export const getAuthData = async (token: number): Promise<ApiRes<AuthData>> => {
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
      isFakeData: false,
      fakeData: {
        data: fakeUserData,
        status: 'success'
      },
      delay: 300
    }
  )
  const { status, msg, data } = resData

  if (['success', true].includes(status)) {
    return { status: 'success', data, msg }
  } else {
    return { status: 'error', data: defaultAuthData, msg }
  }
}
