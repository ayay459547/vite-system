import type { Api, ApiRes, ViewParams } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import { fakeGanttData } from './fakeData'

export interface Params extends ViewParams {
  moId: string
  moiId: string
  moiIndex: string
  statusStr: string

  productId: string
  productName: string
  processId: string
  processName: string

  machineId: string
  machineName: string

  startDate: string
  endDate: string
}

export type ResponseData = {
  moId: string
  moiId: string
  moiIndex: string
  status: number
  statusStr: string

  productId: string
  productName: string
  processId: string
  processName: string

  machineId: string
  machineName: string

  startDate: string
  endDate: string

  bomVersion: string
  predeinedAmount: number

  orderIds: string
}

export type TableData = {
  moId: string
  moiId: string
  moiIndex: string
  status: number
  statusStr: string

  productId: string
  productName: string
  processId: string
  processName: string

  machineId: string
  machineName: string

  startDate: string
  endDate: string

  bomVersion: string
  predeinedAmount: number

  orderIds: string
}

// table
export const getData = async (params: any): Promise<ApiRes<TableData[]>> => {
  const {
    moId = '',
    moiId = '',
    moiIndex = '',
    status: _status = '',
    productId = '',
    productName = '',
    processId = '',
    processName = '',
    machineId = '',
    machineName = '',
    timeRange = []
  } = params

  const [startDate, endDate] = Array.isArray(timeRange) ? timeRange : ['', '']

  const resData = await ajax<Api<ResponseData[] | TableData[]>>(
    {
      url: '/ganttChart2/getGanttChartByParam',
      method: 'post',
      data: {
        moId,
        moiId,
        moiIndex,
        productId,
        statusStr: _status,
        productName,
        processId,
        processName,
        machineId,
        machineName,

        startDate,
        endDate
      } as Params
    },
    {
      isFakeData: false,
      fakeData: {
        data: fakeGanttData,
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
