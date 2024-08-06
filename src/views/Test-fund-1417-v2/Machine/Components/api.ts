import { formatDateTimeRange } from '@/lib/lib_format'

export interface Params {
  machineId: string
  machineName: string
  areaName: string
  machineNote: string
  isStartDate_horizontal_LAST_UPDATE_TIMESTAMP: string
  isEndDate_horizontal_LAST_UPDATE_TIMESTAMP: string
}

export interface ResponseData {
  machineId?: string
  machineName?: string
  areaName?: string
  machineNote?: string
  horizontal_LAST_UPDATE_TIMESTAMP?: string
  version?: number
  isDummy?: number
}

export interface ExcelData extends ResponseData {}
export interface TableData extends ResponseData {}

export const formatParams = (params: any): Params => {
  const {
    machineId = '',
    machineName = '',
    areaName = '',
    machineNote = '',
    horizontal_LAST_UPDATE_TIMESTAMP
  } = params

  return {
    machineId,
    machineName,
    areaName,
    machineNote,
    ...formatDateTimeRange('horizontal_LAST_UPDATE_TIMESTAMP', horizontal_LAST_UPDATE_TIMESTAMP)
  }
}

const formatData = (row: ResponseData): ExcelData | TableData => {
  const { machineId, machineName, areaName, machineNote, horizontal_LAST_UPDATE_TIMESTAMP } = row

  return {
    machineId,
    machineName,
    areaName,
    machineNote,
    horizontal_LAST_UPDATE_TIMESTAMP
  }
}

export const formatExcel = (row: ResponseData): ExcelData => {
  return formatData(row)
}

export const formatTable = (row: ResponseData): TableData => {
  return formatData(row)
}
