import type { PropType, Component } from 'vue'
import type { Placement as ElPlacement } from 'element-plus'

import type { CustomSize } from '@/components' // 系統組件

export const version = '__FormDatePicker_1.0.0__'

export interface Types {
  baseValue: string | null

  shortcut: {
    i18nLabel?: string
    label?: string
    text: string
    value: Date | (() => [Date, Date])
  }
}

export interface Props {
  modelValue: Types['baseValue'] | [Types['baseValue'], Types['baseValue']]
  readonly: boolean
  disabled: boolean
  size: CustomSize
  editable: boolean
  clearable: boolean
  placeholder: string
  startPlaceholder: string
  endPlaceholder: string
  type:
    | 'year' | 'years'
    | 'month' | 'months'
    | 'date' | 'dates' | 'datetime'
    | 'week' | 'datetimerange' | 'daterange'
    | 'monthrange' | 'yearrange'
  format: string
  popperClass: string
  popperOptions: Record<string, any> | any
  rangeSeparator: string
  defaultValue: Date | [Date, Date]
  defaultTime: Date | [Date, Date]
  valueFormat: string
  id: string | [string, string]
  name: string | [string, string] | any
  unlinkPanels: boolean
  prefixIcon: string | Component
  clearIcon: string | Component
  validateEvent: boolean
  disabledDate: (data: Date) => boolean
  shortcuts: Array<Types['shortcut']>
  cellClassName: (data: Date) => string
  teleported: boolean
  emptyValues: Array<any>
  valueOnClear: string | number | boolean | Function
  fallbackPlacements: Array<ElPlacement>
  placement: ElPlacement
}
export const props = {
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
  size: {
    type: String as PropType<Props['size']>,
    required: false,
    default: undefined,
    description: '輸入框尺寸'
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
  type: {
    type: String as PropType<Props['type']>,
    required: false,
    default: 'date',
    description: '顯示類型'
  },
  format: {
    type: String as PropType<Props['format']>,
    required: false,
    default: 'YYYY-MM-DD',
    description: `
      顯示格式化
      https://day.js.org/docs/en/display/format#list-of-all-available-formats
    `
  },
  popperClass: {
    type: String as PropType<Props['popperClass']>,
    required: false,
    default: undefined,
    description: 'class'
  },
  popperOptions: {
    type: Object as PropType<Props['popperOptions']>,
    required: false,
    default: () => {
      return {}
    },
    description: `
      popper.js 参数
      https://popper.js.org/docs/v2/
    `
  },
  rangeSeparator: {
    type: String as PropType<Props['rangeSeparator']>,
    required: false,
    default: '-',
    description: '選擇範圍時的分隔符'
  },
  defaultValue: {
    type: [String, Object] as PropType<Props['defaultValue']>,
    required: false,
    default: undefined,
    description: '可選，選擇器開啟時預設顯示的時間'
  },
  defaultTime: {
    type: [String, Object] as PropType<Props['defaultTime']>,
    required: false,
    default: undefined,
    description: '範圍選擇時選取日期所使用的當日內具體時刻'
  },
  valueFormat: {
    type: String as PropType<Props['valueFormat']>,
    required: false,
    default: 'YYYY-MM-DD',
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
    type: [String, Array] as PropType<Props['name']>,
    required: false,
    default: undefined,
    description: '原生 name 屬性'
  },
  unlinkPanels: {
    type: Boolean as PropType<Props['unlinkPanels']>,
    required: false,
    default: false,
    description: '在範圍選擇器取消兩個日期面板之間的連動'
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
  validateEvent: {
    type: Boolean as PropType<Props['validateEvent']>,
    required: false,
    default: false,
    description: '輸入時是否觸發表單的驗證'
  },
  disabledDate: {
    type: Function as PropType<Props['disabledDate']>,
    required: false,
    default: undefined,
    description: '一個用來判斷該日期是否被禁用的函數，接受一個 Date 物件作為參數。 應該回傳一個 Boolean 值'
  },
  shortcuts: {
    type: Array as PropType<Props['shortcuts']>,
    required: false,
    default: () => [],
    description: '設定快捷選項，需要傳入數組對象'
  },
  cellClassName: {
    type: Function as PropType<Props['cellClassName']>,
    required: false,
    default: undefined,
    description: '設定自訂類別名'
  },
  teleported: {
    type: Boolean as PropType<Props['teleported']>,
    required: false,
    default: true,
    description: '是否將 date-picker 的下拉清單插入至 body'
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
  },
  fallbackPlacements: {
    type: Array as PropType<Props['fallbackPlacements']>,
    required: false,
    default: undefined,
    description: 'dropdown 可用的positions 請查看popper.js 文檔'
  },
  placement: {
    type: String as PropType<Props['placement']>,
    required: false,
    default: 'bottom',
    description: '下拉框出現的位置'
  }
}

export interface Emits {
  change: (val: Props['modelValue']) => void
  blur: (e: FocusEvent) => void
  focus: (e: FocusEvent) => void
  clear: () => void
  calendarChange: (val: [Date, null | Date]) => void
  panelChange: (date: Date | [Date, Date], mode: 'month' | 'year', view?: string) => void
  visibleChange: (visibility: boolean) => void
}

export interface Expose {
  focus: () => void
  blur: () => void
  handleOpen: () => void
  handleClose: () => void
}

