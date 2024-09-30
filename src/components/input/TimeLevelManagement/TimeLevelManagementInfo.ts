import type { PropType } from 'vue'

import type { CustomPopoverProps, CustomIconProps } from '@/components'
import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'

export const version = '1.0.0'

export declare namespace Types {
  type TimeLevelOption = {
    name: string // name of TimeLevel
    index: number // index of TimeLevel
    active?: boolean // TimeLevel is active or not
    label?: string
    i18nLabel?: string
    value?: string

    [key: string]: any
  }
}

export declare namespace Props {
  type TimeLevelOptions = Array<Types.TimeLevelOption>
  type LevelIndex = number
  type LevelIndexs = Array<number> | null
  type Placement = CustomPopoverProps.Placement
  type IconSize = CustomIconProps.Size
  type I18nModule = ScopeKey
}

export const props = {
  options: {
    type: Array as PropType<Props.TimeLevelOptions>,
    require: true,
    description: '可用的時間維度選項'
  },
  baseLevelIndex: {
    type: Number as PropType<Props.LevelIndex>,
    required: true,
    description: '用來當基準的時間維度'
  },
  activeLevelIndexs: {
    type: [ Array, null ] as PropType<Props.LevelIndexs>,
    description: `
      現在使用中的時間維度
      如果有設置activeLevelIndexs的話
      則不會使用option中的active
    `
  },
  placement: {
    type: String as PropType<Props.Placement>,
    default: 'left-start'
  },
  iconSize: {
    type: String as PropType<Props.IconSize>,
    default: 'small'
  },
  i18nModule: {
    type: String as PropType<Props.I18nModule>,
    required: false,
    default: defaultModuleType,
    description: 'label, options 使用 i18nLabel 時套用的翻譯模組'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
