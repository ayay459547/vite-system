export interface Params {
  custNo: string
  custName: string
  factoryNo: string
}

export interface ResponseData {
  custNo?: string
  custName?: string
  factoryNo?: string
}

export interface ExcelData extends ResponseData {
  rowId?: string
}
export interface TableData extends ResponseData {
  rowId?: string
}
