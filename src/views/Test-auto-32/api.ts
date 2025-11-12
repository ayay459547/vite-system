import { webViewFormat } from '@/lib/lib_format' // 格式化

export interface Params {
  erpNo: string
  // sequence: string
  operator_sequence: string
  select_sequence: string
  custDeviceNo: string
  bom_Id: string
  bom_ver: string
  isSchedule: string
  no: string
  isMultiple_severity: string[]

  operator_predeinedAmount: string
  select_predeinedAmount: string
  operator_quantityOfQualification: string
  select_quantityOfQualification: string

  cust: string
  custNo: string
  productGroup_Id: string
  process_name: string
  process_id: string
  scheduledMachine_Id: string
  // intOption_status: string
  isMultiple_status: string

  isStartDate_CREATE_DATE: string
  isEndDate_CREATE_DATE: string
  isStartDate_LAST_UPDATE_TIMESTAMP: string
  isEndDate_LAST_UPDATE_TIMESTAMP: string
  isStartDate_predefinedstartdatetime: string
  isEndDate_predefinedstartdatetime: string
  isStartDate_predefinedcompletedatetime: string
  isEndDate_predefinedcompletedatetime: string

  machine_areaName: string
  operator_numPriority: string
  select_numPriority: string

  isStartDate_moveInTime: string
  isEndDate_moveInTime: string
}

export interface ResponseData {
  id?: string
  wo?: string
  sub_wo?: string
  bom_Id?: string
  simpleName?: string
  predeinedAmount?: number
  quantityOfQualification?: number
  process_name?: string
  scheduledMachine_Id?: string
  predefinedstartdate?: string
  predefinedStartTime?: number
  predefinedstartdatetime?: string
  predefinedCompleteDate?: string
  predefinedCompleteTime?: number
  predefinedcompletedatetime?: string
  no?: string
  severity: string

  orderitem_indx?: number
  name?: string
  unit?: string
  cust?: string
  custNo?: string
  bom_ver?: string
  erpNo?: string
  sequence?: number
  status?: number
  productGroup_Id?: string
  process_id?: string
  machine_areaName?: string
  CREATE_DATE?: string
  LAST_UPDATE_TIMESTAMP?: string
  reasons?: string
  numPriority?: number
  custDeviceNo?: string
  isSchedule?: string
  moveInTime?: string
}

type OmitKey = 'predeinedAmount' | 'quantityOfQualification' | 'numPriority' | 'status'
export interface ExcelData extends Omit<ResponseData, OmitKey> {
  predeinedAmount: string
  quantityOfQualification: string
  numPriority: string
  status: string
}
export interface TableData extends Omit<ResponseData, OmitKey> {
  predeinedAmount: string
  quantityOfQualification: string
  numPriority: string
  status: string
}

export const formatParams = (params: any): Params => {
  const {
    erpNo = '',
    sequence = '',
    custDeviceNo = '',
    bom_Id = '',
    bom_ver = '',
    isSchedule = '',
    no = '',
    severity,

    predeinedAmount,
    quantityOfQualification,

    cust = '',
    custNo = '',
    productGroup_Id = '',
    process_name = '',
    process_id = '',
    scheduledMachine_Id = '',
    status,

    CREATE_DATE,
    LAST_UPDATE_TIMESTAMP,
    predefinedstartdatetime,
    predefinedCompleteDate,

    machine_areaName = '',
    numPriority,
    moveInTime
  } = params

  return {
    erpNo,
    // sequence,
    ...webViewFormat.operator('sequence', sequence),
    custDeviceNo,
    bom_Id,
    bom_ver,
    isSchedule,
    no,
    isMultiple_severity: severity,

    ...webViewFormat.operator('predeinedAmount', predeinedAmount),
    ...webViewFormat.operator('quantityOfQualification', quantityOfQualification),

    cust,
    custNo,
    productGroup_Id,
    process_name,
    process_id,
    scheduledMachine_Id,
    isMultiple_status: status,

    ...webViewFormat.dateTimeRange('CREATE_DATE', CREATE_DATE),
    ...webViewFormat.dateTimeRange('LAST_UPDATE_TIMESTAMP', LAST_UPDATE_TIMESTAMP),
    ...webViewFormat.dateTimeRange('predefinedstartdatetime', predefinedstartdatetime),
    ...webViewFormat.dateTimeRange('predefinedCompleteDate', predefinedCompleteDate),

    machine_areaName,
    ...webViewFormat.operator('numPriority', numPriority),
    ...webViewFormat.dateTimeRange('moveInTime', moveInTime)
  }
}
