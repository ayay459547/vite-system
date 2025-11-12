import { ajax } from '@/lib/lib_ajax'
import type { Options } from '@/components' // 系統組件
import { message } from '@/lib/lib_utils' // 工具

type CategoryItem = {
  id: string
  name: string
}
type CategoryList = Array<CategoryItem>

export const getCategoryList = async (query: string, size?: number): Promise<CategoryList> => {
  const resData = await ajax<CategoryList>(
    {
      url: '/productCat/retrievefuzzyProductCategoryIdAndName',
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
      message: msg ?? 'getCategoryList Error',
      duration: 10000
    })
    return []
  }
}

export const getCategoryIdList = async (query: string, size?: number): Promise<string[]> => {
  const categoryList = await getCategoryList(query, size)
  const categoryIdList = categoryList.map(row => {
    return row.id
  })
  return categoryIdList
}
export const getCategoryIdOptions = async (query: string, size?: number): Promise<Options> => {
  const categoryList = await getCategoryList(query, size)
  const categoryIdOptions = categoryList.map(row => {
    const { id } = row
    return { label: id, value: id, data: row }
  })
  return categoryIdOptions
}

export const getCategoryNameList = async (query: string, size?: number): Promise<string[]> => {
  const categoryList = await getCategoryList(query, size)
  const categoryNameList = categoryList.map(row => {
    return row.name
  })
  return categoryNameList
}
export const getCategoryNameOptions = async (query: string, size?: number): Promise<Options> => {
  const categoryList = await getCategoryList(query, size)
  const categoryIdOptions = categoryList.map(row => {
    const { name } = row
    return { label: name, value: name, data: row }
  })
  return categoryIdOptions
}
