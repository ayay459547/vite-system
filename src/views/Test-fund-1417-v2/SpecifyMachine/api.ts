import type { Api, ApiRes } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import { formatDateTimeRange } from '@/lib/lib_format'

export interface Params {
  machine_Id: string
  type: number

  isStartDate_startDateTime: string
  isEndDate_startDateTime: string
  isStartDate_endDateTime: string
  isEndDate_endDateTime: string
}

interface CommonData {
  id: number
  machine_Id: string
  startDateTime: string
  endDateTime: string
  note: string
}

export interface ResponseData extends Partial<CommonData> {
  CREATE_DATE?: string
  LAST_UPDATE_TIMESTAMP?: string

  type?: number
  machine_Ver?: number

  positive?: boolean
  sendToRTDs?: boolean
  mark?: number
}

export interface TableData extends CommonData {
  type: string
}
export interface ExcelData extends TableData {}

export const formatParams = (params: any): Params => {
  const { machine_Id = '', type = '', startDateTime = ['', ''], endDateTime = ['', ''] } = params

  const formatType = (value: any) => {
    switch (value) {
      case 'overtime':
        return 0
      case 'holiday_overtime':
        return 1
      case 'maintain':
        return 2
      default:
        return null
    }
  }

  return {
    machine_Id,
    type: formatType(type),
    ...formatDateTimeRange('startDateTime', startDateTime),
    ...formatDateTimeRange('endDateTime', endDateTime)
  }
}

const formatData = (row: ResponseData): ExcelData | TableData => {
  const { id, startDateTime, endDateTime, type, note, machine_Id } = row

  const formatType = (value: any) => {
    switch (value) {
      case 0:
        return 'overtime'
      case 1:
        return 'holiday_overtime'
      case 2:
        return 'maintain'
      default:
        return ''
    }
  }

  return {
    id,
    startDateTime,
    endDateTime,
    type: formatType(type),
    note,
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
  endMinutes: string
  positive: boolean

  startDateTimeStr: string
  endDateTimeStr: string
  machine: { pk: { id: string } }
  type: string
  note: string
}
export type DeleteParams = { id: string } & FormParams

// delete
export const deleteData = async (rowData: TableData): Promise<ApiRes> => {
  const {
    id = '',
    startDateTime = '',
    endDateTime = '',
    machine_Id = '',
    type = '',
    note = ''
  } = rowData

  const resData = await ajax<Api<any>>(
    {
      url: '/workingTime/deleteSpecifyMachineWorkingTimes',
      method: 'post',
      data: [
        {
          endMinutes: '0',
          positive: false,

          id: `${id}`,
          startDateTimeStr: startDateTime,
          endDateTimeStr: endDateTime,
          machine: {
            pk: { id: machine_Id }
          },
          type,
          note
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
      url: '/RTDtest/t10',
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
      url: '/workingTime/checkSpecifyIsDataNotSend2RTDs',
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
  const { status, msg, data } = resData

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
  const { status, msg, data } = resData

  if (['success', true].includes(status)) {
    return { status: 'success', data, msg }
  } else {
    return { status: 'error', data: [], msg }
  }
}
