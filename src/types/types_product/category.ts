export interface Params {
  productCategoryId: string
  productCategoryName: string
  factoryNo: string
}

export interface ResponseData {
  productCategoryId?: string
  productCategoryName?: string
  factoryNo?: string
}

export interface ExcelData extends ResponseData {
  rowId?: string
}
export interface TableData extends ResponseData {
  rowId?: string
}
