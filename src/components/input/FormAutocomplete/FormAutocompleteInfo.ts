import type { PropType } from 'vue'
import type { Placement as ElPlacement } from 'element-plus'

export const version = '__FormAutocomplete_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  type ModelValue = string | number | null
  type Placeholder = string
  type Clearable = boolean
  type Disabled = boolean
  type ValueKey = string
  type Debounce = number
  type Placement = ElPlacement
  type FetchSuggestions = (queryString: string, callback: (data: any) => void) => void
  type TriggerOnFocus = boolean
  type SelectWhenUnmatched = boolean
  type Name = string
  type AriaLabel = string
  type HideLoading = boolean
  type PopperClass = string
  type Teleported = boolean
  type HighlightFirstItem = boolean
  type FitInputWidth = boolean
  // type PopperAppendToBody = boolean
}
export const props = {
  // element ui plus
  modelValue: {
    type: [String, Number, null] as PropType<Props.ModelValue>,
    required: false,
    default: undefined,
    description: '綁定值 v-model="..." '
  },
  placeholder: {
    type: String as PropType<Props.Placeholder>,
    required: false,
    default: undefined,
    description: '輸入框佔位文字'
  },
  clearable: {
    type: Boolean as PropType<Props.Clearable>,
    required: false,
    default: false,
    description: '是否顯示清除按鈕'
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
  debounce: {
    type: Number as PropType<Props.Debounce>,
    required: false,
    default: 300,
    description: '輸入延遲時間'
  },
  placement: {
    type: String as PropType<Props.Placement>,
    required: false,
    default: 'bottom-start',
    description: '選單顯示位置'
  },
  fetchSuggestions: {
    type: Function as PropType<Props.FetchSuggestions>,
    required: false,
    default: undefined,
    description: '輸入焦點時是否顯示建議'
  },
  triggerOnFocus: {
    type: Boolean as PropType<Props.TriggerOnFocus>,
    required: false,
    default: true,
    description: '選擇器下拉式選單的自訂class'
  },
  selectWhenUnmatched: {
    type: Boolean as PropType<Props.SelectWhenUnmatched>,
    required: false,
    default: false,
    description: '在輸入沒有任何匹配建議的情況下，按下回車是否觸發select事件'
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
  hideLoading: {
    type: Boolean as PropType<Props.HideLoading>,
    required: false,
    default: false,
    description: '是否隱藏載入資料時的Loading圖示'
  },
  popperClass: {
    type: String as PropType<Props.PopperClass>,
    required: false,
    default: undefined,
    description: '選擇器下拉式選單的自訂class'
  },
  teleported: {
    type: Boolean as PropType<Props.Teleported>,
    required: false,
    default: true,
    description: '是否將下拉清單元素插入append-to指向的元素下'
  },
  highlightFirstItem: {
    type: Boolean as PropType<Props.HighlightFirstItem>,
    required: false,
    default: false,
    description: '是否預設高亮遠端搜尋結果的第一項'
  },
  fitInputWidth: {
    type: Boolean as PropType<Props.FitInputWidth>,
    required: false,
    default: false,
    description: '下拉框的寬度是否與輸入框相同'
  }
}

export declare namespace Emits {
  type Blur = (event: FocusEvent) => void
  type Focus = (event: FocusEvent) => void
  type Input = (value: string | number) => void
  type Clear = () => void
  type Select = (item: Props.ModelValue | any) => void
  type Change = (value: Props.ModelValue) => void
}

export declare namespace Expose {
  type Blur = () => void
  type Close = () => void
  type Focus = () => void
  type HandleSelect = (item: any) => Promise<void>
  type HandleKeyEnter = () => Promise<void>
  type Highlight = (itemIndex: number) => void
  type GetData  = (queryString: string) => void
}

