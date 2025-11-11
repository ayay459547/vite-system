export interface Params {
  custName: string
  custId: string
  productGroupId: string
  productCategoryId: string
  custProductNo: string
  productId: string
}

export interface ResponseData {
  custName?: string
  custId?: string
  productGroupId?: string
  productCategoryId?: string
  custProductNo?: string
  productId?: string
}

export interface ExcelData extends ResponseData {
  rowId?: string
}
export interface TableData extends ResponseData {
  rowId?: string
}
