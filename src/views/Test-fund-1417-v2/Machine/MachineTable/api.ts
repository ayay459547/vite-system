import type { Api, ApiRes } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'

export interface Params {
  dayOfWeek: string
  machine_Id: string
}

interface CommonData {
  id: number
  machine_Id: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface ResponseData extends Partial<CommonData> {
  machine_Ver?: number

  CREATE_DATE?: string
  LAST_UPDATE_TIMESTAMP?: string

  positive?: boolean
  sendToRTDs?: boolean
  mark?: number
}

export interface TableData extends CommonData {}
export interface ExcelData extends CommonData {}

export const formatParams = (params: any): Params => {
  const { dayOfWeek = '', machine_Id = '' } = params

  return {
    dayOfWeek,
    machine_Id
  }
}

const formatData = (row: ResponseData): ExcelData | TableData => {
  const { id, dayOfWeek, startTime, endTime, machine_Id } = row

  return {
    id,
    dayOfWeek,
    startTime,
    endTime,
    machine_Id
  }
}

export const formatExcel = (row: ResponseData): ExcelData => {
  return formatData(row)
}

export const formatTable = (row: ResponseData): TableData => {
  return formatData(row)
}

// 送出 api 需要參數
export type FormParams = {
  machine: { pk: { id: string } }
  dayOfWeek: string
  positive: boolean

  startHour: string
  startMinutes: string
  endHour: string
  endMinutes: string
}
export type DeleteParams = { id: string } & FormParams

// delete
export const deleteData = async (rowData: TableData): Promise<ApiRes> => {
  const { id = '', machine_Id = '', dayOfWeek = 0, startTime = '', endTime = '' } = rowData

  const [startHour = '', startMinutes = ''] = startTime.split(':')
  const [endHour = '', endMinutes = ''] = endTime.split(':')

  const resData = await ajax<Api<any>>(
    {
      url: '/workingTime/deleteMachineWorkingTimes',
      method: 'post',
      data: [
        {
          id: `${id}`,
          machine: {
            pk: { id: machine_Id }
          },
          dayOfWeek: `${dayOfWeek}`,
          positive: true,

          startHour,
          startMinutes,
          endHour,
          endMinutes
        }
      ] as DeleteParams[]
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

// RTDS
export const sendRTDS = async (): Promise<ApiRes> => {
  const resData = await ajax<Api<any>>(
    {
      url: '/RTDtest/t12',
      method: 'get'
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

export const getIsNeedSendRTDS = async (): Promise<ApiRes<boolean>> => {
  const resData = await ajax<Api<boolean>>(
    {
      url: '/workingTime/checkMachineWorkingTimeIsDataNotSend2RTDs',
      method: 'get'
    },
    {
      isFakeData: false,
      fakeData: {
        data: true,
        status: 'success'
      },
      delay: 300
    }
  )
  const { data, status, msg } = resData

  if (['success', true].includes(status)) {
    return { status: 'success', data, msg }
  } else {
    return { status: 'error', data: false, msg }
  }
}

// machine
export const getMachineList = async (queryString: string): Promise<ApiRes<any[]>> => {
  const resData = await ajax<Api<any[]>>(
    {
      url: '/ma/machine/retrievefuzzyMachineId',
      method: 'get',
      params: {
        str: queryString,
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
  const { data, status, msg } = resData

  if (['success', true].includes(status)) {
    return { status: 'success', data, msg }
  } else {
    return { status: 'error', data: [], msg }
  }
}
