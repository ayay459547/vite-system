import type { Api, ApiRes } from '@/declare/ajax.ts'
import { ajax } from '@/lib/lib_ajax.ts'
import type { RushOrders } from '../api'
import { columnSetting } from './columns'

export interface Params {
  id: string
  acquiredDate: string
  routeId: string
  isAlreadySetRushOrder: string
}

interface CommonData {
  id: string
  acquiredDate: string
  routeId: string
}
export interface FilterData extends CommonData {
  isAlreadySetRushOrder: string
}
export interface ResponseData extends CommonData {
  isAlreadySetRushOrder: string
}
export interface ExcelData extends CommonData {
  isAlreadySetRushOrder: string
}
export interface TableData extends CommonData {
  isAlreadySetRushOrder: string
}

export const formatParams = (params: any): Params => {
  const { id = '', acquiredDate = '', routeId = '', isAlreadySetRushOrder = '' } = params

  return {
    id,
    acquiredDate,
    routeId,
    isAlreadySetRushOrder
  }
}

export const formatExcel = (row: ResponseData) => {
  const { id = '', acquiredDate = '', routeId = '', isAlreadySetRushOrder = '' } = row

  return {
    id,
    acquiredDate,
    routeId,
    isAlreadySetRushOrder: columnSetting.isAlreadySetRushOrder.getValue(isAlreadySetRushOrder)
  }
}

export const formatTable = (row: ResponseData) => {
  const { id = '', acquiredDate = '', routeId = '', isAlreadySetRushOrder = '' } = row

  return {
    id,
    acquiredDate,
    routeId,
    isAlreadySetRushOrder: columnSetting.isAlreadySetRushOrder.getValue(isAlreadySetRushOrder)
  }
}

export type PlanRushOrders = Array<{
  pk: {
    sequence: number
    machineId: string
  }
  process: {
    pk: { id: string }
  }
  cust: {
    id: string
  }
  erpNo: string
  updateBy: string
}>
export type PlanMachineList<T> = Array<{
  machineId: string
  rushOrders: T
}>
/**
 * 使用 getRushOrderList 取代
 *
 * 廢棄
 * 取得機台列表 (已分配插單)
 * @param {String} lotNo 訂單
 * @returns {Array} options
 */
export const getPlanMachineList = async (
  lotNo: string
): Promise<ApiRes<PlanMachineList<RushOrders>>> => {
  const resData = await ajax<Api<PlanMachineList<PlanRushOrders>>>(
    {
      url: '/api/insertRushOrder/retrieveRushOrdersWithSpecificOrder',
      method: 'post',
      data: { erpNo: lotNo }
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
    return {
      status: 'success',
      data: data.map(item => {
        const { machineId, rushOrders } = item

        return {
          machineId,
          rushOrders: rushOrders.map(rushOrder => {
            const { pk, process, erpNo = '', updateBy = '' } = rushOrder

            return {
              sequence: pk?.sequence ?? 0,
              erpNo,
              processId: process?.pk?.id ?? '',
              memo: '',
              updateBy
            }
          })
        }
      }),
      msg
    }
  } else {
    return { status: 'error', data: [], msg }
  }
}
