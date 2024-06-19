import type { Api, ApiRes } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import { isEmpty } from '@/lib/lib_utils'
import type { Options } from '@/components'
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
  machine_Id?: string
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
  machine: {
    pk: { id: string }
  },
  dayOfWeek: string
  positive: boolean

  startHour: string
  startMinutes: string
  endHour: string
  endMinutes: string
}
export type DeleteParams = { id: string } & FormParams

export const getMachineIdWeekSchedule = async (machineId: string): Promise<ApiRes<any[]>> => {
  if (isEmpty(machineId)) return { status: 'success', data: [], msg: '' }

  // webfuno="fund_1417"
  // designatedview="iPASPWebView_fund_1417_mwt"
  const resData = await ajax<Api<any[]>>(
    {
      url: '/api/ipaspTable/retrieveIpaspTableFromView',
      method: 'post',
      data: {
        machine_Id: machineId,
        page: 1,
        size: -1,
        sortingMap: {},
        // webViewParams
        webfuno: 'fund_1417',
        designatedview: 'iPASPWebView_fund_1417_mwt'
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
  const { data, status, msg } = resData

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
const planTimeFormat = (planTime: PlanTime, machineId: string): FormParams => {
  const { dayId, start, end } = planTime
  const [startHour = '', startMinutes = ''] = start.split(':')
  const [endHour = '', endMinutes = ''] = end.split(':')

  return {
    machine: {
      pk: { id: machineId }
    },
    dayOfWeek: `${dayId}`,
    positive: true,

    startHour,
    startMinutes,
    endHour,
    endMinutes
  }
}
export const saveMachineIdWeekSchedule = async (create: PlanList, update: PlanList, remove: PlanList, machineId: string): Promise<ApiRes> => {
  const resList = []
  // 刪除
  if (remove.length > 0) {
    const removeList: FormParams[] = remove.map(planTime => {
      return {
        id: planTime.id,
        ...planTimeFormat(planTime, machineId)
      }
    })

    const res = await ajax<Api<null>>(
      {
        url: '/workingTime/deleteMachineWorkingTimes',
        method: 'post',
        data: removeList
      },
      {
        isFakeData: false,
        fakeData: {
          data: null,
          status: 'error',
          msg: 'deleteMachineWorkingTimes'
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
        ...planTimeFormat(planTime, machineId)
      }
    })

    const res = await ajax<Api<null>>(
      {
        url: '/workingTime/updateMachineWorkingTimes',
        method: 'post',
        data: updateList
      },
      {
        isFakeData: false,
        fakeData: {
          data: null,
          status: 'error',
          msg: 'updateMachineWorkingTimes'
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
      return planTimeFormat(planTime, machineId)
    })

    const res = await ajax<Api<null>>(
      {
        url: '/workingTime/addMachineWorkingTimes',
        method: 'post',
        data: createList
      },
      {
        isFakeData: false,
        fakeData: {
          data: null,
          status: 'error',
          msg: 'addMachineWorkingTimes'
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
// 是否需要送RTDS 資料有異動時 = true
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
    return { status: 'error', data: true, msg }
  }
}

// 取得機台編號
export const getMachineOptions = async (): Promise<ApiRes<Options>> => {
  const resData = await ajax<Api<Array<{ pk: { id: string } }>>>(
    {
      // baseURL: '/rt-aps-rest',
      url: '/ma/machine/retrieveMachinesFromOM2MWeb',
      method: 'post',
      data: {
        showDummy: 'true'
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
  const { status, data, msg } = resData

  if (['success', true].includes(status)) {
    return {
      status: 'success',
      data: data.map(machineInfo => {
        const machineId = machineInfo.pk.id

        return { label: machineId, value: machineId, data: machineInfo }
      }),
      msg
    }
  } else {
    return { status: 'error', data: [], msg }
  }
}
