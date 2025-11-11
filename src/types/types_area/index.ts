export interface Params {
  areaId?: string
  areaName?: string
  areaCategory?: string
  parentNo?: string
  lastUpdateDate?: string
}

export interface ResponseData {
  areaId?: string
  areaName?: string
  areaCategory?: string
  parentNo?: string
  lastUpdateDate?: string
}

export interface ExcelData extends ResponseData {
  rowId?: string
}
export interface TableData extends ResponseData {
  rowId?: string
}
