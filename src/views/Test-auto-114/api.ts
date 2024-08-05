import type { Api, ApiRes, ViewParams } from '@/declare/ajax.ts'
import { ajax } from '@/lib/lib_ajax'
import type { Options } from '@/components'

/**
 * 取得製程列表
 * @param {String} machineId 機台
 * @param {String} processId 製程
 * @param {String} lotNo 訂單
 * @returns {Array} options
 */
export const getProcessList = async (
  machineId: string,
  processId: string,
  lotNo: string,
  disabledList: string[]
): Promise<ApiRes<Options>> => {
  const resData = await ajax<Api<string[]>>(
    {
      url: '/api/insertRushOrder/getRushOrderRelatedProcessListByFilter',
      method: 'post',
      data: {
        machineId,
        processId,
        lotNo,
        size: 30
      }
    },
    {
      isFakeData: false,
      fakeData: {
        data: ['T100', 'Q100', 'E300'],
        status: 'success'
      },
      delay: 300
    }
  )

  const { status, msg, data } = resData
  if (['success', true].includes(status)) {
    return {
      status: 'success',
      data: data.map(processId => {
        return {
          label: processId,
          value: processId,
          disabled: disabledList.includes(`${processId}_${lotNo}`)
        }
      }),
      msg
    }
  } else {
    return { status: 'error', data: [], msg }
  }
}

/**
 * 取得訂單資訊
 * @param {String} processId 製程
 * @param {String} lotNo 訂單
 * @returns {Array} options
 */
export const getErpNoList = async (
  processId: string,
  lotNo: string,
  disabledList: string[]
): Promise<ApiRes<Options>> => {
  const resData = await ajax<Api<string[]>>(
    {
      url: '/api/insertRushOrder/getRushOrderListByFilter',
      method: 'post',
      data: {
        processId,
        lotNo,
        size: 30
      }
    },
    {
      isFakeData: false,
      fakeData: {
        data: ['PF0712401021', 'PF2772311001', 'PF2772312001'],
        status: 'success'
      },
      delay: 300
    }
  )

  const { status, msg, data } = resData

  if (['success', true].includes(status)) {
    return {
      status: 'success',
      data: data.map(lotNo => {
        return {
          label: lotNo,
          value: lotNo,
          disabled: disabledList.includes(`${processId}_${lotNo}`)
        }
      }),
      msg
    }
  } else {
    return { status: 'error', data: [], msg }
  }
}

/**
 * 取得機台列表 (機台對應製程)
 * @param {String} processId 製程
 * @param {String} machineId 機台
 * @param {Array} selectedMachineList 已選擇的機台
 * @returns {Array} options
 */
export const getMachineList = async (
  processId: string,
  machineId: string,
  selectedMachineList?: string[]
): Promise<ApiRes<Options>> => {
  const resData = await ajax<Api<string[]>>(
    {
      url: '/ma/machine/getCanBeAssigndMachineList',
      method: 'post',
      data: {
        processId,
        machineId,
        /**
         * 0: 不是 Dummy 機台
         * 1: 是 Dummy 機台
         * 無: 都有
         */
        isDummy: 0,
        size: 30
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
      data: data.map(machineId => {
        const isDisabled = Array.isArray(selectedMachineList)
          ? selectedMachineList.includes(machineId)
          : false

        return {
          label: machineId,
          value: machineId,
          disabled: isDisabled
        }
      }),
      msg
    }
  } else {
    return { status: 'error', data: [], msg }
  }
}

export interface Params extends ViewParams {
  erpNo?: string
  machine_Id?: string
  sequence?: string
  process_Id?: string
  LAST_UPDATE_TIMESTAMP?: string
  updateBy?: string
  cust_id?: string
}

export interface RushOrder {
  erpNo: string
  machine_Id: string
  sequence: string
  process_Id: string
  LAST_UPDATE_TIMESTAMP: string
  updateBy: string
  cust_id: string
}

/**
 * 取得插單列表
 * @param machine 機台
 * @param lotNo 訂單
 * @returns {Array} 機台下插單列表
 */
export const getRushOrderList = async (
  machine: string,
  lotNo?: ''
): Promise<ApiRes<RushOrder[]>> => {
  const resData = await ajax<Api<RushOrder[]>>(
    {
      url: '/api/ipaspTable/retrieveIpaspTableFromView',
      method: 'post',
      data: {
        erpNo: lotNo,
        machine_Id: machine,
        // sequence: '',
        // process_Id: '',
        // LAST_UPDATE_TIMESTAMP: '',
        // updateBy: '',
        // cust_id: '',
        sortingMap: {
          machine_Id: 'Asc',
          sequence: 'Asc'
        },
        webfuno: 'auto_114',
        designatedview: 'iPASPWebView_auto_114_machine_setting'
      } as Params
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
    return { status: 'success', data, msg }
  } else {
    return { status: 'error', data: [], msg }
  }
}

export type RushOrders = Array<{
  sequence: number
  erpNo: string
  // custId?: string
  processId: string
  memo?: string
  updateBy: string
}>
export type RushOrderData = Array<{
  machineId: string
  rushOrders: RushOrders
  updateBy: string
}>

/**
 * 網頁插單
 * @param {Array} rushOrderData 插單資料
 * @returns {String} success | error
 */
export const rushOrderFromWeb = async (rushOrderData: RushOrderData): Promise<ApiRes> => {
  console.log('reportData => ', rushOrderData)
  const resData = await ajax<Api<any>>(
    {
      // url: '/api/insertRushOrder/importByExcelPreview',
      url: '/api/insertRushOrder/saveRushOrderSettings',
      method: 'post',
      data: rushOrderData
    },
    {
      isFakeData: false,
      fakeData: {
        data: null,
        status: 'error'
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
