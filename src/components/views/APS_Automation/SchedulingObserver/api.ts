import type { Api, ApiRes } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'

export type ResponseData = {
  isScheduling: boolean
}

export const getSchedulingState = async (): Promise<ApiRes<ResponseData>> => {
  const resData = await ajax<Api<ResponseData>>(
    {
      url: '/schedulingProgress/isScheduling',
      method: 'get'
    },
    {
      isFakeData: false,
      fakeData: {
        data: {
          isScheduling: false
        },
        status: 'success'
      },
      delay: 300
    }
  )
  const { status, msg, data } = resData

  if (['success', true].includes(status)) {
    return {
      status: 'success',
      data,
      msg
    }
  } else {
    return { status: 'error', data: {isScheduling: false}, msg }
  }
}
