export interface Params {
  id: string
  name: string
  content: string
  specTypeId: string
  LAST_UPDATE_TIMESTAMP: string
}

export interface ResponseData {
  id: string
  name: string
  content: string
  specTypeId: string
  LAST_UPDATE_TIMESTAMP: string
}

export interface TableData extends ResponseData {
  rowId: string
}
export interface ExcelData extends ResponseData {
  rowId: string
}
