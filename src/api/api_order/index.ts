import { ajax } from '@/lib/lib_ajax'
import type { Options } from '@/components' // 系統組件
import { message } from '@/lib/lib_utils' // 工具

type OrderIdItem = {
  id: string
  seq: string
}
type OrderIdList = Array<OrderIdItem>

export const getOrderList = async (query: string, size?: number): Promise<OrderIdList> => {
  const resData = await ajax<OrderIdList>(
    {
      url: '/MaintainERP/retrievefuzzyERPOrderItemId',
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
      message: msg ?? 'getOrderList Error',
      duration: 10000
    })
    return []
  }
}

export const getOrderIdList = async (query: string, size?: number): Promise<string[]> => {
  const orderIdList = await getOrderList(query, size)
  return orderIdList.map(row => row.id)
}
export const getOrderIdOptions = async (query: string, size?: number): Promise<Options> => {
  const orderIdList = await getOrderList(query, size)
  return orderIdList.map(row => {
    const { id } = row
    return { label: id, value: id, data: row }
  })
}
