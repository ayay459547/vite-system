import type { PropType, Component } from 'vue'
import type { Placement as ElPlacement } from 'element-plus'

import type { CustomSize } from '@/components' // 系統組件

export const version = '__FormDatePicker_1.0.0__'

export declare namespace Types {
  type BaseValue = string | null

  type Shortcut = {
    i18nLabel?: string
    label?: string
    text: string
    value: Date | (() => [Date, Date])
  }
}

export declare namespace Props {
  type ModelValue = Types.BaseValue | [Types.BaseValue, Types.BaseValue]
  type Readonly = boolean
  type Disabled = boolean
  type Size = CustomSize
  type Editable = boolean
  type Clearable = boolean
  type Placeholder = string
  type StartPlaceholder = string
  type EndPlaceholder = string
  type Type =
    | 'year' | 'years'
    | 'month' | 'months'
    | 'date' | 'dates' | 'datetime'
    | 'week' | 'datetimerange' | 'daterange'
    | 'monthrange' | 'yearrange'
  type Format = string
  type PopperClass = string
  type PopperOptions = Record<string, any> | any
  type RangeSeparator = string
  type DefaultValue = Date | [Date, Date]
  type DefaultTime = Date | [Date, Date]
  type ValueFormat = string
  type Id = string | [string, string]
  type Name = string | [string, string] | any
  type UnlinkPanels = boolean
  type PrefixIcon =  string | Component
  type ClearIcon = string | Component
  type ValidateEvent = boolean
  type DisabledDate = (data: Date) => boolean
  type Shortcuts = Array<Types.Shortcut>
  type CellClassName = (data: Date) => string
  type Teleported = boolean
  type EmptyValues = Array<any>
  type ValueOnClear = string | number | boolean | Function
  type FallbackPlacements = Array<ElPlacement>
  type Placement = ElPlacement
}
export const props = {
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
  size: {
    type: String as PropType<Props.Size>,
    required: false,
    default: undefined,
    description: '輸入框尺寸'
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
  type: {
    type: String as PropType<Props.Type>,
    required: false,
    default: 'date',
    description: '顯示類型'
  },
  format: {
    type: String as PropType<Props.Format>,
    required: false,
    default: 'YYYY-MM-DD',
    description: `
      顯示格式化
      https://day.js.org/docs/en/display/format#list-of-all-available-formats
    `
  },
  popperClass: {
    type: String as PropType<Props.PopperClass>,
    required: false,
    default: undefined,
    description: 'class'
  },
  popperOptions: {
    type: Object as PropType<Props.PopperOptions>,
    required: false,
    default() {
      return {}
    },
    description: `
      popper.js 参数
      https://popper.js.org/docs/v2/
    `
  },
  rangeSeparator: {
    type: String as PropType<Props.RangeSeparator>,
    required: false,
    default: '-',
    description: '選擇範圍時的分隔符'
  },
  defaultValue: {
    type: [String, Object] as PropType<Props.DefaultValue>,
    required: false,
    default: undefined,
    description: '可選，選擇器開啟時預設顯示的時間'
  },
  defaultTime: {
    type: [String, Object] as PropType<Props.DefaultTime>,
    required: false,
    default: undefined,
    description: '範圍選擇時選取日期所使用的當日內具體時刻'
  },
  valueFormat: {
    type: String as PropType<Props.ValueFormat>,
    required: false,
    default: 'YYYY-MM-DD',
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
    type: [String, Array] as PropType<Props.Name>,
    required: false,
    default: undefined,
    description: '原生 name 屬性'
  },
  unlinkPanels: {
    type: Boolean as PropType<Props.UnlinkPanels>,
    required: false,
    default: false,
    description: '在範圍選擇器取消兩個日期面板之間的連動'
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
  validateEvent: {
    type: Boolean as PropType<Props.ValidateEvent>,
    required: false,
    default: false,
    description: '輸入時是否觸發表單的驗證'
  },
  disabledDate: {
    type: Function as PropType<Props.DisabledDate>,
    required: false,
    default: undefined,
    description: '一個用來判斷該日期是否被禁用的函數，接受一個 Date 物件作為參數。 應該回傳一個 Boolean 值'
  },
  shortcuts: {
    type: Array as PropType<Props.Shortcuts>,
    required: false,
    default() {
      return []
    },
    description: '設定快捷選項，需要傳入數組對象'
  },
  cellClassName: {
    type: Function as PropType<Props.CellClassName>,
    required: false,
    default: undefined,
    description: '設定自訂類別名'
  },
  teleported: {
    type: Boolean as PropType<Props.Teleported>,
    required: false,
    default: true,
    description: '是否將 date-picker 的下拉清單插入至 body'
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
  },
  fallbackPlacements: {
    type: Array as PropType<Props.FallbackPlacements>,
    required: false,
    default: undefined,
    description: 'dropdown 可用的positions 請查看popper.js 文檔'
  },
  placement: {
    type: String as PropType<Props.Placement>,
    required: false,
    default: 'bottom',
    description: '下拉框出現的位置'
  }
}

export declare namespace Emits {
  type Change = (val: Props.ModelValue) => void
  type Blur = (e: FocusEvent) => void
  type Focus = (e: FocusEvent) => void
  type Clear = () => void
  type CalendarChange = (val: [Date, null | Date]) => void
  type PanelChange = (date: Date | [Date, Date], mode: 'month' | 'year', view?: string) => void
  type VisibleChange = (visibility: boolean) => void
}

export declare namespace Expose {
  type Focus = () => void
  type Blur = () => void
  type HandleOpen = () => void
  type HandleClose = () => void
}

