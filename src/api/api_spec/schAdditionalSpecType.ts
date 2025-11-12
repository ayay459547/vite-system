import { ajax } from '@/lib/lib_ajax'
import type { Options } from '@/components' // 系統組件
import { message } from '@/lib/lib_utils' // 工具

type SchAdditionalSpecTypeItem = {
  id: string
  cnName: string
}
type SchAdditionalSpecTypeList = Array<SchAdditionalSpecTypeItem>

export const getSchAdditionalSpecType = async (): Promise<SchAdditionalSpecTypeList> => {
  const resData = await ajax<SchAdditionalSpecTypeList>(
    {
      url: '/api/schAdditionalSpecType/retrieveBindableBsAspectForWeb',
      method: 'get'
    },
    {
      isFakeData: false,
      fakeData: {
        data: [
          { cnName: '製程內機台換線', id: 'MachineProcessChangeLine' },
          { cnName: '製程內機台生產限制', id: 'MachineProcessProductionConstraint' },
          // { cnName: '合併限制', id: 'MergeConstraint' },
          { cnName: '機台合併限制', id: 'MachineMergeConstraint' },
          { cnName: '機型合併限制', id: 'MachineCategoryMergeConstraint' },
          { cnName: '清機時機', id: 'MachineCleanTiming' }
        ],
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

export const getSchAdditionalSpecTypeOptions = async (): Promise<Options> => {
  const schAdditionalSpecTypeList = await getSchAdditionalSpecType()
  return schAdditionalSpecTypeList.map(schAdditionalSpecTypeItem => {
    const { id, cnName } = schAdditionalSpecTypeItem

    return {
      label: cnName,
      i18nLabel: `schAdditionalSpecType-${id}`,
      value: id,
      data: schAdditionalSpecTypeItem
    }
  })
}
