import type { ApiRes } from '@/types/types_ajax'
import { ajax } from '@/lib/lib_ajax'

export type UploadFileRes = {
  conflictList: Array<any>
  expectedResults: {
    expectedAppendRes: Array<any>
    expectedOverrideRes: Array<any>
  }
  finishErpList: Array<any>
  lossList: Array<any>
  sameErpList: Array<any>
  targetMachine: Array<any>
}
// 匯入插單上傳檔案
export const uploadFile = async (formData: FormData): Promise<ApiRes<UploadFileRes | null>> => {
  const resData = await ajax<UploadFileRes>(
    {
      url: '/machineDistribution/file',
      method: 'post',
      data: formData,
      headers: {
        // 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        'Content-Type': 'multipart/form-data',
        'X-Requested-With': 'XMLHttpRequest'
      }
    },
    {
      isFakeData: false,
      fakeData: {
        data: {
          conflictList: [],
          expectedResults: {
            expectedAppendRes: [],
            expectedOverrideRes: []
          },
          finishErpList: [],
          lossList: [],
          sameErpList: [],
          targetMachine: []
        },
        msg: '',
        // status: 'success'
        status: true
      },
      delay: 300
    }
  )

  const { data, msg, status } = resData

  if (['success', true].includes(status)) {
    return { status: 'success', data: data ?? null, msg }
  } else {
    return { status: 'error', data: null, msg }
  }
  // return {
  //   conflictList: [],
  //   expectedResults: {
  //     expectedAppendRes: [],
  //     expectedOverrideRes: []
  //   },
  //   finishErpList: [],
  //   lossList: [],
  //   sameErpList: [],
  //   targetMachine: []
  // }
}

export type InsertRushOrderItem = {
  machineId: string
  rushOrders: Array<{
    processId: string
    custId: string
    erpNo: string
    sequence: number
    memo: string
  }>
  updateBy: string
}
export type InsertRushOrderList = Array<InsertRushOrderItem>
// 匯入插單更新資料
export const updateInsertRushOrder = async (
  insertRushOrderList: InsertRushOrderList
): Promise<ApiRes> => {
  const resData = await ajax<null>(
    {
      url: '/api/insertRushOrder/importByExcelPreview',
      method: 'post',
      data: insertRushOrderList
    },
    {
      isFakeData: false,
      fakeData: {
        data: null,
        status: 'success'
      },
      delay: 300
    }
  )
  const { status, msg } = resData

  if (['success', true].includes(status)) {
    return { status: 'success', msg }
  } else {
    return { status: 'error', msg }
  }
}
