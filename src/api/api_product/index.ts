import { ajax } from '@/lib/lib_ajax'
import type { Options } from '@/components' // 系統組件
import { message } from '@/lib/lib_utils' // 工具

type ProductIdItem = {
  id: string
  name: string
}
type ProductIdList = Array<ProductIdItem>

export const getProductList = async (query: string, size?: number): Promise<ProductIdList> => {
  const resData = await ajax<ProductIdList>(
    {
      url: '/api/product/retrievefuzzyProductIdAndName',
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
      message: msg ?? 'getProductList Error',
      duration: 10000
    })
    return []
  }
}

export const getProductIdList = async (query: string, size?: number): Promise<string[]> => {
  const productIdList = await getProductList(query, size)
  return productIdList.map(row => row.id)
}
export const getProductIdOptions = async (query: string, size?: number): Promise<Options> => {
  const productIdList = await getProductList(query, size)
  return productIdList.map(row => {
    const { id } = row
    return { label: id, value: id, data: row }
  })
}

export const getProductNameList = async (query: string, size?: number): Promise<string[]> => {
  const productIdList = await getProductList(query, size)
  return productIdList.map(row => row.name)
}
export const getProductNameOptions = async (query: string, size?: number): Promise<Options> => {
  const productIdList = await getProductList(query, size)
  return productIdList.map(row => {
    const { name } = row
    return { label: name, value: name, data: row }
  })
}
