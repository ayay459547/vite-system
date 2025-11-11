import type { MaintainRestrictionType2DataType } from '@/types/types_logicRestriction/restrictions'
import { getMaintainRestrictionType2DataType } from '@/api/api_logicRestriction/restrictions'
import { isEmpty } from '@/lib/lib_utils'
// import type { Options } from '@/components'

// 動態取得欄位
interface DynamicColumn extends MaintainRestrictionType2DataType {
  label: string
  i18nLabel?: string
  dynamicColumnType: string | 'restrictionType' | 'specType'
  value: string
}

// 取得動態欄位資訊
export const getDynamicColumns = async (maintainRestrictionType: string): Promise<DynamicColumn[]> => {
  const maintainRestrictionType2DataType = await getMaintainRestrictionType2DataType(maintainRestrictionType)

  const formatData = (rowData: MaintainRestrictionType2DataType): DynamicColumn => {
    const {
      specType = null,
      restrictionType,
      restrictionTypeAttr
    } = rowData

    // 規格
    const isSpecType = !isEmpty(specType)
    if (isSpecType) return {
      ...rowData,
      label: specType.name,
      i18nLabel: `specType-${specType.id}`, // 開規格專用 i18n
      dynamicColumnType: 'specType',
      value: restrictionTypeAttr.id
    }

    // 一般動態欄位
    return {
      ...rowData,
      label: rowData.restrictionType.cnName,
      i18nLabel: `restrictionType-${restrictionType.type}`,
      dynamicColumnType: 'restrictionType',
      value: restrictionTypeAttr.id
    }
  }

  return maintainRestrictionType2DataType.map(formatData)
}
