import type { PropType, Component } from 'vue'
import type { Dayjs } from 'dayjs'

import type { CustomSize } from '@/components' // 系統組件

export const version = '__FormTimePicker_1.0.0__'

export declare namespace Types {
  type BaseValue = string | Date | null

  type Shortcut = {
    i18nLabel?: string
    label?: string
    text: string
    value: Date | (() => [Date, Date])
  }
}

export declare namespace Props {
  type Type = 'time' | 'timerange'

  type ModelValue = Types.BaseValue | [Types.BaseValue, Types.BaseValue]
  type Readonly = boolean
  type Disabled = boolean
  type Editable = boolean
  type Clearable = boolean
  type Size = CustomSize
  type Placeholder = string
  type StartPlaceholder = string
  type EndPlaceholder = string
  type IsRange = boolean
  type ArrowControl = boolean
  type PopperClass = string
  type RangeSeparator = string
  type Format = string
  type DefaultValue = Date | [Date, Date]
  type ValueFormat = string
  type Id = string | [string, string]
  type Name = string | any
  type AriaLabel = string
  type PrefixIcon =  string | Component
  type ClearIcon = string | Component
  type DisabledHours = (role: string, comparingDate?: Dayjs) => number[]
  type DisabledMinutes = (hour: number, role: string, comparingDate?: Dayjs) => number[]
  type DisabledSeconds = (hour: number, minute: number, role: string, comparingDate?: Dayjs) => number[]
  type Teleported = boolean
  type Tabindex = string | number
  type EmptyValues = Array<any>
  type ValueOnClear = string | number | boolean | Function
}
export const props = {
  // custom
  type: {
    type: String as PropType<Props.Type>,
    required: false,
    default: 'time',
    description: '顯示類型'
  },
  // element ui plus
  modelValue: {
    type: [Array, String, null] as PropType<Props.ModelValue>,
    required: false,
    default: '',
    description: '綁定值 v-model="..." '
  },
  readonly: {
    type: Boolean as PropType<Props.Readonly>,
    required: false,
    default: false,
    description: '原生 readonly 屬性, 是否唯讀'
  },
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    required: false,
    default: false,
    description: '是否禁用'
  },
  editable: {
    type: Boolean as PropType<Props.Editable>,
    required: false,
    default: true,
    description: '文字方塊可輸入'
  },
  clearable: {
    type: Boolean as PropType<Props.Clearable>,
    required: false,
    default: true,
    description: '是否顯示清除按鈕'
  },
  size: {
    type: String as PropType<Props.Size>,
    required: false,
    default: undefined,
    description: '輸入框尺寸'
  },
  placeholder: {
    type: String as PropType<Props.Placeholder>,
    required: false,
    default: undefined,
    description: '非範圍選擇時的佔位內容'
  },
  startPlaceholder: {
    type: String as PropType<Props.StartPlaceholder>,
    required: false,
    default: undefined,
    description: '範圍選擇時開始日期的佔位內容'
  },
  endPlaceholder: {
    type: String as PropType<Props.EndPlaceholder>,
    required: false,
    default: undefined,
    description: '範圍選擇時結束日期的佔位內容'
  },
  isRange: {
    type: Boolean as PropType<Props.IsRange>,
    required: false,
    default: undefined,
    description: '是否為時間範圍選擇'
  },
  arrowControl: {
    type: Boolean as PropType<Props.ArrowControl>,
    required: false,
    default: false,
    description: '是否使用箭頭進行時間選擇'
  },
  popperClass: {
    type: String as PropType<Props.PopperClass>,
    required: false,
    default: '',
    description: 'class'
  },
  rangeSeparator: {
    type: String as PropType<Props.RangeSeparator>,
    required: false,
    default: '-',
    description: '選擇範圍時的分隔符'
  },
  format: {
    type: String as PropType<Props.Format>,
    required: false,
    default: 'HH:mm:ss',
    description: `
      顯示格式化
      https://day.js.org/docs/en/display/format#list-of-all-available-formats
    `
  },
  defaultValue: {
    type: [String, Object] as PropType<Props.DefaultValue>,
    required: false,
    default: undefined,
    description: '可選，選擇器開啟時預設顯示的時間'
  },
  valueFormat: {
    type: String as PropType<Props.ValueFormat>,
    required: false,
    default: 'HH:mm:ss',
    description: `
      資料格式化
      https://day.js.org/docs/en/display/format#list-of-all-available-formats
    `
  },
  id: {
    type: [String, Array] as PropType<Props.Id>,
    required: false,
    default: undefined,
    description: '原生 name 屬性'
  },
  name: {
    type: String as PropType<Props.Name>,
    required: false,
    default: undefined,
    description: '原生 name 屬性'
  },
  ariaLabel: {
    type: String as PropType<Props.AriaLabel>,
    required: false,
    default: undefined,
    description: '等價於原生 input aria-label 屬性 (a11y)'
  },
  prefixIcon: {
    type: [String, Object] as PropType<Props.PrefixIcon>,
    required: false,
    default: undefined,
    description: '自訂前綴圖示 如果 type的值是TimeLikeType，那就是 Clock，不然就是 Calendar'
  },
  clearIcon: {
    type: [String, Object] as PropType<Props.ClearIcon>,
    required: false,
    default: undefined,
    description: '自訂清除圖示'
  },
  disabledHours: {
    type: Function as PropType<Props.DisabledHours>,
    required: false,
    default: undefined,
    description: '禁止選擇部分小時選項'
  },
  disabledMinutes: {
    type: Function as PropType<Props.DisabledMinutes>,
    required: false,
    default: undefined,
    description: '禁止選擇部分分鐘選項'
  },
  disabledSeconds: {
    type: Function as PropType<Props.DisabledSeconds>,
    required: false,
    default: undefined,
    description: '禁止選擇部分秒選項'
  },
  teleported: {
    type: Boolean as PropType<Props.Teleported>,
    required: false,
    default: true,
    description: '是否將 date-picker 的下拉清單插入至 body'
  },
  tabindex: {
    type: [String, Number] as PropType<Props.Tabindex>,
    required: false,
    default: 0,
    description: '輸入框的 tabindex'
  },
  emptyValues: {
    type: Array as PropType<Props.EmptyValues>,
    required: false,
    default: undefined,
    description: '組件的空值配置 參考 Config Provider'
  },
  valueOnClear: {
    type: [String, Number, Boolean, Function] as PropType<Props.ValueOnClear>,
    required: false,
    default: undefined,
    description: '組件的空值配置 參考 Config Provider'
  }
}

export declare namespace Emits {
  type Change = (val: Props.ModelValue) => void
  type Blur = (e: FocusEvent) => void
  type Focus = (e: FocusEvent) => void
  type Clear = () => void
  type VisibleChange = (visibility: boolean) => void
}

export declare namespace Expose {
  type Focus = () => void
  type Blur = () => void
  type HandleOpen  = () => void
  type HandleClose  = () => void
}

