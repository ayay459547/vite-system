import type { Api, ApiRes } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'

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

export const getGeneralWeekSchedule = async (): Promise<ApiRes<any[]>> => {
  // webfuno="fund_1417"
  // designatedview="iPASPWebView_fund_1417_gwt"
  const resData = await ajax<Api<any[]>>(
    {
      url: '/api/ipaspTable/retrieveIpaspTableFromView',
      method: 'post',
      data: {
        page: 1,
        size: -1,
        sortingMap: {},
        // webViewParams
        webfuno: 'fund_1417',
        designatedview: 'iPASPWebView_fund_1417_gwt'
      }
    },
    {
      isFakeData: true,
      fakeData: {
        data: [
          {
            CREATE_DATE: '2024-02-22 00:00:00.0',
            dayOfWeek: 1,
            sendToRTDs: false,
            startTime: '12:0',
            id: 3,
            endTime: '13:0',
            positive: false,
            LAST_UPDATE_TIMESTAMP: '2024-02-22 00:00:00.0'
          },
          {
            CREATE_DATE: '2024-02-22 00:00:00.0',
            dayOfWeek: 2,
            sendToRTDs: false,
            startTime: '18:20',
            id: 4,
            endTime: '19:30',
            positive: true,
            LAST_UPDATE_TIMESTAMP: '2024-02-22 00:00:00.0'
          },
          {
            CREATE_DATE: '2024-02-22 00:00:00.0',
            dayOfWeek: 7,
            sendToRTDs: true,
            startTime: '5:0',
            id: 5,
            endTime: '10:0',
            positive: true,
            LAST_UPDATE_TIMESTAMP: '2024-02-22 00:00:00.0'
          }
        ],
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

// delete
export const deleteData = async (rowData: TableData): Promise<ApiRes> => {
  const { id = '', dayOfWeek = 0, startTime = '', endTime = '' } = rowData

  const [startHour = '', startMinutes = ''] = startTime.split(':')
  const [endHour = '', endMinutes = ''] = endTime.split(':')

  const resData = await ajax<Api<null>>(
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

  if (['success', true].includes(status)) {
    return { status: 'success', msg }
  } else {
    return { status: 'error', msg }
  }
}

// RTDS
export const sendRTDS = async (): Promise<ApiRes> => {
  const resData = await ajax<Api<null>>(
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

  if (['success', true].includes(status)) {
    return { status: 'success', msg }
  } else {
    return { status: 'error', msg }
  }
}
// 是否需要送RTDS 資料有異動時 = true
export const getIsNeedSendRTDS = async (): Promise<ApiRes<boolean>> => {
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
  const { data, status, msg } = resData

  if (['success', true].includes(status)) {
    return { status: 'success', data, msg }
  } else {
    return { status: 'error', data: true, msg }
  }
}
