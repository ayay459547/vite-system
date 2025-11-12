import { ajax } from '@/lib/lib_ajax'
import type { Options } from '@/components' // 系統組件
import { message } from '@/lib/lib_utils' // 工具

type MOItemItem = {
  id?: string
  indx?: string
  processId?: string
  erpNo?: string
}
type MOItemList = Array<MOItemItem>

type GetMOItemOptions = {
  erpNo?: string
  processId?: string
  page?: string | number
  size?: string | number
}

export const getMOItemList = async (options: GetMOItemOptions): Promise<MOItemList> => {
  const {
    erpNo = '',
    page = 1,
    size = 30
  } = options

  const resData = await ajax<MOItemList>(
    {
      url: '/recieveMOItemFromRTD/retrievefuzzyManufactureOrderItemId',
      method: 'get',
      params: {
        erpNo,
        page,
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
      message: msg ?? 'getMOItemList Error',
      duration: 10000
    })
    return []
  }
}

// 取得 id_index
export const getMOItemIdIndexList = async (options: GetMOItemOptions): Promise<string[]> => {
  const orderIdList = await getMOItemList(options)
  return orderIdList.map(row => {
    const { id, indx } = row
    return `${id}_${indx}`
  })
}
export const getMOItemIdIndexOptions = async (options: GetMOItemOptions): Promise<Options> => {
  const orderIdList = await getMOItemList(options)
  return orderIdList.map(row => {
    const { id, indx, processId } = row
    return { label: `${id}_${indx} (${processId})`, value: `${id}_${indx}`, data: row }
  })
}

// 取得 no_index
export const getMOItemNoIndexList = async (options: GetMOItemOptions): Promise<string[]> => {
  const orderIdList = await getMOItemList(options)
  return orderIdList.map(row => {
    const { erpNo, indx } = row
    return `${erpNo}_${indx}`
  })
}
export const getMOItemNoIndexOptions = async (options: GetMOItemOptions): Promise<Options> => {
  const orderIdList = await getMOItemList(options)
  return orderIdList.map(row => {
    const { erpNo, indx, processId } = row
    return { label: `${erpNo}_${indx} (${processId})`, value: `${erpNo}_${indx}`, data: row }
  })
}
