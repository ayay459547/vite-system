import { ajax } from '@/lib/lib_ajax'
import type { Options } from '@/components' // 系統組件
import { message } from '@/lib/lib_utils' // 工具

type ProcessItem = {
  id: string
}
type ProcessList = Array<ProcessItem>

export const getProcessList = async (query: string, size?: number): Promise<ProcessList> => {
  const resData = await ajax<ProcessList>(
    {
      url: '/api/Process/retrievefuzzyProcessId',
      method: 'get',
      params: {
        str: query ?? '',
        size: size ?? 30
      }
    },
    {
      isFakeData: false,
      fakeData: {
        data: [],
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
      message: msg ?? 'getProcessList Error',
      duration: 10000
    })
    return []
  }
}

export const getProcessIdList = async (query: string, size?: number): Promise<string[]> => {
  const resData = await ajax<ProcessList>(
    {
      url: '/api/Process/retrievefuzzyProcessId',
      method: 'get',
      params: {
        str: query ?? '',
        size: size ?? 30
      }
    },
    {
      isFakeData: false,
      fakeData: {
        data: [],
        status: 'success'
      },
      delay: 300
    }
  )
  const { status, msg, data } = resData

  if (['success', true].includes(status)) {
    return data.map(item => item.id)
  } else {
    message({
      type: 'error',
      message: msg ?? 'getProcessList Error',
      duration: 10000
    })
    return []
  }
}
export const getProcessIdOptions = async (query: string, size?: number): Promise<Options> => {
  const processIdList = await getProcessIdList(query, size)
  return processIdList.map(id => {
    return { label: id, value: id, data: id }
  })
}

type ProcessNameItem = {
  name: string
}
type ProcessNameList = Array<ProcessNameItem>

export const getProcessNameList = async (query: string, size?: number): Promise<string[]> => {
  const resData = await ajax<ProcessNameList>(
    {
      url: '/api/Process/retrievefuzzyProcessName',
      method: 'get',
      params: {
        str: query ?? '',
        size: size ?? 30
      }
    },
    {
      isFakeData: false,
      fakeData: {
        data: [],
        status: 'success'
      },
      delay: 300
    }
  )
  const { status, msg, data } = resData

  if (['success', true].includes(status)) {
    return data.map(item => item.name)
  } else {
    message({
      type: 'error',
      message: msg ?? 'getProcessNameList Error',
      duration: 10000
    })
    return []
  }
}
export const getProcessNameOptions = async (query: string, size?: number): Promise<Options> => {
  const processNameList = await getProcessNameList(query, size)
  return processNameList.map(name => {
    return { label: name, value: name, data: name }
  })
}
