import { ajax } from '@/lib/lib_ajax'
import type { Options } from '@/components' // 系統組件
import { message } from '@/lib/lib_utils' // 工具

type MaintainRestrictionTypeItem = {
  val: number
  cnName: string
  specification: boolean
  type: string
}
type MaintainRestrictionTypeList = Array<MaintainRestrictionTypeItem>

export const getMaintainRestrictionType = async (): Promise<MaintainRestrictionTypeList> => {
  const resData = await ajax<MaintainRestrictionTypeList>(
    {
      url: '/maintainRestrictionType/retrieveBelongSpec',
      method: 'get'
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

export const getMaintainRestrictionTypeOptions = async (): Promise<Options> => {
  const restrictionTypeList = await getMaintainRestrictionType()
  return restrictionTypeList.map(restrictionTypeItem => {
    const {
      // val,
      cnName,
      // specification,
      type
    } = restrictionTypeItem

    return {
      label: cnName,
      i18nLabel: `restriction-type-${type}`,
      value: type,
      data: restrictionTypeItem
    }
  })
}
