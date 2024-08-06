import type { Api } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import { swal } from '@/lib/lib_utils'
import type { Options } from '@/components'

import { fakeTableData } from './fakeData'

export type Params = {
  showCorrectCompare: boolean
}

export type Search = {
  version: string
  dateInterval: string[]
  showCorrectCompare: boolean
}

type CompareResult = {
  restrictionCategoryName: string
  restrictionResources: Array<{
    restrictionCompareReports: Array<{
      restrictionValue: string
      discrepancy: string
      compareDetailExtra: string
      restrictionName: string
      compareDetailInsufficient: string
      inputValue: string
      matchingType: string
      isCorrect: string
    }>
    restrictionResourceName: string
  }>
}

export type ResponseData = {
  relatingObjects: Array<{
    dateOfPlan: string
    objectDetails: Array<{
      machineId: string
      productId: string
      processId: string
      limit2CertainTypeOfObj: {
        machineCategory: string
        custProduct: string
        productGroup: string
        resourceScheduleRestrictedGroup: string
      }
      compareResults: Array<CompareResult>
    }>
  }>
}

export type TableData = {
  id: string
  dateInterval: string

  machine: string
  process: string
  productGroup: string
  custProduct: string
  product: string
  reportRestrictedGroup: string
  // compareResults: Array<CompareResult>

  restrictionCategoryName?: string
  restrictionResourceName?: string
  restrictionCompareReportsLength?: number

  restrictionName?: string
  restrictionValue?: string
  matchingType?: string
  inputValue?: string
  compareDetailInsufficient?: string
  compareDetailExtra?: string
  discrepancy?: string

  version?: string
  showCorrectCompare?: string
}

export const getVersionOptions = async (): Promise<Options> => {
  const resData = await ajax<Api<string[]>>(
    {
      url: '/maintainResourceCompareResult/retrieveNewestVersionBySetting',
      method: 'get'
    },
    {
      isFakeData: true,
      fakeData: {
        data: ['20231129_1'],
        status: 'success'
      },
      delay: 300
    }
  )
  const { status, msg, data } = resData

  if (status === 'success') {
    return data.map(version => {
      return {
        label: version,
        value: version
      }
    })
  } else {
    swal({
      icon: 'error',
      title: '取得資料失敗',
      text: msg ?? '請聯絡資訊人員',
      showCancelButton: false
    })
    return []
  }
}

// const restrictionCompareReportOrder = [
//   'restrictionName', // 比對類別
//   'restrictionValue', // 設定基準
//   'matchingType', // 比對方式
//   'inputValue', // 實際配置
//   'compareDetailInsufficient', // 缺少配置
//   'compareDetailExtra', // 多餘配置
//   'discrepancy' // 數量計算後多寡
// ]

// table
export const getData = async (params: any): Promise<ResponseData[]> => {
  const { dateOfPlan = [], dateVersion = '', showCorrectCompare = false } = params
  const resData = await ajax<Api<ResponseData[]>>(
    {
      url: '/maintainResourceCompareResult/retrieveByFilter',
      method: 'post',
      data: {
        dateOfPlan,
        dateVersion,
        showCorrectCompare
      } as Params
    },
    {
      isFakeData: true,
      fakeData: {
        data: fakeTableData,
        status: 'success'
      },
      delay: 300
    }
  )
  const { status, msg, data } = resData

  if (status === 'success') {
    return data
  } else {
    swal({
      icon: 'error',
      title: '取得資料失敗',
      text: msg ?? '請聯絡資訊人員',
      showCancelButton: false
    })
    return []
  }
}
