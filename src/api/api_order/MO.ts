import { ajax } from '@/lib/lib_ajax'
import type { Options } from '@/components' // 系統組件
import { message } from '@/lib/lib_utils' // 工具

type MOItem = {
  id: string
  erpNo: string
}
type MOList = Array<MOItem>

type GetMOOptions = {
  erpNo?: string
  page?: string | number
  size?: string | number
}

export const getMOList = async (options: GetMOOptions): Promise<MOList> => {
  const {
    erpNo = '',
    page = 1,
    size = 30
  } = options

  const resData = await ajax<MOList>(
    {
      url: '/recieveMOFromRTD/retrievefuzzyManufactureOrderId',
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
      message: msg ?? 'getMOList Error',
      duration: 10000
    })
    return []
  }
}

// 取得 id
export const getMOIdList = async (options: GetMOOptions): Promise<string[]> => {
  const orderIdList = await getMOList(options)
  return orderIdList.map(row => row.id)
}
export const getMOIdOptions = async (options: GetMOOptions): Promise<Options> => {
  const orderIdList = await getMOList(options)
  return orderIdList.map(row => {
    const { id } = row
    return { label: id, value: id, data: row }
  })
}

// 取得 no_index
export const getMONoList = async (options: GetMOOptions): Promise<string[]> => {
  const orderIdList = await getMOList(options)
  return orderIdList.map(row => row.erpNo)
}
export const getMONoOptions = async (options: GetMOOptions): Promise<Options> => {
  const orderIdList = await getMOList(options)
  return orderIdList.map(row => {
    const { erpNo } = row
    return { label: erpNo, value: erpNo, data: row }
  })
}
