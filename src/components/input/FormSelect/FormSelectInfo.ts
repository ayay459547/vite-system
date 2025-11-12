import type { PropType, Component } from 'vue'
import type { Placement as ElPlacement } from 'element-plus'

import type {
  Option as CommonOption,
  CustomSize,
  CustomEffect
} from '@/components' // 系統組件

export const version = '__FormSelect_1.0.0__'

export interface Types {
  option: CommonOption & {
    data?: any
    disabled?: boolean
    // 區別一般 select 與 group select
    options?: Array<Types['option']>
  }
}

export interface Props {
  options: Array<Types['option']>

  modelValue: string | number | boolean | null | Record<string, any> | Array<any>
  multiple: boolean
  disabled: boolean
  valueKey: string
  size: CustomSize
  clearable: boolean
  collapseTags: boolean
  collapseTagsTooltip: boolean
  multipleLimit: number
  name: string
  effect: CustomEffect
  autocomplete: string
  placeholder: string
  filterable: boolean
  allowCreate: boolean
  filterMethod: (...args: any[]) => void
  remote: boolean
  remoteMethod: (...args: any[]) => void
  remoteShowSuffix: boolean
  loading: boolean
  loadingText: string
  noMatchText: string
  noDataText: string
  popperClass: string
  reserveKeyword: boolean
  defaultFirstOption: boolean
  teleported: boolean
  appendTo: string
  persistent: boolean
  automaticDropdown: boolean
  clearIcon: string | Component
  fitInputWidth: boolean
  suffixIcon: string | Component
  tagType: 'success' | 'info' | 'warning' | 'danger'
  tagEffect: 'light' | 'dark' | 'plain'
  validateEvent: boolean
  offset: number
  showArrow: boolean
  placement: ElPlacement
  fallbackPlacements: Array<ElPlacement>
  maxCollapseTags: number
  popperOptions: object
  ariaLabel: string
  emptyValues: Array<any>
  valueOnClear: string | number | boolean | ((...args: any[]) => any)
  // SuffixTransition: boolean
}
export const props = {
  // custom
  options: {
    type: Array as PropType<Props['options']>,
    required: false,
    default: () => [],
    description: '選項'
  },
  // element ui plus
  modelValue: {
    type: [String, Number, Boolean, Array, Object, null] as PropType<Props['modelValue']>,
    required: false,
    default: undefined,
    description: '綁定值 v-model="..." '
  },
  multiple: {
    type: Boolean as PropType<Props['multiple']>,
    required: false,
    default: false,
    description: '是否多選'
  },
  disabled: {
    type: Boolean as PropType<Props['disabled']>,
    required: false,
    default: false,
    description: '是否禁用'
  },
  valueKey: {
    type: String as PropType<Props['valueKey']>,
    required: false,
    default: 'value',
    description: '選項取值 用的key'
  },
  size: {
    type: String as PropType<Props['size']>,
    required: false,
    default: undefined,
    description: '輸入框尺寸'
  },
  clearable: {
    type: Boolean as PropType<Props['clearable']>,
    required: false,
    default: false,
    description: '是否顯示清除按鈕'
  },
  collapseTags: {
    type: Boolean as PropType<Props['collapseTags']>,
    required: false,
    default: false,
    description: '多選時是否將選取值以文字的形式展示'
  },
  collapseTagsTooltip: {
    type: Boolean as PropType<Props['collapseTagsTooltip']>,
    required: false,
    default: false,
    description: '當滑鼠懸停於折疊標籤的文字時，是否顯示所有選取的標籤。 若要使用此屬性，collapse-tags屬性必須設定為 true'
  },
  multipleLimit: {
    type: Number as PropType<Props['multipleLimit']>,
    required: false,
    default: 0,
    description: 'multiple 屬性設定為 true 時，代表多重選擇場景下使用者最多可選擇的項目數， 為 0 則不限制'
  },
  name: {
    type: String as PropType<Props['name']>,
    required: false,
    default: undefined,
    description: 'Select 原生 name 屬性'
  },
  effect: {
    type: String as PropType<Props['effect']>,
    required: false,
    default: 'light',
    description: 'tooltip 主題，內建了 dark / light 兩種'
  },
  autocomplete: {
    type: String as PropType<Props['autocomplete']>,
    default: 'off',
    description: 'Select 原生 autocomplete 屬性'
  },
  placeholder: {
    type: String as PropType<Props['placeholder']>,
    required: false,
    default: undefined,
    description: '輸入框佔位文字'
  },
  filterable: {
    type: Boolean as PropType<Props['filterable']>,
    required: false,
    default: false,
    description: '是否可篩選'
  },
  allowCreate: {
    type: Boolean as PropType<Props['allowCreate']>,
    required: false,
    default: false,
    description: '是否允許建立新條目， 當使用該屬性時，filterable必須設為true'
  },
  filterMethod: {
    type: Function as PropType<Props['filterMethod']>,
    required: false,
    default: undefined,
    description: '自訂篩選方法'
  },
  remote: {
    type: Boolean as PropType<Props['remote']>,
    required: false,
    default: false,
    description: '其中的選項是否從伺服器遠端載入'
  },
  remoteMethod: {
    type: Function as PropType<Props['remoteMethod']>,
    required: false,
    default: undefined,
    description: '自訂遠端搜尋方法'
  },
  remoteShowSuffix: {
    type: Boolean as PropType<Props['remoteShowSuffix']>,
    required: false,
    default: false,
    description: '遠端搜尋方法顯示後綴圖標'
  },
  loading: {
    type: Boolean as PropType<Props['loading']>,
    required: false,
    default: false,
    description: '是否正在從遠端獲取數據'
  },
  loadingText: {
    type: String as PropType<Props['loadingText']>,
    required: false,
    default: undefined,
    description: '從伺服器載入資料時顯示的文本，預設為 Loading'
  },
  noMatchText: {
    type: String as PropType<Props['noMatchText']>,
    required: false,
    default: undefined,
    description: '搜尋條件無匹配時顯示的文字，也可以使用empty插槽設置，預設是 No matching data'
  },
  noDataText: {
    type: String as PropType<Props['noDataText']>,
    required: false,
    default: undefined,
    description: '無選項時顯示的文字，也可以使用empty插槽設定自訂內容，預設是 No data'
  },
  popperClass: {
    type: String as PropType<Props['popperClass']>,
    required: false,
    default: '',
    description: '選擇器下拉式選單的自訂class'
  },
  reserveKeyword: {
    type: Boolean as PropType<Props['reserveKeyword']>,
    required: false,
    default: true,
    description: '當multiple和filterable被設定為true 時，是否在選取一個選項後保留目前的搜尋關鍵字'
  },
  defaultFirstOption: {
    type: Boolean as PropType<Props['defaultFirstOption']>,
    required: false,
    default: false,
    description: '是否在輸入框按下Enter時，選擇第一個符合項目。 需配合filterable或remote使用'
  },
  teleported: {
    type: Boolean as PropType<Props['teleported']>,
    required: false,
    default: true,
    description: '是否使用 teleport。設定成 true則會被追加到 append-to 的位置'
  },
  appendTo: {
    type: String as PropType<Props['appendTo']>,
    required: false,
    default: undefined,
    description: '下拉框掛載到哪個 DOM 元素'
  },
  persistent: {
    type: Boolean as PropType<Props['persistent']>,
    required: false,
    default: true,
    description: '當下拉選擇器未被啟動且persistent設定為false，選擇器會被刪除'
  },
  automaticDropdown: {
    type: Boolean as PropType<Props['automaticDropdown']>,
    required: false,
    default: false,
    description: '對於不可搜尋的Select，是否在輸入框獲得焦點後自動彈出選項選單'
  },
  clearIcon: {
    type: [String, Object] as PropType<Props['clearIcon']>,
    required: false,
    default: undefined,
    description: '自訂清除圖示'
  },
  fitInputWidth: {
    type: Boolean as PropType<Props['fitInputWidth']>,
    required: false,
    default: false,
    description: '下拉框的寬度是否與輸入框相同'
  },
  suffixIcon: {
    type: [String, Object] as PropType<Props['suffixIcon']>,
    required: false,
    default: undefined,
    description: '自訂後綴圖示組件'
  },
  tagType: {
    type: String as PropType<Props['tagType']>,
    required: false,
    default: 'info',
    description: '標籤類型'
  },
  tagEffect: {
    type: String as PropType<Props['tagEffect']>,
    required: false,
    default: 'light',
    description: '標籤效果'
  },
  validateEvent: {
    type: Boolean as PropType<Props['validateEvent']>,
    required: false,
    default: false,
    description: '輸入時是否觸發表單的驗證'
  },
  offset: {
    type: Number as PropType<Props['offset']>,
    required: false,
    default: 12,
    description: '下拉選單偏移量'
  },
  showArrow: {
    type: Boolean as PropType<Props['showArrow']>,
    required: false,
    default: true,
    description: '下拉式選單是否顯示箭頭'
  },
  placement: {
    type: String as PropType<Props['placement']>,
    required: false,
    default: 'bottom-start',
    description: '下拉框出現的位置'
  },
  fallbackPlacements: {
    type: Array as PropType<Props['fallbackPlacements']>,
    required: false,
    default: () => {
      return ['bottom-start', 'top-start', 'right', 'left']
    },
    description: 'dropdown 可用的positions 請查看popper.js 文檔'
  },
  maxCollapseTags: {
    type: Number as PropType<Props['maxCollapseTags']>,
    required: false,
    default: 1,
    description: '需要顯示的Tag 的最大數量只有當 collapseTags 設定為true 時才會生效'
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
  ariaLabel: {
    type: String as PropType<Props['ariaLabel']>,
    required: false,
    default: undefined,
    description: '等價於原生 input aria-label 屬性 (a11y)'
  },
  emptyValues: {
    type: Array as PropType<Props['emptyValues']>,
    required: false,
    default: () => {
      return [undefined, null, '']
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
  focus: ($event: FocusEvent) => void
  clear: () => void
  blur: ($event: FocusEvent) => void
  change: (value: Props['modelValue']) => void
  removeTag: (tagValue: any) => void
  visibleChange: (visible: boolean) => void
}

export interface Expose {
  focus: () => void
  blur: () => void
}

