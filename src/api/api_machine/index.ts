import { ajax } from '@/lib/lib_ajax'
import type { Options } from '@/components' // 系統組件
import { message } from '@/lib/lib_utils' // 工具

type MachineItem = {
  id: string
  name: string
  note: string
  humansOfAMachine: number
  region: number
  presetTime: number
}
type MachineList = Array<MachineItem>

export const getMachineList = async (query: string, size?: number): Promise<MachineList> => {
  const resData = await ajax<MachineList>(
    {
      url: '/ma/machine/retrievefuzzyMachineId',
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
      message: msg ?? 'getMachineList Error',
      duration: 10000
    })
    return []
  }
}

export const getMachineIdList = async (query: string, size?: number): Promise<string[]> => {
  const machineList = await getMachineList(query, size)
  return machineList.map(row => row.id)
}
export const getMachineIdOptions = async (query: string, size?: number): Promise<Options> => {
  const machineList = await getMachineList(query, size)
  return machineList.map(row => {
    const { id } = row
    return { label: id, value: id, data: row }
  })
}

export const getMachineNameList = async (query: string, size?: number): Promise<string[]> => {
  const machineList = await getMachineList(query, size)
  return machineList.map(row => row.name)
}
export const getMachineNameOptions = async (query: string, size?: number): Promise<Options> => {
  const machineList = await getMachineList(query, size)
  return machineList.map(row => {
    const { name } = row
    return { label: name, value: name, data: row }
  })
}

type RetrieveMachinesFromOM2MParams = {
  afterDateStr?: string
  areaName?: string
  beforeDateStr?: string
  machineId?: string
  machineName?: string
  machineNote?: string

  showDummy?: string
  page?: number
  size?: number
}

type OM2MMachineItem = {
  dummyMachineForED: string
  note: string
  dummyMachineForOM: string
  lastVersion: any
  maxSite: number
  autoGeneratingId: boolean
  factoryNo: string
  presetTime: number
  humansOfAMachine: number
  lastUpdateTimestamp: string
  crossNoCapabilityContinueProduce: boolean
  internalUsage: boolean
  name: string
  hiberversion: number
  pk: {
    id: string
    version: number
  },
  region: {
    no: string
    lastVersion: any
    processes: null,
    lastUpdateTimestamp: string,
    autoGeneratingId: boolean
    name: string
    factoryNo: string
    hiberversion: number
    resourceLocations: any | null
    id: number
    category: {
      desc: string
      status: string
    },
    createDate: string
  },
  subMOWorkTime: number
  seq: string
  crossStopContinueProduce: boolean
  machineSchedulingType: any
  mark: {
    column: number
  }
  seq62: string
  createDate: string
}
type OM2MMachineList = Array<OM2MMachineItem>

export const getOM2MMachineList = async (params: RetrieveMachinesFromOM2MParams): Promise<OM2MMachineList> => {
  const resData = await ajax<OM2MMachineList>(
    {
      url: '/ma/machine/retrieveMachinesFromOM2M',
      method: 'post',
      data: {
        ...params,
        afterDateStr: '',
        areaName: '',
        beforeDateStr: '',
        machineId: '',
        machineName: '',
        machineNote: '',

        showDummy: 'false',
        page: 1,
        size: -1
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
      message: msg ?? 'getOM2MMachineList Error',
      duration: 10000
    })
    return []
  }
}

export const getOM2MMachineIdOptions = async (): Promise<Options> => {
  const machineList = await getOM2MMachineList({})
  return machineList.map(machineInfo => {
    const machineId = machineInfo.pk.id
    return { label: machineId, value: machineId }
  })
}


type RetrieveMachinesFromOM2MWebParams = {
  showDummy?: string
}
type OM2MWebMachineItem = {
  note: string
  lastUpdateTimestamp: string
  name: string
  pk: {
    id: string
  },
  region: {
    no: string
    name: string
  },
  category: string
}
type OM2MWebMachineList = Array<OM2MWebMachineItem>

export const getOM2MWebMachineList = async (params: RetrieveMachinesFromOM2MWebParams): Promise<OM2MWebMachineList> => {
  const resData = await ajax<OM2MWebMachineList>(
    {
      url: '/ma/machine/retrieveMachinesFromOM2MWeb',
      method: 'post',
      data: {
        ...params,
        showDummy: 'false'
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
      message: msg ?? 'getOM2MWebMachineList Error',
      duration: 10000
    })
    return []
  }
}
