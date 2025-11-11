export type ClassCodeType = '' | 'Arrived' | 'EngineeringWip' | 'Reserved' | 'Wip'

export interface Params {
  id: string
  custDeviceNo: string
  bomId: string
  bomRevision: string
  classCode: ClassCodeType
  custName: string
  customerId: string
  productGroupId: string
  status: '' | 'Created' | 'iPaspOrderGenerated' | 'Close'

  isStartDate_acquiredDate: string
  isEndDate_acquiredDate: string
  isStartDate_createDate: string
  isEndDate_createDate: string
  isStartDateTime_lastUpdateTimestamp: string
  isEndDateTime_lastUpdateTimestamp: string

  operator_numPriority: string
  select_numPriority: string
}

export interface ResponseData {
  id?: string
  custDeviceNo: string
  bomId?: string
  bomRevision?: string
  classCode?: ClassCodeType
  custName?: string
  customerId?: string
  productGroupId?: string
  status?: '' | 'Created' | 'iPaspOrderGenerated' | 'Close'

  acquiredDate?: string
  createDate?: string
  lastUpdateTimestamp?: string
  numPriority?: number
}

type OmitKey = 'classCode'
export interface ExcelData extends Omit<ResponseData, OmitKey> {
  rowId: string
  classCode: string
}
export interface TableData extends Omit<ResponseData, OmitKey> {
  rowId: string
  classCode: string
}
