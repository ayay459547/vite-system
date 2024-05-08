/* eslint-disable no-loss-of-precision */
import type { ResponseData } from './api'

export const fakeTableData: Array<ResponseData> = [
  {
    machineNo: 'M10-1',
    machineArea: '機台廠域A',
    count: '1',
    machineStatus: '停用'
  },
  {
    machineNo: 'M10-2',
    machineArea: '機台廠域B',
    count: '0',
    machineStatus: '待機'
  },
  {
    machineNo: 'M10-3',
    machineArea: '機台廠域C',
    count: '2',
    machineStatus: '待機'
  }
]
