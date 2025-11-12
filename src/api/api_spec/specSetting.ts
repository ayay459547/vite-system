import { ajax } from '@/lib/lib_ajax'
import { message, hasOwnProperty } from '@/lib/lib_utils' // 工具
import type { SQLDataType } from '@/types'
import { MaintainRestrictionType } from '@/declare/declare_logicRestriction/enums'

type SpecTypeItem = {
  lastVersion?: any
  lastUpdateTimestamp?: string
  restrictionType?: {
    val: number
    cnName: string
    type: string
  }
  autoGeneratingId?: boolean
  dataType?: {
    val: number
    type: SQLDataType
  }
  name?: string
  factoryNo?: string
  hiberversion?: number
  id?: string
  mark?: {
    column: number
  }
  createDate?: string
}
type SpecTypeList = Array<SpecTypeItem>

const retrieveProdSpecTypeUrl = {
  // 機台合併條件限制管理 fund-1419
  // [MaintainRestrictionType.MergeConstraint]: {
  //   specType: '/mergeConstraint/retrieveAdditionalSpecTypeForWeb'
  // },
  [MaintainRestrictionType.MachineMergeConstraint]: {
    specType: '/machineMergeConstraint/retrieveAdditionalSpecTypeForWeb'
  },
  [MaintainRestrictionType.MachineCategoryMergeConstraint]: {
    specType: '/machineCategoryMergeConstraint/retrieveAdditionalSpecTypeForWeb'
  },
  // 機台換線資訊 fund-1422
  [MaintainRestrictionType.MachineProcessChangeLine]: {
    specType: '/machineProcessChangeLine/retrieveAdditionalSpecTypeForWeb'
  },
  // 機台生產限制管理 fund-1435
  [MaintainRestrictionType.MachineProcessProductionConstraint]: {
    specType: '/machineProcessProductionConstraint/retrieveAdditionalSpecTypeForWeb'
  }
}

export const getSpecTypeList = async (type: string = ''): Promise<SpecTypeList> => {
  let url = retrieveProdSpecTypeUrl.machineProcessProductionConstraint.specType // 預設
  if (hasOwnProperty(retrieveProdSpecTypeUrl, type)) {
    url = retrieveProdSpecTypeUrl[type].specType
  }

  const resData = await ajax<SpecTypeList>(
    {
      // url: '/maintainSpecType/retrieveProdSpecType', // 舊版
      url,
      method: 'get'
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
      message: msg ?? 'getProdSpecTypeList Error',
      duration: 10000
    })
    return []
  }
}
