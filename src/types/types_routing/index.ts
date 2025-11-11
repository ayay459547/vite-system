export interface Params {
  routeId: string
  operator_orderIndex: string
  select_orderIndex: number
  processId: string
  isStartDate_LAST_UPDATE_TIMESTAMP: string
  isEndDate_LAST_UPDATE_TIMESTAMP: string
}

export interface ResponseData {
  routeId?: string
  orderIndex?: number
  processId?: string
  routePhaseIndx?: number
  routePhase?: string
  LAST_UPDATE_TIMESTAMP?: string
}

export interface ExcelData extends ResponseData {
  rowId?: string
}
export interface TableData extends ResponseData {
  rowId?: string
}
