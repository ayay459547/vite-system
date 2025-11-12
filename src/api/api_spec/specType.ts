import { ajax } from '@/lib/lib_ajax'
import type { Options } from '@/components' // 系統組件
import { message } from '@/lib/lib_utils' // 工具
import type { SQLDataType } from '@/types'

type SpecTypeItem = {
  id: string
  name: string
  dataType: SQLDataType
}
type SpecTypeList = Array<SpecTypeItem>

export const getSpecTypeList = async (): Promise<SpecTypeList> => {
  const resData = await ajax<SpecTypeList>(
    // {
    //   url: '/maintainSpecType/retrieveAllForWeb',
    //   method: 'get',
    //   params: {}
    // },
    {
      // url: '/maintainSpec/retrieveAllForWeb',
      url: '/api/ipaspTable/retrieveIpaspTableFromView',
      method: 'post',
      data: {
        id: '',
        name: '',
        dataType: '',
        paging: {
          page: 1,
          size: -1
        },
        advanced: [],
        sortingMap: {},
        designatedview: 'iPASPWebView_fund_201_SpecificationType'
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
      message: msg ?? 'getSpecTypeList Error',
      duration: 10000
    })
    return []
  }
}

export const getSpecTypeIdList = async (): Promise<string[]> => {
  const specTypeList = await getSpecTypeList()
  return specTypeList.map(specTypeItem => {
    return specTypeItem.id
  })
}

export const getSpecTypeIdOptions = async (): Promise<Options> => {
  const specTypeList = await getSpecTypeList()
  return specTypeList.map(specTypeItem => {
    const { id } = specTypeItem
    return { label: id, value: id, data: specTypeItem }
  })
}
