import type { PropType } from 'vue'

import type { PopoverPlacement } from '@/components'
import { props as inputProps } from '@/components/feature/CustomInput/CustomInputInfo'

export const version = '1.0.0'

export type ModelValue = any

export const props = {
  modelValue: {
    type: [Array, String, Number, Boolean, null, undefined] as PropType<ModelValue>,
    default: false,
    description: '綁定值 v-model="..." '
  },
  active: {
    type: Boolean as PropType<boolean>,
    default: true,
    description: `
      是否啟用
      是: 拿到顯示的值
      否: 拿到 null`
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    required: false,
    default: 300,
    description: '寬度'
  },
  placement: {
    type: String as PropType<PopoverPlacement>,
    required: false,
    default: 'top',
    description: '出現位置'
  },
  search: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否只顯示搜尋按鈕'
  },
  // 輸入框的 props
  ...inputProps
}
