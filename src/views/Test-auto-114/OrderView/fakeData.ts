/* eslint-disable no-loss-of-precision */
import type { ResponseData } from './api'

export const fakeTableData: Array<ResponseData> = [
  {
    id: 'ORDER-1',
    acquiredDate: '2024-02-06',
    routeId: 'R-01-A.0',
    isAlreadySetRushOrder: 'Y'
  },
  {
    id: 'ORDER-2',
    acquiredDate: '2024-02-06',
    routeId: 'R-01-A.0',
    isAlreadySetRushOrder: 'N'
  },
  {
    id: 'ORDER-3',
    acquiredDate: '2024-02-06',
    routeId: 'R-01-A.1',
    isAlreadySetRushOrder: 'Y'
  },
  {
    id: 'ORDER-4',
    acquiredDate: '2024-02-06',
    routeId: 'R-01-A.0',
    isAlreadySetRushOrder: 'Y'
  }
]
