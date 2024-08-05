import type { Api, ApiRes } from '@/declare/ajax.ts'
import { ajax } from '@/lib/lib_ajax'

export type TokenData = number | string

const fakeTokenData = '1'

export const loginSystem = async (account: string, password: string): Promise<ApiRes<TokenData>> => {
  const resData = await ajax<Api<TokenData>>(
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
      isFakeData: true,
      fakeData: {
        data: fakeTokenData,
        status: 'success'
      },
      delay: 300
    }
  )

  const { data, errorMsg, status } = resData

  if (['success', true].includes(status)) {
    return { status: 'success', data, msg: errorMsg }
  } else {
    return { status: 'error', data: null, msg: errorMsg }
  }
}
