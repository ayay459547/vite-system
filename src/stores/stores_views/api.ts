import { ajax } from '@/lib/lib_ajax'
import { message } from '@/lib/lib_utils' // 工具

type QTimeOptions = {
  unit: string[]
  boundType: string[]
  calculatedDesignatedPoint: string[]
}
const defaultQTimeOptions: QTimeOptions = {
  unit: [ 'YEARS', 'MONTHS', 'DAYS', 'HOURS', 'MINUTES', 'SECONDS', 'MILLISECONDS'],
  boundType: ['Inner', 'Outer'],
  calculatedDesignatedPoint: ['START_PRODUCE', 'END_PRODUCE']
}
export const getQTimeRetrieveColumnOptions = async (): Promise<QTimeOptions> => {
  const resData = await ajax<QTimeOptions>(
    {
      url: '/api/qtime/retrieveColumnOptions',
      method: 'get'
    },
    {
      isFakeData: false,
      fakeData: {
        data: defaultQTimeOptions,
        status: 'success'
      },
      delay: 300
    }
  )
  const { status, msg, data } = resData

  if (['success', true].includes(status)) {
    return data
  } else {
    message({
      type: 'error',
      message: msg ?? 'getQTimeRetrieveColumnOptions Error',
      duration: 10000
    })
    return defaultQTimeOptions
  }
}

type QTimeResetOptions = {
  unit: string[]
}
const defaultQTimeResetOptions: QTimeResetOptions = {
  unit: [ 'YEARS', 'MONTHS', 'DAYS', 'HOURS', 'MINUTES', 'SECONDS', 'MILLISECONDS']
}

export const getQTimeResetRetrieveColumnOptions = async (): Promise<QTimeResetOptions> => {
  const resData = await ajax<QTimeOptions>(
    {
      url: '/api/qtimereset/retrieveColumnOptions',
      method: 'get'
    },
    {
      isFakeData: false,
      fakeData: {
        data: defaultQTimeResetOptions,
        status: 'success'
      },
      delay: 300
    }
  )
  const { status, msg, data } = resData

  if (['success', true].includes(status)) {
    return data
  } else {
    message({
      type: 'error',
      message: msg ?? 'getQTimeResetRetrieveColumnOptions Error',
      duration: 10000
    })
    return defaultQTimeResetOptions
  }
}
