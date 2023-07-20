import type { Api } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'

export type TokenData = number

const fakeTokenData = 1

export const loginSystem = async (account: string, password: string) => {
  const resData = await ajax<Api<TokenData>>({
    url: '/page1/get',
    method: 'get',
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
  return resData
}