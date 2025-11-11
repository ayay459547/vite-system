import type {
  Params as CommonParams,
  ResponseData as CommonResponseData
} from './index'

export interface Params extends CommonParams {
  orderId: string
}
export interface ResponseData extends CommonResponseData {
  orderId: string
}
export interface TableData extends ResponseData {
  rowId: string
}
export interface ExcelData extends ResponseData {
  rowId: string
}
