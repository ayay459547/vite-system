import { ajax } from '@/lib/lib_ajax'
import { swal } from '@/lib/lib_utils' // 工具

import dayjs from 'dayjs'
import { orderDetailTime, machineStateTime } from './fakeDetailTime'

export type TimePointInfo = {
  moveInTime: string
  checkInTime: string
  startTime: string
  endTime: string
  checkOutTime: string
  moveOutTime: string
  preProcessTimestamp: string
  postProcessTimestamp: string
  transferStartTime: string
  // transferFinishTime: string
}

type GetParams_MODetailTime = {
  orderId: string
  processId:string
}
export type TimeUnit = [ start:string, end:string ]
export type TimeInfo = {
  moveInTime: string
  checkInTime: string
  startTime: string
  endTime: string
  checkOutTime: string
  moveOutTime: string
  preProcessStartTime?: string
  preProcessTimestamp: string
  postProcessFinishTime?: string
  postProcessTimestamp: string
  transferStartTime: string
  transferFinishTime: string
  detailTime: Record<string, Array<TimeUnit>>
}

export type DetailTimeInfo = Record<string, Array<TimeUnit>>

export const getMODetailTime = async (orderId: string, processId: string): Promise<TimeInfo> => {
  const inputParam: GetParams_MODetailTime = { orderId, processId }

  const resData = await ajax<TimeInfo>(
    {
      url: 'recieveMOItemFromRTD/MOItem/retrieveDetailTimeByOrderIdAndProcessId',
      method: 'GET',
      params: inputParam
    },
    {
      isFakeData: false,
      fakeData: {
        data: orderDetailTime,
        status: 'success'
      },
      delay: 300
    }
  )
  const { data, status, msg } = resData

  if (status !== 'success') {
    swal({
      icon: 'error',
      title: '查詢細部工時失敗',
      text: msg ?? '請聯絡資訊人員',
      showCancelButton: false
    })
    return null
  }
  else return data // formatData(data)
}


type PostData_MahineStateTime = {
  machineId?: string, // MachineIdArray.join(',')
  machineName?: string, // MachineNameArray.join(',')
  start: string // YYYY-MM-DD HH:mm:ss
  end: string // YYYY-MM-DD HH:mm:ss
}

export type MachineStateTimeUnit = {
  start: string
  end: string
  note?: string
}
export type MachineStateTimeInfo = {
  machineId: string
  machineName?: string
  maintenacne?: Array<MachineStateTimeUnit>
  shutdown?: Array<MachineStateTimeUnit>
}

export const getMahineStateTime = async (machineId: string, timeRange: [string, string]) => {
  const [ start, end ] = timeRange
  const inputData: PostData_MahineStateTime = {
    machineId,
    start: dayjs(start).format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs(end).format('YYYY-MM-DD HH:mm:ss')
  }

  const resData = await ajax<Array<MachineStateTimeInfo>>(
    {
      url: 'ganttChart2/getMachineStatusNewGanttChartByParam',
      method: 'POST',
      data: inputData
    },
    {
      isFakeData: false,
      fakeData: {
        data: machineStateTime,
        status: 'success'
      },
      delay: 300
    }
  )
  const { data, status, msg } = resData
  if (status !== 'success') {
    swal({
      icon: 'error',
      title: '查詢機台狀態失敗',
      text: msg ?? '請聯絡資訊人員',
      showCancelButton: false
    })
    return []
  }
  else return data // formatData(data)
}
