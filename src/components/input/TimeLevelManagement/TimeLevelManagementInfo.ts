import type { PropType } from 'vue'
import type { PopoverProps } from '@/components'

export const version = '1.0.0'

export declare namespace Custom {
  type TimeLevelOption = {
    name: string // name of TimeLevel
    index: number // index of TimeLevel
    active?: boolean // TimeLevel is active or not
  }
}

export declare namespace Props {
  type TimeLevelOptions = Array<Custom.TimeLevelOption>
  type LevelIndex = number
  type LevelIndexs = Array<number> | null
  type Placement = PopoverProps.Placement
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
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
