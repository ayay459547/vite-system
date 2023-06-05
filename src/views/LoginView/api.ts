import { ajax } from '@/lib/utils'

export type TokenData = number

const fakeTokenData = 1

export const loginSystem = async (account: string, password: string) => {
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