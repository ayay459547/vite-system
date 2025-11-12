import type { Api, ApiRes } from '@/types/types_ajax'
import { ajax } from '@/lib/lib_ajax'
import { fakeTableData } from './fakeData'

export type FilterData = {
  customerName?: string
  productId?: string
  deliveryType?: string
  deliveryDate?: string
}

export type TableData = {
  customerName?: string
  productId?: string
  deliveryType?: string
  deliveryDate?: string
  quantity?: number
}

export const getData = async (): Promise<ApiRes<TableData[]>> => {
  const resData = await ajax<any>(
    {
      url: '/api/test',
      method: 'get'
    },
    {
      isFakeData: true,
      fakeData: {
        data: fakeTableData,
        status: 'success'
      },
      delay: 300
    }
  )

  const { status, msg, data } = resData

  if (['success', true].includes(status)) {
    return { status: 'success', data, msg }

  } else {
    return { status: 'error', data: [], msg }
  }
}
