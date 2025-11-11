import type { PropType } from 'vue'

import type { CustomPopoverProps, CustomIconProps } from '@/components/feature' // 系統組件: 功能
import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'

export const version = '1.0.0'

export interface Types {
  timeLevelOption: {
    name: string // name of TimeLevel
    index: number // index of TimeLevel
    active?: boolean // TimeLevel is active or not
    label?: string
    i18nLabel?: string
    value?: string

    [key: string]: any
  }
}

export interface Props {
  timeLevelOptions: Array<Types['timeLevelOption']>
  levelIndex: number
  levelIndexs: Array<number> | null
  placement: CustomPopoverProps['placement']
  iconSize: CustomIconProps['size']
  i18nModule: ScopeKey
}

export const props = {
  options: {
    type: Array as PropType<Props['timeLevelOptions']>,
    require: true,
    description: '可用的時間維度選項'
  },
  baseLevelIndex: {
    type: Number as PropType<Props['levelIndex']>,
    required: true,
    description: '用來當基準的時間維度'
  },
  activeLevelIndexs: {
    type: [ Array, null ] as PropType<Props['levelIndexs']>,
    description: `
      現在使用中的時間維度
      如果有設置activeLevelIndexs的話
      則不會使用option中的active
    `
  },
  placement: {
    type: String as PropType<Props['placement']>,
    default: 'left-start'
  },
  iconSize: {
    type: String as PropType<Props['iconSize']>,
    default: 'small'
  },
  i18nModule: {
    type: String as PropType<Props['i18nModule']>,
    required: false,
    default: defaultModuleType,
    description: 'label, options 使用 i18nLabel 時套用的翻譯模組'
  }
}

export interface Emits {}

export interface Expose {}
