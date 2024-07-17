import type { PropType } from 'vue'

import type { PopoverProps } from '@/components'
import { props as inputProps } from '@/components/feature/CustomInput/CustomInputInfo'
import type { Conditions as _Conditions } from '@/declare/columnSetting'

export const version = '1.0.0'

export declare namespace Props {
  type ModelValue = any
  type Active = boolean
  type IsCondition = boolean
  type ColumnId = string
  type Conditions = _Conditions
  type Width = string | number
  type Placement = PopoverProps.Placement
  type Search = boolean
}

export const props = {
  modelValue: {
    type: [Array, String, Number, Boolean, null, undefined] as PropType<Props.ModelValue>,
    default: false,
    description: '綁定值 v-model="..." '
  },
  active: {
    type: Boolean as PropType<Props.Active>,
    default: true,
    description: `
      是否啟用
      是: 拿到顯示的值
      否: 拿到 null`
  },
  isCondition: {
    type: Boolean as PropType<Props.IsCondition>,
    required: false,
    default: false,
    description: '是否為條件搜尋'
  },
  columnId: {
    type: String as PropType<Props.ColumnId>,
    default: '',
    description: 'key'
  },
  conditions: {
    type: Array as PropType<Props.Conditions>,
    default () {
      return []
    },
    description: '條件搜尋列表'
  },
  width: {
    type: [String, Number] as PropType<Props.Width>,
    required: false,
    default: 300,
    description: '寬度'
  },
  placement: {
    type: String as PropType<Props.Placement>,
    required: false,
    default: 'top',
    description: '出現位置'
  },
  search: {
    type: Boolean as PropType<Props.Search>,
    required: false,
    default: false,
    description: '是否只顯示搜尋按鈕'
  },
  // 輸入框的 props
  ...inputProps
}
