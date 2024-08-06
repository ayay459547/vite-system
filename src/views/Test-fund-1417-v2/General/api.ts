import type { Api, ApiRes } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import { isEmpty } from '@/lib/lib_utils'
import { fakeTableData } from './fakeData'

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
  id?: string
  dayOfWeek: string
  positive: boolean

  startHour: string
  startMinutes: string
  endHour: string
  endMinutes: string
}

// 取得一週分配資料
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
      isFakeData: false,
      fakeData: {
        data: fakeTableData,
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

type PlanTime = {
  uuid?: string
  id?: string
  dayId?: number
  // 新增 | 修改 | 舊資料(無變更) | 刪除
  status?: 'new' | 'update' | 'old' | 'delete'

  start?: string
  startSecond?: number
  end?: string
  endSecond?: number
}
type PlanList = Array<PlanTime>

// 儲存一週分配資料
const planTimeFormat = (planTime: PlanTime): FormParams => {
  const { dayId, start, end } = planTime
  const [startHour = '', startMinutes = ''] = start.split(':')
  const [endHour = '', endMinutes = ''] = end.split(':')

  return {
    dayOfWeek: `${dayId}`,
    positive: true,

    startHour,
    startMinutes,
    endHour,
    endMinutes
  }
}
export const saveGeneralWeekSchedule = async (create: PlanList, update: PlanList, remove: PlanList): Promise<ApiRes> => {
  const resList = []
  // 刪除
  if (remove.length > 0) {
    const removeList: FormParams[] = remove.map(planTime => {
      return {
        id: planTime.id,
        ...planTimeFormat(planTime)
      }
    })

    const res = await ajax<Api<null>>(
      {
        url: '/workingTime/deleteGeneralWorkingTimes',
        method: 'post',
        data: removeList
      },
      {
        isFakeData: false,
        fakeData: {
          data: null,
          status: 'error',
          msg: 'deleteGeneralWorkingTimes'
        },
        isLog: false,
        delay: 300
      }
    )
    resList.push(res)
  }

  // 修改
  if (update.length > 0) {
    const updateList: FormParams[] = update.map(planTime => {
      return {
        id: planTime.id,
        ...planTimeFormat(planTime)
      }
    })

    const res = await ajax<Api<null>>(
      {
        url: '/workingTime/updateGeneralWorkingTimes',
        method: 'post',
        data: updateList
      },
      {
        isFakeData: false,
        fakeData: {
          data: null,
          status: 'error',
          msg: 'updateGeneralWorkingTimes'
        },
        isLog: false,
        delay: 300
      }
    )
    resList.push(res)
  }

  // 新增
  if (create.length > 0) {
    const createList: FormParams[] = create.map(planTime => {
      return planTimeFormat(planTime)
    })

    const res = await ajax<Api<null>>(
      {
        url: '/workingTime/addGeneralWorkingTimes',
        method: 'post',
        data: createList
      },
      {
        isFakeData: false,
        fakeData: {
          data: null,
          status: 'error',
          msg: 'addGeneralWorkingTimes'
        },
        isLog: false,
        delay: 300
      }
    )
    resList.push(res)
  }

  // 送回結果
  if (resList.length > 0) {
    const apiRes = resList.reduce((res, resData) => {
      const { status, msg } = resData

      if (!['success', true].includes(status)) {
        res.status = 'error'
      }

      if (!isEmpty(msg)) {
        res.msg.push(`${msg}`)
      }

      return res
    }, { status: 'success', msg: [] })

    return {
      status: apiRes.status,
      msg: apiRes.msg.join(' , ')
    }
  } else {
    return { status: 'success', msg: '' }
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
  const { status, msg, data } = resData

  if (['success', true].includes(status)) {
    return { status: 'success', data, msg }
  } else {
    return { status: 'error', data: true, msg }
  }
}
