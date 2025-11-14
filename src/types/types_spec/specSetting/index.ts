export interface Params {
  specId: string
  specName: string
  specContent: string
  specTypeId: string
  LAST_UPDATE_TIMESTAMP: string
}

export interface ResponseData {
  specId: string
  specName: string
  specContent: string
  specTypeId: string
  LAST_UPDATE_TIMESTAMP: string
}

export interface TableData extends ResponseData {}
export interface ExcelData extends ResponseData {}
