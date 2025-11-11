import type { ApiRes } from '@/types/types_ajax'
import { ajax } from '@/lib/lib_ajax'
import type { AuthData } from '@/types/types_hook' // 全域功能類型

export const defaultAuthData: any = {
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

export const getAuthData = async (userId: number): Promise<ApiRes<AuthData>> => {
  const resData = await ajax<AuthData>(
    {
      baseURL: '/rest-common',
      // url: '/role/getRole',
      url: '/role/getRoleByUserId',
      method: 'get',
      params: {
        id: userId
      }
    },
    {
      isFakeData: false,
      fakeDataPath: '/stores/fakeData_auth.json',
      fakeData: {
        data: {
          user: null,
          role: null,
          roleFunction: [],
          groups: []
        },
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
