/* eslint-disable no-loss-of-precision */
import type { ResponseData } from './api'

export const fakeTableData: Array<ResponseData> = [
  {
    machineId: 'M10-1',
    areaName: '機台廠域A',
    sum: '1',
    machineNote: '停用'
  },
  {
    machineId: 'M10-2',
    areaName: '機台廠域B',
    sum: '0',
    machineNote: '待機'
  },
  {
    machineId: 'M10-3',
    areaName: '機台廠域C',
    sum: '2',
    machineNote: '待機'
  }
]
