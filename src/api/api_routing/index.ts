import { ajax } from '@/lib/lib_ajax'
import type { Options } from '@/components' // 系統組件
import { message } from '@/lib/lib_utils' // 工具

type RoutingIdItem = {
  id: string
}
type RoutingIdList = Array<RoutingIdItem>

export const getRoutingList = async (query: string, size?: number): Promise<RoutingIdList> => {
  const resData = await ajax<RoutingIdList>(
    {
      url: '/route/retrievefuzzyRouteIdById',
      method: 'get',
      params: {
        str: query ?? '',
        page: 1,
        size: size ?? 30
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
  const { status, msg, data } = resData

  if (['success', true].includes(status)) {
    return data
  } else {
    message({
      type: 'error',
      message: msg ?? 'getRoutingList Error',
      duration: 10000
    })
    return []
  }
}

export const getRoutingIdList = async (query: string, size?: number): Promise<string[]> => {
  const productIdList = await getRoutingList(query, size)
  return productIdList.map(row => row.id)
}
export const getRoutingIdOptions = async (query: string, size?: number): Promise<Options> => {
  const productIdList = await getRoutingList(query, size)
  return productIdList.map(row => {
    const { id } = row
    return { label: id, value: id, data: row }
  })
}
