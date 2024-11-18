import type { Api, ApiRes } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'

// 站點編號/站點名稱
export const getProcessList = async (str: string, size: number, processType: string): Promise<ApiRes<any>> => {
  const isGetProcessId = processType === 'no'
  const url = isGetProcessId ? '/api/Process/retrievefuzzyProcessId'
    : '/api/Process/retrievefuzzyProcessName'

  const resData = await ajax<Api<any[]>>(
    {
      url,
      method: 'get',
      params: {
        str,
        size
      }
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

  const { status, data, msg } = resData

  if (['success', true].includes(status)) {
    const type = isGetProcessId ? 'id' : 'name'

    return {
      status: 'success',
      data: data.map(item => {
        return item[type]
      }),
      msg
    }
  } else {
    return { status: 'error', data: [], msg }
  }
}
