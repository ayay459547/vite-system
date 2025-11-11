import type { PropType } from 'vue'

import type { CustomPopoverProps } from '@/components/feature' // 系統組件: 功能
import { props as inputProps } from '@/components/input/CustomInput/CustomInputInfo'
import type { Conditions as _Conditions } from '@/types/types_columnSetting'

export const version = '__CustomSearch_1.0.0__'

export interface Types {}

export interface Props {
  modelValue: any
  active: boolean
  isCondition: boolean
  activeConditions: boolean
  columnId: string
  conditions: _Conditions
  allowConditions: string[]
  width: string | number
  placement: CustomPopoverProps['placement']
  search: boolean
}

export const props = {
  // 輸入框的 props
  ...inputProps,
  // custom
  columnId: {
    type: String as PropType<Props['columnId']>,
    required: false,
    default: '',
    description: 'key'
  },
  modelValue: {
    type: [Array, String, Number, Boolean, null, undefined] as PropType<Props['modelValue']>,
    required: false,
    default: false,
    description: 'v-model="..." '
  },
  active: {
    type: Boolean as PropType<Props['active']>,
    required: false,
    default: true,
    description: ` v-model:active="..."
      是否啟用
      是: 拿到顯示的值
      否: 拿到 null`
  },
  isCondition: {
    type: Boolean as PropType<Props['isCondition']>,
    required: false,
    default: false,
    description: '是否為條件搜尋'
  },
  activeConditions: {
    type: Boolean as PropType<Props['activeConditions']>,
    required: false,
    default: false,
    description: 'v-model:active-conditions="..." , 是否啟用條件搜尋 checkbox'
  },
  conditions: {
    type: Array as PropType<Props['conditions']>,
    required: false,
    default: () => {
      return []
    },
    description: 'v-model:conditions="..." , 條件搜尋列表'
  },
  allowConditions: {
    type: Array as PropType<Props['allowConditions']>,
    required: false,
    default: () => {
      return []
    },
    description: '允許使用的條件 api'
  },
  width: {
    type: [String, Number] as PropType<Props['width']>,
    required: false,
    default: 300,
    description: '寬度'
  },
  placement: {
    type: String as PropType<Props['placement']>,
    required: false,
    default: 'bottom',
    description: '出現位置'
  },
  search: {
    type: Boolean as PropType<Props['search']>,
    required: false,
    default: false,
    description: '是否只顯示搜尋按鈕'
  }
}

export interface Emits {}

export interface Expose {}
