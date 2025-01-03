import type { PropType } from 'vue'

import type { CustomPopoverProps } from '@/components' // 系統組件
import { props as inputProps } from '@/components/input/CustomInput/CustomInputInfo'
import type { Conditions as _Conditions } from '@/declare/columnSetting'

export const version = '__CustomSearch_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  type ModelValue = any
  type Active = boolean
  type IsCondition = boolean
  type ColumnId = string
  type Conditions = _Conditions
  type AllowConditions = string[]
  type Width = string | number
  type Placement = CustomPopoverProps.Placement
  type Search = boolean
}

export const props = {
  // 輸入框的 props
  ...inputProps,
  // custom
  columnId: {
    type: String as PropType<Props.ColumnId>,
    required: false,
    default: '',
    description: 'key'
  },
  modelValue: {
    type: [Array, String, Number, Boolean, null, undefined] as PropType<Props.ModelValue>,
    required: false,
    default: false,
    description: 'v-model="..." '
  },
  active: {
    type: Boolean as PropType<Props.Active>,
    required: false,
    default: true,
    description: ` v-model:active="..."
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
  activeConditions: {
    type: Boolean as PropType<Props.Active>,
    required: false,
    default: false,
    description: 'v-model:active-conditions="..." , 是否啟用條件搜尋 checkbox'
  },
  conditions: {
    type: Array as PropType<Props.Conditions>,
    required: false,
    default: () => {
      return []
    },
    description: 'v-model:conditions="..." , 條件搜尋列表'
  },
  allowConditions: {
    type: Array as PropType<Props.AllowConditions>,
    required: false,
    default: () => {
      return []
    },
    description: '允許使用的條件 api'
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
    default: 'bottom',
    description: '出現位置'
  },
  search: {
    type: Boolean as PropType<Props.Search>,
    required: false,
    default: false,
    description: '是否只顯示搜尋按鈕'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
