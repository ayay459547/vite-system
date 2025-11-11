export interface Params {
  processId: string
  processName: string
  processGroup: string
  processNote: string
  isStartDate_lastUpdateDate: string
  isEndDate_lastUpdateDate: string
}

export interface ResponseData {
  processId?: string
  processName?: string
  processGroup?: string
  processNote?: string
  lastUpdateDate?: string
}

export interface ExcelData extends ResponseData {
  rowId?: string
}
export interface TableData extends ResponseData {
  rowId?: string
}
