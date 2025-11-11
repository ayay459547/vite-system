import type { PropType } from 'vue'
import type { Placement as ElPlacement } from 'element-plus'

export const version = '__FormAutocomplete_1.0.0__'

export interface Types {}

export interface Props {
  modelValue: string | number | null
  placeholder: string
  clearable: boolean
  disabled: boolean
  valueKey: string
  debounce: number
  placement: ElPlacement
  fetchSuggestions: (queryString: string, callback: (data: any) => void) => void
  triggerOnFocus: boolean
  selectWhenUnmatched: boolean
  name: string
  ariaLabel: string
  hideLoading: boolean
  popperClass: string
  teleported: boolean
  highlightFirstItem: boolean
  fitInputWidth: boolean
  // type PopperAppendToBody = boolean
}
export const props = {
  // element ui plus
  modelValue: {
    type: [String, Number, null] as PropType<Props['modelValue']>,
    required: false,
    default: undefined,
    description: '綁定值 v-model="..." '
  },
  placeholder: {
    type: String as PropType<Props['placeholder']>,
    required: false,
    default: undefined,
    description: '輸入框佔位文字'
  },
  clearable: {
    type: Boolean as PropType<Props['clearable']>,
    required: false,
    default: false,
    description: '是否顯示清除按鈕'
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
  debounce: {
    type: Number as PropType<Props['debounce']>,
    required: false,
    default: 300,
    description: '輸入延遲時間'
  },
  placement: {
    type: String as PropType<Props['placement']>,
    required: false,
    default: 'bottom-start',
    description: '選單顯示位置'
  },
  fetchSuggestions: {
    type: Function as PropType<Props['fetchSuggestions']>,
    required: false,
    default: undefined,
    description: '建議選項'
  },
  triggerOnFocus: {
    type: Boolean as PropType<Props['triggerOnFocus']>,
    required: false,
    default: true,
    description: '輸入焦點時是否顯示建議'
  },
  selectWhenUnmatched: {
    type: Boolean as PropType<Props['selectWhenUnmatched']>,
    required: false,
    default: false,
    description: '在輸入沒有任何匹配建議的情況下，按下回車是否觸發select事件'
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
  hideLoading: {
    type: Boolean as PropType<Props['hideLoading']>,
    required: false,
    default: false,
    description: '是否隱藏載入資料時的Loading圖示'
  },
  popperClass: {
    type: String as PropType<Props['popperClass']>,
    required: false,
    default: undefined,
    description: '選擇器下拉式選單的自訂class'
  },
  teleported: {
    type: Boolean as PropType<Props['teleported']>,
    required: false,
    default: true,
    description: '是否將下拉清單元素插入append-to指向的元素下'
  },
  highlightFirstItem: {
    type: Boolean as PropType<Props['highlightFirstItem']>,
    required: false,
    default: false,
    description: '是否預設高亮遠端搜尋結果的第一項'
  },
  fitInputWidth: {
    type: Boolean as PropType<Props['fitInputWidth']>,
    required: false,
    default: false,
    description: '下拉框的寬度是否與輸入框相同'
  }
}

export interface Emits {
  blur: (event: FocusEvent) => void
  focus: (event: FocusEvent) => void
  input: (value: string | number) => void
  clear: () => void
  select: (item: Props['modelValue'] | any) => void
  change: (value: Props['modelValue']) => void
}

export interface Expose {
  blur: () => void
  close: () => void
  focus: () => void
  handleSelect: (item: any) => void
  handleKeyEnter: () => void
  highlight: (itemIndex: number) => void
  getData: (queryString: string) => void
}

