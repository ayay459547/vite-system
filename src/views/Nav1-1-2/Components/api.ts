import type { Api } from '@/types/types_ajax'
import { ajax } from '@/lib/lib_ajax'
import { swal } from '@/lib/lib_utils' // 工具

import { fakeData } from './fakeData'

export type Params = {
  userId: number
}

export type UserData = {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export const getData = async (userId: number) => {
  const resData = await ajax<Api<UserData[]>>(
    {
      url: '/page/getData',
      method: 'get',
      data: {
        userId
      }
    },
    {
      isFakeData: true,
      fakeData: {
        data: fakeData,
        status: 'success'
      },
      delay: 300,
      callback(config, fakeData) {
        const { userId } = config.data

        const { data, status } = fakeData

        return {
          data: data.filter(item => {
            return item.id === userId
          }),
          status
        }
      }
    }
  )

  const { status, msg, data } = resData

  if (status === 'success') {
    return data[0] ?? {}
  } else {
    swal({
      icon: 'error',
      title: '取得資料失敗',
      text: msg ?? '請聯絡資訊人員',
      showCancelButton: false
    })

    return {}
  }
}
