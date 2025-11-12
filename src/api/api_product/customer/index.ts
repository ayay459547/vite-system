import { ajax } from '@/lib/lib_ajax'
import type { Options } from '@/components' // 系統組件
import { message } from '@/lib/lib_utils' // 工具

type CustomerItem = {
  id: string
  name: string
}
type CustomerList = Array<CustomerItem>

export const getCustomerList = async (query: string, size?: number): Promise<CustomerList> => {
  const resData = await ajax<CustomerList>(
    {
      url: '/api/customer/retrievefuzzyCustomerId',
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
      message: msg ?? 'getCustomerList Error',
      duration: 10000
    })
    return []
  }
}

export const getCustomerIdList = async (query: string, size?: number): Promise<string[]> => {
  const customerList = await getCustomerList(query, size)
  return customerList.map(row => row.id)
}
export const getCustomerIdOptions = async (query: string, size?: number): Promise<Options> => {
  const customerList = await getCustomerList(query, size)
  return customerList.map(row => {
    const { id } = row
    return { label: id, value: id, data: row }
  })
}

export const getCustomerNameList = async (query: string, size?: number): Promise<string[]> => {
  const customerList = await getCustomerList(query, size)
  return customerList.map(row => row.name)
}
export const getCustomerNameOptions = async (query: string, size?: number): Promise<Options> => {
  const customerList = await getCustomerList(query, size)
  return customerList.map(row => {
    const { name } = row
    return { label: name, value: name, data: row }
  })
}
