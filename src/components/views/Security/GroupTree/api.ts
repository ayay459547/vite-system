import type { ApiRes } from '@/types/types_ajax'
import { ajax } from '@/lib/lib_ajax'

export type Group = {
  autoGeneratingId: boolean
  children?: Group[]
  parent?: Group
  createAt: string
  createDate: string
  description: string
  fullName: string
  id: number
  lastUpdateTimestamp: string
  roles: any
  updateAt: string
  users: any
}

export const getGroupList = async (): Promise<ApiRes<Group[]>> => {
  const resData = await ajax<Group[]>(
    {
      baseURL: '/rest-common',
      url: '/group/listAllGroup',
      method: 'get'
    },
    {
      isFakeData: false,
      fakeData: {
        data: [],
        status: 'success'
      },
      delay: 300
    }
  )
  const { status, msg, data } = resData

  if (['success', true].includes(status)) {
    return { status: 'success', data, msg }
  } else {
    return { status: 'error', data: [], msg }
  }
}
