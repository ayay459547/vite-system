import { ajax } from '@/lib/lib_ajax'
import type { Options } from '@/components' // 系統組件
import { message } from '@/lib/lib_utils' // 工具

type SpecItem = {
  id?: string
  name?: string
  content?: string
  specTypeId?: string
  LAST_UPDATE_TIMESTAMP?: string
}
type SpecList = Array<SpecItem>

export const getSpecList = async (query: string, size?: number): Promise<SpecList> => {
  const resData = await ajax<SpecList>(
    {
      // url: '/maintainSpec/retrieveAllForWeb',
      url: '/api/ipaspTable/retrieveIpaspTableFromView',
      method: 'post',
      data: {
        id: query ?? '',
        name: '',
        content: '',
        specTypeId: '',
        LAST_UPDATE_TIMESTAMP: '',
        paging: {
          page: 1,
          size: size ?? 30
        },
        advanced: [],
        sortingMap: {},
        designatedview: 'iPASPWebView_fund_202_RTDSSpecification'
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
      message: msg ?? 'getSpecList Error',
      duration: 10000
    })
    return []
  }
}

export const getSpecIdList = async (query: string, size?: number): Promise<string[]> => {
  const specTypeList = await getSpecList(query, size)
  return specTypeList.map(specTypeItem => {
    return specTypeItem.id
  })
}

export const getSpecIdOptions = async (query: string, size?: number): Promise<Options> => {
  const specTypeList = await getSpecList(query, size)
  return specTypeList.map(specTypeItem => {
    const { id } = specTypeItem
    return { label: id, value: id, data: specTypeItem }
  })
}
