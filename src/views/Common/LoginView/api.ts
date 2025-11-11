import type { ApiRes } from '@/types/types_ajax'
import { ajax } from '@/lib/lib_ajax'

export type TokenData = number | string

const fakeTokenData = '1'

export const loginSystem = async (account: string, password: string): Promise<ApiRes<TokenData>> => {
  const resData = await ajax<TokenData>(
    {
      baseURL: '/rest-common',
      url: '/user/loginCheckAndGetUserId',
      method: 'post',
      data: {
        account,
        password
      }
    },
    {
      isFakeData: false,
      fakeData: {
        data: fakeTokenData,
        status: 'success'
      },
      delay: 300
    }
  )

  const { data, msg, status } = resData

  if (['success', true].includes(status)) {
    return { status: 'success', data, msg }
  } else {
    return { status: 'error', data: null, msg }
  }
}
