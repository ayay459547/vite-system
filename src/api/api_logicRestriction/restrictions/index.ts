import { ajax } from '@/lib/lib_ajax'
import { message, hasOwnProperty, tipLog } from '@/lib/lib_utils' // 工具
import type { RestrictionInfo, MaintainRestrictionType2DataType } from '@/types/types_logicRestriction/restrictions'
import type { PascalCaseMatchingType, MatchingTypeValue } from '@/types/types_logicRestriction/restrictionsMatchingType'
import { MaintainRestrictionType } from '@/declare/declare_logicRestriction/enums'

// 取得所有 可設定限制類型 (一般+規格)
export const getMaintainRestrictionType2DataType = async (maintainRestrictionType: string = '') => {
  if (hasOwnProperty(MaintainRestrictionType, maintainRestrictionType)) {
    tipLog('MaintainRestrictionType 尚未定義此類型', [
      `目前已經定義的類型: ${MaintainRestrictionType}`,
      `查詢類型: ${maintainRestrictionType}`
    ])
  }
  // const getRestrictionTypeUrl = `/${MaintainRestrictionType.MachineProcessProductionConstraint}/retrieveRestrictionTypeForWeb`
  const urlPath = MaintainRestrictionType[maintainRestrictionType] ?? MaintainRestrictionType.MachineProcessProductionConstraint
  const getRestrictionTypeUrl = `/${urlPath}/retrieveRestrictionTypeForWeb`

  const resData = await ajax<MaintainRestrictionType2DataType[]>(
    {
      // url: '/maintainRestrictionType/retrieveRestriction2DataType', // 舊版
      url: getRestrictionTypeUrl,
      method: 'get'
    },
    {
      isFakeData: false,
      fakeDataPath: '/api/api_logicRestriction/fakeData_maintainRestrictionType.json',
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
      message: msg ?? 'getMaintainRestrictionType2DataType Error',
      duration: 10000
    })
    return []
  }
}


/**
 * @deprecated 使用 getMaintainRestrictionType2DataType
 * @returns {Array}
 */
export const getRestrictionTypeList = async () : Promise<RestrictionInfo[]> => {
  const resData = await ajax<RestrictionInfo[]>(
    {
      url: '/maintainRestrictionType/retrieveAll',
      method: 'get'
    },
    {
      isFakeData: false,
      fakeData: {
        data: [],
        size: 0,
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
      message: msg ?? 'getRestrictionTypeList Error',
      duration: 10000
    })
    return []
  }
}

// 動態欄位可用比對類型
export type MaintainMatchingType = Record<PascalCaseMatchingType, MatchingTypeValue[]>

export const getMaintainMatchingType = async (): Promise<MaintainMatchingType> => {
  const resData = await ajax<MaintainMatchingType>(
    {
      url: '/maintainMatchingType/retrieveAllMatchingType',
      method: 'get'
    },
    {
      isFakeData: false,
      fakeDataPath: '/api/api_logicRestriction/fakeData_maintainMatchingType.json',
      fakeData: {
        data: {},
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
      message: msg ?? 'getMaintainMatchingType Error',
      duration: 10000
    })

    const data: MaintainMatchingType = {
      StrMatchingType: [],
      NumMatchingType: [],
      DateMatchingType: []
    }
    return data
  }
}
