export interface Params {
  id: string
  name: string
  dataType: string
}

export interface ResponseData {
  id: string
  name: string
  dataType: string
}

export interface ExcelData extends ResponseData {
  rowId: string
}
export interface TableData extends ResponseData {
  rowId: string
}
