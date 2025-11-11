export interface Params {
  specId: string // 對應 Fund-202
  specName: string
  specContent: string
  specTypeId: string // 對應 Fund-201
  LAST_UPDATE_TIMESTAMP: string
}

export interface ResponseData {
  specId: string // 對應 Fund-202
  specName: string
  specContent: string
  specTypeId: string // 對應 Fund-201
  LAST_UPDATE_TIMESTAMP: string
}

export interface TableData extends ResponseData {}
export interface ExcelData extends ResponseData {}
