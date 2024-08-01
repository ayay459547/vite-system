import type { Api, ApiRes } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import type { RushOrders } from '../../api'

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
 * 取得機台列表 (已分配插單)
 * @param {String} erpNo 訂單
 * @returns {Array} options
 */
export const getPlanMachineList = async (
  erpNo: string
): Promise<ApiRes<PlanMachineList<RushOrders>>> => {
  const resData = await ajax<Api<PlanMachineList<PlanRushOrders>>>(
    {
      url: '/api/insertRushOrder/retrieveRushOrdersWithSpecificOrder',
      method: 'post',
      data: {
        erpNo
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
