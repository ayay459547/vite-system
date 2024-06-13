export interface Params {
  machineId: string
  areaName: string
  sum: string
  machineNote: string
}

interface CommonData {
  machineId: string
  areaName: string
  sum: string
  machineNote: string
}
export interface FilterData extends CommonData {}
export interface ResponseData extends CommonData {}
export interface TableData extends CommonData {}
export interface ExcelData extends CommonData {}

export const formatParams = (params: any): Params => {
  const { machineId = '', areaName = '', sum = '', machineNote = '' } = params

  return {
    machineId,
    areaName,
    sum,
    machineNote
  }
}

export const formatExcel = (row: ResponseData) => {
  const { machineId = '', areaName = '', sum = '', machineNote = '' } = row

  return {
    machineId,
    areaName,
    sum,
    machineNote
  }
}

export const formatTable = (row: ResponseData) => {
  const { machineId = '', areaName = '', sum = '', machineNote = '' } = row

  return {
    machineId,
    areaName,
    sum,
    machineNote
  }
}
