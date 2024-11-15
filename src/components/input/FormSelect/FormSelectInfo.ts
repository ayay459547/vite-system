import type { PropType, Component } from 'vue'

import type {
  Option as CommonOption,
  CustomSize,
  CustomEffect,
  CustomPopoverProps
} from '@/components' // 系統組件

export const version = '__FormSelect_1.0.0__'

export declare namespace Types {
  type Option = CommonOption & {
    data?: any
    disabled?: boolean
    // 區別一般 select 與 group select
    options?: Array<Option>
  }
}

export declare namespace Props {
  type ErrorMessage = string
  type Options = Array<Types.Option>

  type ModelValue = string | number | boolean | null | Record<string, any> | Array<any>
  type Multiple = boolean
  type Disabled = boolean
  type ValueKey = string
  type Size = CustomSize
  type Clearable = boolean
  type CollapseTags = boolean
  type CollapseTagsTooltip = boolean
  type MultipleLimit = number
  type Name = string
  type Effect = CustomEffect
  type Autocomplete = string
  type Placeholder = string
  type Filterable = boolean
  type AllowCreate = boolean
  type FilterMethod = Function
  type Remote = boolean
  type RemoteMethod = Function
  type RemoteShowSuffix = boolean
  type Loading = boolean
  type LoadingText = string
  type NoMatchText = string
  type NoDataText = string
  type PopperClass = string
  type ReserveKeyword = boolean
  type DefaultFirstOption = boolean
  type Teleported = boolean
  type AppendTo = string
  type Persistent = boolean
  type AutomaticDropdown = boolean
  type ClearIcon = string | Component
  type FitInputWidth = boolean
  type SuffixIcon = string | Component
  type TagType = 'success' | 'info' | 'warning' | 'danger'
  type TagEffect = 'light' | 'dark' | 'plain'
  type ValidateEvent = boolean
  type Placement = CustomPopoverProps.Placement
  type FallbackPlacements = Array<CustomPopoverProps.Placement>
  type MaxCollapseTags = number
  type PopperOptions = object
  type AriaLabel = string
  type EmptyValues = Array<any>
  type ValueOnClear = string | number | boolean | Function
  // type SuffixTransition = boolean
}
export const props = {
  // custom
  errorMessage: {
    type: String as PropType<Props.ErrorMessage>,
    default: ''
  },
  options: {
    type: Array as PropType<Props.Options>,
    default() {
      return []
    },
    description: '選項'
  },
  // element ui plus
  modelValue: {
    type: [String, Number, Boolean, Array, Object, null] as PropType<Props.ModelValue>,
    required: false,
    default: undefined,
    description: '綁定值 v-model="..." '
  },
  multiple: {
    type: Boolean as PropType<Props.Multiple>,
    required: false,
    default: false,
    description: '是否多選'
  },
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    required: false,
    default: false,
    description: '是否禁用'
  },
  valueKey: {
    type: String as PropType<Props.ValueKey>,
    required: false,
    default: 'value',
    description: '選項取值 用的key'
  },
  size: {
    type: String as PropType<Props.Size>,
    required: false,
    default: undefined,
    description: '輸入框尺寸'
  },
  clearable: {
    type: Boolean as PropType<Props.Clearable>,
    required: false,
    default: false,
    description: '是否顯示清除按鈕'
  },
  collapseTags: {
    type: Boolean as PropType<Props.CollapseTags>,
    required: false,
    default: false,
    description: '是否顯示清除按鈕'
  },
  collapseTagsTooltip: {
    type: Boolean as PropType<Props.CollapseTagsTooltip>,
    required: false,
    default: false,
    description: '是否顯示清除按鈕'
  },
  multipleLimit: {
    type: Number as PropType<Props.MultipleLimit>,
    required: false,
    default: 0,
    description: 'multiple 屬性設定為 true 時，代表多重選擇場景下使用者最多可選擇的項目數， 為 0 則不限制'
  },
  name: {
    type: String as PropType<Props.Name>,
    required: false,
    default: undefined,
    description: 'Select 原生 name 屬性'
  },
  effect: {
    type: String as PropType<Props.Effect>,
    required: false,
    default: 'light',
    description: 'tooltip 主題，內建了 dark / light 兩種'
  },
  autocomplete: {
    type: String as PropType<Props.Autocomplete>,
    default: 'off',
    description: 'Select 原生 autocomplete 屬性'
  },
  placeholder: {
    type: String as PropType<Props.Placeholder>,
    required: false,
    default: undefined,
    description: '輸入框佔位文字'
  },
  filterable: {
    type: Boolean as PropType<Props.Filterable>,
    default: false
  },
  allowCreate: {
    type: Boolean as PropType<Props.AllowCreate>,
    required: false,
    default: false,
    description: '輸入框佔位文字'
  },
  filterMethod: {
    type: Function as PropType<Props.FilterMethod>,
    required: false,
    default: undefined,
    description: '自訂篩選方法'
  },
  remote: {
    type: Boolean as PropType<Props.Remote>,
    required: false,
    default: false,
    description: '其中的選項是否從伺服器遠端載入'
  },
  remoteMethod: {
    type: Function as PropType<Props.RemoteMethod>,
    required: false,
    default: undefined,
    description: '自訂遠端搜尋方法'
  },
  remoteShowSuffix: {
    type: Boolean as PropType<Props.RemoteShowSuffix>,
    required: false,
    default: false,
    description: '遠端搜尋方法顯示後綴圖標'
  },
  loading: {
    type: Boolean as PropType<Props.Loading>,
    required: false,
    default: false,
    description: '是否正在從遠端獲取數據'
  },
  loadingText: {
    type: String as PropType<Props.LoadingText>,
    required: false,
    default: undefined,
    description: '從伺服器載入資料時顯示的文本，預設為 Loading'
  },
  noMatchText: {
    type: String as PropType<Props.NoMatchText>,
    required: false,
    default: undefined,
    description: '搜尋條件無匹配時顯示的文字，也可以使用empty插槽設置，預設是 No matching data'
  },
  noDataText: {
    type: String as PropType<Props.NoDataText>,
    required: false,
    default: undefined,
    description: '無選項時顯示的文字，也可以使用empty插槽設定自訂內容，預設是 No data'
  },
  popperClass: {
    type: String as PropType<Props.PopperClass>,
    required: false,
    default: '',
    description: '選擇器下拉式選單的自訂class'
  },
  reserveKeyword: {
    type: Boolean as PropType<Props.ReserveKeyword>,
    required: false,
    default: true,
    description: '當multiple和filterable被設定為true 時，是否在選取一個選項後保留目前的搜尋關鍵字'
  },
  defaultFirstOption: {
    type: Boolean as PropType<Props.DefaultFirstOption>,
    required: false,
    default: false,
    description: '是否在輸入框按下Enter時，選擇第一個符合項目。 需配合filterable或remote使用'
  },
  teleported: {
    type: Boolean as PropType<Props.Teleported>,
    required: false,
    default: true,
    description: '是否將下拉清單插入到body'
  },
  appendTo: {
    type: String as PropType<Props.AppendTo>,
    required: false,
    default: undefined,
    description: '下拉框掛載到哪個 DOM 元素'
  },
  persistent: {
    type: Boolean as PropType<Props.Persistent>,
    required: false,
    default: true,
    description: '當下拉選擇器未被啟動且persistent設定為false，選擇器會被刪除'
  },
  automaticDropdown: {
    type: Boolean as PropType<Props.AutomaticDropdown>,
    required: false,
    default: false,
    description: '對於不可搜尋的Select，是否在輸入框獲得焦點後自動彈出選項選單'
  },
  clearIcon: {
    type: [String, Object] as PropType<Props.ClearIcon>,
    required: false,
    default: undefined,
    description: '自訂清除圖示'
  },
  fitInputWidth: {
    type: Boolean as PropType<Props.FitInputWidth>,
    required: false,
    default: false,
    description: '下拉框的寬度是否與輸入框相同'
  },
  suffixIcon: {
    type: [String, Object] as PropType<Props.SuffixIcon>,
    required: false,
    default: undefined,
    description: '自訂後綴圖示組件'
  },
  tagType: {
    type: String as PropType<Props.TagType>,
    required: false,
    default: 'info',
    description: '標籤類型'
  },
  tagEffect: {
    type: String as PropType<Props.TagEffect>,
    required: false,
    default: 'light',
    description: '標籤效果'
  },
  validateEvent: {
    type: Boolean as PropType<Props.ValidateEvent>,
    required: false,
    default: false,
    description: '輸入時是否觸發表單的驗證'
  },
  placement: {
    type: String as PropType<Props.Placement>,
    required: false,
    default: 'bottom-start',
    description: '下拉框出現的位置'
  },
  fallbackPlacements: {
    type: Array as PropType<Props.FallbackPlacements>,
    required: false,
    default: () => {
      return ['bottom-start', 'top-start', 'right', 'left']
    },
    description: 'dropdown 可用的positions 請查看popper.js 文檔'
  },
  maxCollapseTags: {
    type: Number as PropType<Props.MaxCollapseTags>,
    required: false,
    default: 1,
    description: '需要顯示的Tag 的最大數量只有當collapse-tags設定為true 時才會生效'
  },
  popperOptions: {
    type: Object as PropType<Props.PopperOptions>,
    required: false,
    default: () => {
      return {}
    },
    description: 'popper.js 參數'
  },
  ariaLabel: {
    type: String as PropType<Props.AriaLabel>,
    required: false,
    default: undefined,
    description: '等價於原生 input aria-label 屬性 (a11y)'
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
  type Focus = ($event: FocusEvent) => void
  type Clear = () => void
  type Blur = ($event: FocusEvent) => void
  type Change = (value: Props.ModelValue) => void
  type RemoveTag = (tagValue: any) => void
  type VisibleChange = (visible: boolean) => void
}

export declare namespace Expose {
  type Focus = () => void
  type Blur = () => void
}

