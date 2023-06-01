import { ajax } from '@/lib/utils'

export type TokenData = string

const fakeTokenData = 'TEST123456789'

export const getTokenData = async (account: string, password: string) => {
  const resData = await ajax<TokenData>({
    url: '/page1/get',
    method: 'get',
    data: {
      account,
      password
    }
  }, {
    getFakeData: true,
    fakeData: fakeTokenData,
    status: 'success',
    delay: 300
  })
  return resData
}