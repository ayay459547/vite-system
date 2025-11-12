import { ajax } from '@/lib/lib_ajax'
import type { Options } from '@/components' // 系統組件
import { message } from '@/lib/lib_utils' // 工具

type Machine2ProcessItem = {
  machineId: string
  machineName: string
  processId: string
  processName: string
}
type Machine2ProcessList = Array<Machine2ProcessItem>

type GetMachine2ProcessOptions = {
  type?: string | 'machine' | 'process'
  processId?: string // type === machine: 一定要給 processId(製程對應機台=>查詢機台)
  machineId?: string // type === process: 一定要給 machineId(製程對應機台=>查詢製程)
  page?: string | number
  size?: string | number
}

export const getMachine2ProcessList = async (options: GetMachine2ProcessOptions): Promise<Machine2ProcessList> => {
  const {
    type = 'machine',
    processId = '',
    machineId = '',
    page = 1,
    size = 30
  } = options ?? {}

  const resData = await ajax<Machine2ProcessList>(
    {
      url: '/machine2Process/retrievefuzzyMachine2ProcessTypeId',
      method: 'get',
      params: {
        type,
        processId,
        machineId,
        page,
        size
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
    return data
  } else {
    message({
      type: 'error',
      message: msg ?? 'getMachine2ProcessList Error',
      duration: 10000
    })
    return []
  }
}

/**
 * @description 取得機台對應製程的選項
 * options.type = 'machine' => 返回 options 是機台
 * options.type = 'process' => 返回 options 是製程
 * @param {GetMachine2ProcessOptions} options 設定
 * @returns {Options} 選項
 */
export const getMachine2ProcessIdOptions = async (options: GetMachine2ProcessOptions): Promise<Options> => {
  const machine2ProcessList = await getMachine2ProcessList(options)
  return machine2ProcessList.map(row => {
    const { machineId, processId } = row
    const value = options.type === 'machine' ? machineId : processId
    return { label: value, value, data: row }
  })
}
export const getMachine2ProcessNameOptions = async (options: GetMachine2ProcessOptions): Promise<Options> => {
  const machine2ProcessList = await getMachine2ProcessList(options)
  return machine2ProcessList.map(row => {
    const { machineName, processName } = row
    const value = options.type === 'machine' ? machineName : processName
    return { label: value, value, data: row }
  })
}
