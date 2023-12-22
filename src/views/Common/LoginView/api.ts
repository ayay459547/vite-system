import type { Api } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import { swal } from '@/lib/lib_utils'

export type TokenData = number | string

const fakeTokenData = '1'

export const loginSystem = async (account: string, password: string): Promise<TokenData> => {
  const resData = await ajax<Api<TokenData>>({
    baseURL: '/api',
    url: '/user/loginCheckAndGetUserId',
    method: 'post',
    data: {
      account,
      password
    }
  }, {
    getFakeData: true,
    fakeData: {
      data: fakeTokenData,
      status: 'success'
    },
    delay: 300
  })

  const { data, errorMsg, status } = resData

  if (status === 'success') {
    return data
  } else {
    swal({
      icon: 'error',
      title: '取得資料失敗',
      text: errorMsg ?? '請聯絡資訊人員',
      showCancelButton: false
    })
    return ''
  }
}