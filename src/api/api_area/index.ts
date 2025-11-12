import { ajax } from '@/lib/lib_ajax'
import type { Options } from '@/components' // 系統組件
import { message } from '@/lib/lib_utils' // 工具

type AreaItem = {
  no: string
  name: string
}
type AreaList = Array<AreaItem>

export const getAreaList = async (query: string, size?: number): Promise<AreaList> => {
  const resData = await ajax<AreaList>(
    {
      url: '/api/area/retrievefuzzyAreaNo',
      method: 'get',
      params: {
        str: query ?? '',
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
      message: msg ?? 'getAreaList Error',
      duration: 10000
    })
    return []
  }
}

export const getAreaNoList = async (query: string, size?: number): Promise<string[]> => {
  const areaList = await getAreaList(query, size)
  return areaList.map(row => row.no)
}
export const getAreaNoOptions = async (query: string, size?: number): Promise<Options> => {
  const areaList = await getAreaList(query, size)
  return areaList.map(row => {
    const { no } = row
    return { label: no, value: no, data: row }
  })
}

export const getAreaNameList = async (query: string, size?: number): Promise<string[]> => {
  const areaList = await getAreaList(query, size)
  return areaList.map(row => row.name)
}
export const getAreaNameOptions = async (query: string, size?: number): Promise<Options> => {
  const areaList = await getAreaList(query, size)
  return areaList.map(row => {
    const { name } = row
    return { label: name, value: name, data: row }
  })
}
