import type { ApiRes, ViewParams } from '@/types/types_ajax'
import { ajax } from '@/lib/lib_ajax'
import { isEmpty } from '@/lib/lib_utils' // 工具
import { formatDatetime } from '@/lib/lib_format' // 格式化

import { columnSetting } from '../columns'
import productionFakeData from './fakeData.json'

export interface Params extends ViewParams {
  page: number
  size: number
  no: string
}

export type ResponseData = {
  wo: string
  sub_wo: string
  erpNo: string
  custNo: string
  bom_Id: string
  bom_ver: string
  no: string

  sequence: number
  process_id: string
  process_name: string
  status: number

  CREATE_DATE: string
  LAST_UPDATE_TIMESTAMP: string

  scheduledMachine_Id?: string

  reasons?: string
}

export type TableData = {
  wo: string
  sub_wo: string
  erpNo: string
  custNo: string
  bom_Id: string
  bom_ver: string
  no: string

  sequence: number
  process_id: string
  process_name: string
  status: string

  CREATE_DATE: string
  LAST_UPDATE_TIMESTAMP: string

  scheduledMachine_Id: string

  reasons: any
}

export const fakeTableData: ResponseData[] = []

export const getData = async (params: any): Promise<ApiRes<TableData[]>> => {
  const { no = '' } = params

  const resData = await ajax<ResponseData[] | TableData[]>(
    {
      url: '/api/PreviewSchedulingByProduction/getPreviewSchedulingByProduction',
      method: 'post',
      data: {
        page: 1,
        size: -1,
        no
      } as Params
    },
    {
      isFakeData: false,
      fakeData: {
        data: productionFakeData,
        status: 'success'
      },
      delay: 300
    }
  )
  const { status, msg, data } = resData

  if (['success', true].includes(status)) {
    return {
      status: 'success',
      data: (data as ResponseData[]).map(row => {
        const {
          wo, sub_wo, erpNo, custNo, bom_Id, bom_ver, no,
          sequence, process_id, process_name,

          status,
          CREATE_DATE,
          LAST_UPDATE_TIMESTAMP,

          scheduledMachine_Id,
          reasons
        } = row

        const regexp = /(\[){1}(.(?!,))*(',)(.(?!,))*(\])/g

        const _reasons = (reasons => {
          if (!isEmpty(reasons)) {
            const temp = reasons.match(regexp)

            return temp.map(str => {
              const [action, reason] = str.split(',')
              return {
                action: action.replace(/(\[|\]|')/g, ''),
                reason: reason.replace(/(\[|\]|')/g, '')
              }
            })
          } else {
            return []
          }
        })(reasons)

        return {
          wo, sub_wo, erpNo, custNo, bom_Id, bom_ver, no,
          sequence, process_id, process_name,

          status: columnSetting.status.getValue(status),
          CREATE_DATE,
          LAST_UPDATE_TIMESTAMP,

          scheduledMachine_Id,
          reasons: _reasons
        }
      }),
      msg
    }
  } else {
    return { status: 'error', data: [], msg }
  }
}

export type Filter = {
  custId: string
  machineId: string
  processId: string
}

export const getMpgp = async (params: any): Promise<ApiRes<any[]>> => {
  const resData = await ajax<any[]>(
    {
      url: '/machineDistribution/retrieveHasMpgp',
      method: 'post',
      data: {
        page: 1,
        size: -1,
        custId: '',
        machineId: '',
        processId: '',
        productDate_before: formatDatetime(new Date(), 'YYYY-MM-DDT00:00'),
        ...params
      }
    },
    {
      isFakeData: false,
      fakeData: {
        data: fakeTableData,
        status: 'success'
      },
      delay: 300
    }
  )
  const { status, msg, data } = resData

  if (['success', true].includes(status)) {
    return { status: 'success', data, msg }
  } else {
    return { status: 'error', data: [], msg }
  }
}
