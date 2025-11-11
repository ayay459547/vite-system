export interface Params {
  machineId: string
  machineName: string
  areaNo: string
  areaName: string
  machineNote: string
  isStartDate_horizontal_LAST_UPDATE_TIMESTAMP: string
  isEndDate_horizontal_LAST_UPDATE_TIMESTAMP: string
}

export interface ResponseData {
  machineId?: string
  machineName?: string
  areaNo?: string
  areaName?: string
  machineNote?: string
  horizontal_LAST_UPDATE_TIMESTAMP?: string
  version?: number
  isDummy?: number
  hasWorkingTime?: number | string
}

export interface ExcelData extends ResponseData {
  rowId?: string
}
export interface TableData extends ResponseData {
  rowId?: string
}
