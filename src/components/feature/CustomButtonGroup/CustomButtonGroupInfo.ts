import type { PropType } from 'vue'

import type { CustomButtonProps } from '@/components'

export const version = '__CustomButtonGroup_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  type Size = CustomButtonProps.Size
  type Type = CustomButtonProps.Type
}
export const props = {
  size: {
    type: String as PropType<Props.Size>,
    required: false,
    default: undefined,
    description: '尺寸'
  },
  type: {
    type: String as PropType<Props.Type>,
    required: false,
    default: undefined,
    description: '類型'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
