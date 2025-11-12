import { ajax } from '@/lib/lib_ajax'
import type { Options } from '@/components' // 系統組件
import { message } from '@/lib/lib_utils' // 工具

type ProcessItem = {
  processId: string
  processName: string
  routeIndex: number
}
type ProcessList = Array<ProcessItem>

export const getProcessListByRouteId = async (routeId: string, size?: number): Promise<ProcessList> => {
  const resData = await ajax<ProcessList>(
    {
      url: '/route/retrievefuzzyProcessByRouteId',
      method: 'get',
      params: {
        str: routeId ?? '',
        size: size ?? -1
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
    const processSet = new Set()

    return data.reduce((res, item) => {
      const { processId, routeIndex } = item
      const setKey = `${processId}-${routeIndex}`

      // 確保資料不重複
      if (!processSet.has(setKey)) {
        res.push(item)
      }
      processSet.add(setKey)
      return res
    }, [])
  } else {
    message({
      type: 'error',
      message: msg ?? 'getProcessList Error',
      duration: 10000
    })
    return []
  }
}

export const getProcessIdOptions = async (routeId: string, size?: number): Promise<Options> => {
  const processIdList = await getProcessListByRouteId(routeId, size)
  return processIdList.map(item => {
    const { processId } = item
    return { label: processId, value: processId, data: item }
  })
}
export const getProcessNameOptions = async (routeId: string, size?: number): Promise<Options> => {
  const processIdList = await getProcessListByRouteId(routeId, size)
  return processIdList.map(item => {
    const { processName } = item
    return { label: processName, value: processName, data: item }
  })
}

export const getRouteIndexOptions = async (routeId: string, size?: number): Promise<Options> => {
  const processIdList = await getProcessListByRouteId(routeId, size)
  return processIdList.map(item => {
    const { processId, routeIndex } = item
    return { label: `${routeIndex}. ${processId}`, value: routeIndex, data: item }
  })
}
