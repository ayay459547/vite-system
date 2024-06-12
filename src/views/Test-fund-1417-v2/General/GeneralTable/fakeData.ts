import type { ResponseData } from './api'

export const fakeTableData: Array<ResponseData> = [
  {
    CREATE_DATE: '2024-02-22 00:00:00.0',
    dayOfWeek: 1,
    sendToRTDs: false,
    startTime: '13:0',
    id: 3,
    endTime: '12:0',
    positive: false,
    LAST_UPDATE_TIMESTAMP: '2024-02-22 00:00:00.0'
  },
  {
    CREATE_DATE: '2024-02-22 00:00:00.0',
    dayOfWeek: 2,
    sendToRTDs: false,
    startTime: '19:20',
    id: 4,
    endTime: '18:30',
    positive: true,
    LAST_UPDATE_TIMESTAMP: '2024-02-22 00:00:00.0'
  },
  {
    CREATE_DATE: '2024-02-22 00:00:00.0',
    dayOfWeek: 7,
    sendToRTDs: true,
    startTime: '10:0',
    id: 5,
    endTime: '5:0',
    positive: true,
    LAST_UPDATE_TIMESTAMP: '2024-02-22 00:00:00.0'
  }
]
