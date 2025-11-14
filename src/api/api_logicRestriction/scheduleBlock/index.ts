import { ajax } from '@/lib/lib_ajax'
import { hasOwnProperty, message } from '@/lib/lib_utils'
import type { SettingMode, BlockTypes, SupportedSortingSettings } from '@/types/types_logicRestriction/scheduleBlock'
import { ScheduleBlockType } from '@/declare/declare_logicRestriction/enums'

const scheduleBlockUrl = {
  [ScheduleBlockType.Machine]: {
    tabs: '/scheduleBlock/getAllSettingMode',
    blocks: '/scheduleBlock/getAllBlockTypes',
    options: '/scheduleBlock/getSupportedSortingSettings'
  },
  [ScheduleBlockType.MergeMO]: {
    tabs: '/mergeMO/scheduleBlock/getAllSettingMode',
    blocks: '/mergeMO/scheduleBlock/getAllBlockTypes',
    options: '/mergeMO/scheduleBlock/getSupportedSortingSettings'
  },
  [ScheduleBlockType.Process]: {
    tabs: '/process/scheduleBlock/getAllSettingMode',
    blocks: '/process/scheduleBlock/getAllBlockTypes',
    options: '/process/scheduleBlock/getSupportedSortingSettings'
  },
  [ScheduleBlockType.OrderRelay]: {
    tabs: '/orderRelay/scheduleBlock/getAllSettingMode',
    blocks: '/orderRelay/scheduleBlock/getAllBlockTypes',
    options: '/orderRelay/scheduleBlock/getSupportedSortingSettings'
  }
}

/**
 * @description 取得所有可設定模式 (tabs)
 * @param type 類型
 * @returns {Array} 所有可設定模式(決定順序)
 */
export const getAllSettingMode = async (type: string = ''): Promise<SettingMode> => {
  let url = scheduleBlockUrl.machine.tabs // 預設
  if (hasOwnProperty(scheduleBlockUrl, type)) {
    url = scheduleBlockUrl[type].tabs
  }

  const resData = await ajax<SettingMode>(
    {
      url,
      method: 'get'
    },
    {
      isFakeData: false,
      fakeDataPath: '/api/api_logicRestriction/fakeData_AllSettingMode.json',
      fakeData: {
        data: [],
        status: 'success'
      },
      delay: 300
    }
  )
  const { data, status, msg } = resData

  if (['success', true].includes(status)) {
    return data
  } else {
    message({
      type: 'error',
      message: msg ?? `${type}: getAllSettingMode Error`,
      duration: 10000
    })
    return []
  }
}

/**
 * @description 取得所有可設定區塊 (tabs)
 * @param type 類型
 * @returns {Object} 所有可設定區塊
 */
export const getAllBlockTypes = async (type: string = ''): Promise<BlockTypes> => {
  let url = scheduleBlockUrl.machine.blocks // 預設
  if (hasOwnProperty(scheduleBlockUrl, type)) {
    url = scheduleBlockUrl[type].blocks
  }

  const resData = await ajax<BlockTypes>(
    {
      url,
      method: 'get'
    },
    {
      isFakeData: false,
      fakeDataPath: '/api/api_logicRestriction/fakeData_AllBlockTypes.json',
      fakeData: {
        data: {},
        status: 'success'
      },
      delay: 300
    }
  )
  const { data, status, msg } = resData

  if (['success', true].includes(status)) {
    return data
  } else {
    message({
      type: 'error',
      message: msg ?? `${type}: getAllBlockTypes Error`,
      duration: 10000
    })
    return {}
  }
}

/**
 * @description 取得所有可設定區塊 (tabs)
 * @param type 類型
 * @returns {Array} 所有可設定區塊
 */
export const getSupportedSortingSettings = async (type: string = ''): Promise<SupportedSortingSettings> => {
  let url = scheduleBlockUrl.machine.options // 預設
  if (hasOwnProperty(scheduleBlockUrl, type)) {
    url = scheduleBlockUrl[type].options
  }

  const resData = await ajax<SupportedSortingSettings>(
    {
      url,
      method: 'get'
    },
    {
      isFakeData: false,
      fakeDataPath: '/api/api_logicRestriction/fakeData_SupportedSortingSettings.json',
      fakeData: {
        data: [],
        status: 'success'
      },
      delay: 300
    }
  )
  const { data, status, msg } = resData

  if (['success', true].includes(status)) {
    return data
  } else {
    message({
      type: 'error',
      message: msg ?? `${type}: getSupportedSortingSettings Error`,
      duration: 10000
    })
    return []
  }
}
