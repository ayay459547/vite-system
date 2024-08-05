import type { Api } from '@/declare/ajax.ts'
import { ajax } from '@/lib/lib_ajax'
import { swal } from '@/lib/lib_utils'

export interface Params {
  dayOfWeek: string
}

interface CommonData {
  id: number
  startTime: string
  endTime: string
}

export interface ResponseData extends Partial<CommonData> {
  dayOfWeek?: number

  CREATE_DATE?: string
  LAST_UPDATE_TIMESTAMP?: string

  positive?: boolean
  sendToRTDs?: boolean
  mark?: number
}

export interface TableData extends CommonData {
  dayOfWeek: string
}

export interface ExcelData extends TableData {}

export const formatParams = (params: any): Params => {
  const { dayOfWeek = '' } = params

  return {
    dayOfWeek
  }
}

const formatData = (row: ResponseData): ExcelData | TableData => {
  const { id, dayOfWeek = '', startTime, endTime } = row

  return {
    id,
    dayOfWeek: `${dayOfWeek}`,
    startTime,
    endTime
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
  dayOfWeek: string
  positive: boolean

  startHour: string
  startMinutes: string
  endHour: string
  endMinutes: string
}
export type DeleteParams = { id: string } & FormParams

// delete
export const deleteData = async (rowData: TableData): Promise<string | boolean> => {
  const { id = '', dayOfWeek = 0, startTime = '', endTime = '' } = rowData

  const [startHour = '', startMinutes = ''] = startTime.split(':')
  const [endHour = '', endMinutes = ''] = endTime.split(':')

  const resData = await ajax<Api<any>>(
    {
      url: '/workingTime/deleteGeneralWorkingTimes',
      method: 'post',
      data: [
        {
          id: `${id}`,
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

  if (status !== 'success') {
    swal({
      icon: 'error',
      title: '刪除資料失敗',
      text: msg ?? '請聯絡資訊人員',
      showCancelButton: false
    })
  }

  return status
}

// RTDS
export const sendRTDS = async (): Promise<string | boolean> => {
  const resData = await ajax<Api<any>>(
    {
      url: '/RTDtest/t11',
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

  if (status !== 'success') {
    swal({
      icon: 'error',
      title: '記錄修改失敗',
      text: msg ?? '請聯絡資訊人員',
      showCancelButton: false
    })
  }

  return status
}

export const getIsNeedSendRTDS = async (): Promise<boolean> => {
  const resData = await ajax<Api<boolean>>(
    {
      url: '/workingTime/checkGeneralWorkingTimeIsDataNotSend2RTDs',
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

  if (status === 'success') {
    return data
  } else {
    swal({
      icon: 'error',
      title: '取得資料失敗',
      text: msg ?? '請聯絡資訊人員',
      showCancelButton: false
    })
    return false
  }
}
