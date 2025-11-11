import type { PropType, Component } from 'vue'
import type { Dayjs } from 'dayjs'

import type { CustomSize } from '@/components' // 系統組件

export const version = '__FormTimePicker_1.0.0__'

export interface Types {
  baseValue: string | Date | null

  shortcut: {
    i18nLabel?: string
    label?: string
    text: string
    value: Date | (() => [Date, Date])
  }
}

export interface Props {
  type: 'time' | 'timerange'

  modelValue: Types['baseValue'] | [Types['baseValue'], Types['baseValue']]
  readonly: boolean
  disabled: boolean
  editable: boolean
  clearable: boolean
  size: CustomSize
  placeholder: string
  startPlaceholder: string
  endPlaceholder: string
  isRange: boolean
  arrowControl: boolean
  popperClass: string
  rangeSeparator: string
  format: string
  defaultValue: Date | [Date, Date]
  valueFormat: string
  id: string | [string, string]
  name: string | any
  ariaLabel: string
  prefixIcon: string | Component
  clearIcon: string | Component
  disabledHours: (role: string, comparingDate?: Dayjs) => number[]
  disabledMinutes: (hour: number, role: string, comparingDate?: Dayjs) => number[]
  disabledSeconds: (hour: number, minute: number, role: string, comparingDate?: Dayjs) => number[]
  teleported: boolean
  tabindex: string | number
  emptyValues: Array<any>
  valueOnClear: string | number | boolean | Function
}
export const props = {
  // custom
  type: {
    type: String as PropType<Props['type']>,
    required: false,
    default: 'time',
    description: '顯示類型'
  },
  // element ui plus
  modelValue: {
    type: [Array, String, null] as PropType<Props['modelValue']>,
    required: false,
    default: '',
    description: '綁定值 v-model="..." '
  },
  readonly: {
    type: Boolean as PropType<Props['readonly']>,
    required: false,
    default: false,
    description: '原生 readonly 屬性, 是否唯讀'
  },
  disabled: {
    type: Boolean as PropType<Props['disabled']>,
    required: false,
    default: false,
    description: '是否禁用'
  },
  editable: {
    type: Boolean as PropType<Props['editable']>,
    required: false,
    default: true,
    description: '文字方塊可輸入'
  },
  clearable: {
    type: Boolean as PropType<Props['clearable']>,
    required: false,
    default: true,
    description: '是否顯示清除按鈕'
  },
  size: {
    type: String as PropType<Props['size']>,
    required: false,
    default: undefined,
    description: '輸入框尺寸'
  },
  placeholder: {
    type: String as PropType<Props['placeholder']>,
    required: false,
    default: undefined,
    description: '非範圍選擇時的佔位內容'
  },
  startPlaceholder: {
    type: String as PropType<Props['startPlaceholder']>,
    required: false,
    default: undefined,
    description: '範圍選擇時開始日期的佔位內容'
  },
  endPlaceholder: {
    type: String as PropType<Props['endPlaceholder']>,
    required: false,
    default: undefined,
    description: '範圍選擇時結束日期的佔位內容'
  },
  isRange: {
    type: Boolean as PropType<Props['isRange']>,
    required: false,
    default: undefined,
    description: '是否為時間範圍選擇'
  },
  arrowControl: {
    type: Boolean as PropType<Props['arrowControl']>,
    required: false,
    default: false,
    description: '是否使用箭頭進行時間選擇'
  },
  popperClass: {
    type: String as PropType<Props['popperClass']>,
    required: false,
    default: '',
    description: 'class'
  },
  rangeSeparator: {
    type: String as PropType<Props['rangeSeparator']>,
    required: false,
    default: '~',
    description: '選擇範圍時的分隔符'
  },
  format: {
    type: String as PropType<Props['format']>,
    required: false,
    default: 'HH:mm:ss',
    description: `
      顯示格式化
      https://day.js.org/docs/en/display/format#list-of-all-available-formats
    `
  },
  defaultValue: {
    type: [String, Object] as PropType<Props['defaultValue']>,
    required: false,
    default: undefined,
    description: '可選，選擇器開啟時預設顯示的時間'
  },
  valueFormat: {
    type: String as PropType<Props['valueFormat']>,
    required: false,
    default: 'HH:mm:ss',
    description: `
      資料格式化
      https://day.js.org/docs/en/display/format#list-of-all-available-formats
    `
  },
  id: {
    type: [String, Array] as PropType<Props['id']>,
    required: false,
    default: undefined,
    description: '原生 name 屬性'
  },
  name: {
    type: String as PropType<Props['name']>,
    required: false,
    default: undefined,
    description: '原生 name 屬性'
  },
  ariaLabel: {
    type: String as PropType<Props['ariaLabel']>,
    required: false,
    default: undefined,
    description: '等價於原生 input aria-label 屬性 (a11y)'
  },
  prefixIcon: {
    type: [String, Object] as PropType<Props['prefixIcon']>,
    required: false,
    default: undefined,
    description: '自訂前綴圖示 如果 type的值是TimeLikeType，那就是 Clock，不然就是 Calendar'
  },
  clearIcon: {
    type: [String, Object] as PropType<Props['clearIcon']>,
    required: false,
    default: undefined,
    description: '自訂清除圖示'
  },
  disabledHours: {
    type: Function as PropType<Props['disabledHours']>,
    required: false,
    default: undefined,
    description: '禁止選擇部分小時選項'
  },
  disabledMinutes: {
    type: Function as PropType<Props['disabledMinutes']>,
    required: false,
    default: undefined,
    description: '禁止選擇部分分鐘選項'
  },
  disabledSeconds: {
    type: Function as PropType<Props['disabledSeconds']>,
    required: false,
    default: undefined,
    description: '禁止選擇部分秒選項'
  },
  teleported: {
    type: Boolean as PropType<Props['teleported']>,
    required: false,
    default: true,
    description: '是否將 date-picker 的下拉清單插入至 body'
  },
  tabindex: {
    type: [String, Number] as PropType<Props['tabindex']>,
    required: false,
    default: 0,
    description: '輸入框的 tabindex'
  },
  emptyValues: {
    type: Array as PropType<Props['emptyValues']>,
    required: false,
    default: () => {
      return [
        undefined, null, '', [],
        [undefined, undefined], [null, null], ['', '']
      ]
    },
    description: '組件的空值配置 參考 Config Provider'
  },
  valueOnClear: {
    type: [String, Number, Boolean, Function] as PropType<Props['valueOnClear']>,
    required: false,
    default: null,
    description: '組件的空值配置 參考 Config Provider'
  }
}

export interface Emits {
  change: (val: Props['modelValue']) => void
  blur: (e: FocusEvent) => void
  focus: (e: FocusEvent) => void
  clear: () => void
  visibleChange: (visibility: boolean) => void
}

export interface Expose {
  focus: () => void
  blur: () => void
  handleOpen: () => void
  handleClose: () => void
}

