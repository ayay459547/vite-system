import { ajax } from '@/lib/lib_ajax'
import type { Options } from '@/components' // 系統組件
import { message } from '@/lib/lib_utils' // 工具

type MachineCategoryItem = {
  id: string
  name: string
}
type MachineCategoryList = Array<MachineCategoryItem>

type getMachineCategoryOptions = {
  page?: string | number
  size?: string | number
}

export const getMachineCategoryList = async (query: string, options?: getMachineCategoryOptions): Promise<MachineCategoryList> => {
  const {
    page = 1,
    size = 30
  } = options ?? {}

  const resData = await ajax<MachineCategoryList>(
    {
      url: '/api/maintainMachineCategory/retrievefuzzyMachineCategoryId',
      method: 'get',
      params: {
        str: query ?? '',
        page,
        size
      }
    },
    {
      isFakeData: false,
      fakeData: {
        data: [
          { id: 'machineCategory_01', name: 'machineCategory_01' },
          { id: 'machineCategory_02', name: 'machineCategory_02' },
          { id: 'machineCategory_03', name: 'machineCategory_03' },
          { id: 'machineCategory_04', name: 'machineCategory_04' },
          { id: 'machineCategory_05', name: 'machineCategory_05' }
        ],
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
      message: msg ?? 'getMachineCategoryList Error',
      duration: 10000
    })
    return []
  }
}

export const getMachineCategoryIdList = async (query: string, options?: getMachineCategoryOptions): Promise<string[]> => {
  const machineList = await getMachineCategoryList(query, options)
  return machineList.map(row => row.id)
}
export const getMachineCategoryIdOptions = async (query: string, options?: getMachineCategoryOptions): Promise<Options> => {
  const machineList = await getMachineCategoryList(query, options)
  return machineList.map(row => {
    const { id } = row
    return { label: id, value: id, data: row }
  })
}

export const getMachineCategoryNameList = async (query: string, options?: getMachineCategoryOptions): Promise<string[]> => {
  const machineList = await getMachineCategoryList(query, options)
  return machineList.map(row => row.name)
}
export const getMachineCategoryNameOptions = async (query: string, options?: getMachineCategoryOptions): Promise<Options> => {
  const machineList = await getMachineCategoryList(query, options)
  return machineList.map(row => {
    const { name } = row
    return { label: name, value: name, data: row }
  })
}
