/* eslint-disable no-loss-of-precision */
import type { ResponseData } from './api'

export const fakeTableData: Array<ResponseData> = [
  {
    orderId: 'ORDER-1',
    demandDate: '2024-02-06',
    routeId: 'R-01-A.0',
    isSettingsRushOrder: true
  },
  {
    orderId: 'ORDER-2',
    demandDate: '2024-02-06',
    routeId: 'R-01-A.0',
    isSettingsRushOrder: false
  },
  {
    orderId: 'ORDER-3',
    demandDate: '2024-02-06',
    routeId: 'R-01-A.1',
    isSettingsRushOrder: true
  },
  {
    orderId: 'ORDER-4',
    demandDate: '2024-02-06',
    routeId: 'R-01-A.0',
    isSettingsRushOrder: true
  }
]
