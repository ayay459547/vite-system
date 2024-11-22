import type { PropType, Component } from 'vue'
import type { Placement as ElPlacement } from 'element-plus'

import type {
  Option as CommonOption,
  CustomSize,
  CustomEffect
} from '@/components' // 系統組件

export const version = '__FormSelectV2_1.0.0__'

export declare namespace Types {
  type Option = CommonOption & {
    data?: any
    disabled?: boolean
    // 區別一般 select 與 group select
    options?: Array<Option>
  }
}

export declare namespace Props {
  type ModelValue = string | number | boolean | null | Record<string, any> | Array<any>
  type Options = Array<Types.Option>
  type Props = {
    value?: string
    label?: string
    options?: string
    disabled?: string
  }
  type Multiple = boolean
  type Disabled = boolean
  type ValueKey = string
  type Size = CustomSize
  type Clearable = boolean
  type ClearIcon = string | Component
  type CollapseTags = boolean
  type MultipleLimit = number
  type Name = string
  type Effect = CustomEffect
  type Autocomplete = string | any
  type Placeholder = string
  type Filterable = boolean
  type AllowCreate = boolean
  type FilterMethod = Function
  type Loading = boolean
  type LoadingText = string
  type ReserveKeyword = boolean
  type NoMatchText = string
  type NoDataText = string
  type PopperClass = string
  type Teleported = boolean
  type AppendTo = string
  type Persistent = boolean
  type PopperOptions = object
  type AutomaticDropdown = boolean
  type Height = number
  type ItemHeight = number
  type ScrollbarAlwaysOn = boolean
  type Remote = boolean
  type RemoteMethod = Function
  type ValidateEvent = boolean
  type Offset = number
  type ShowArrow = boolean
  type Placement = ElPlacement
  type FallbackPlacements = Array<ElPlacement>
  type CollapseTagsTooltip = boolean
  type MaxCollapseTags  = number
  type TagType = 'success' | 'info' | 'warning' | 'danger'
  type TagEffect = 'light' | 'dark' | 'plain'
  type AriaLabel = string
  type EmptyValues = Array<any>
  type ValueOnClear = string | number | boolean | Function
  // type PopperAppendToBody  = boolean
}
export const props = {
  // element ui plus
  modelValue: {
    type: [String, Number, Boolean, Array, Object, null] as PropType<Props.ModelValue>,
    required: false,
    default: undefined,
    description: '綁定值 v-model="..." '
  },
  options: {
    type: Array as PropType<Props.Options>,
    required: false,
    default() {
      return []
    },
    description: '選項的資料來源， value 的 key 和 label 可以透過 props自訂'
  },
  props: {
    type: Object as PropType<Props.Props>,
    required: false,
    default() {
      return {
        value: 'value', // 指定選項的值 識別的key(string)
        label: 'label', // 指定選項的文字 識別的key(string)
        options: 'options', // 指定選項的子選項 識別的key(string)
        disabled: 'disabled' // 指定選項的停用 識別的key(string)
      }
    },
    description: '選項參數設定'
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
    description: '作為 value 唯一識別的鍵名，綁定值為物件類型時必填'
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
  clearIcon: {
    type: [String, Object] as PropType<Props.ClearIcon>,
    required: false,
    default: undefined,
    description: '自訂清除圖示'
  },
  collapseTags: {
    type: Boolean as PropType<Props.CollapseTags>,
    required: false,
    default: false,
    description: '多選時是否將選取值以文字的形式展示'
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
    required: false,
    default: false,
    description: '是否可篩選'
  },
  allowCreate: {
    type: Boolean as PropType<Props.AllowCreate>,
    required: false,
    default: false,
    description: '是否允許建立新條目， 當使用該屬性時，filterable必須設為true'
  },
  filterMethod: {
    type: Function as PropType<Props.FilterMethod>,
    required: false,
    default: undefined,
    description: '自訂篩選方法'
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
  reserveKeyword: {
    type: Boolean as PropType<Props.ReserveKeyword>,
    required: false,
    default: true,
    description: '當multiple和filterable被設定為true 時，是否在選取一個選項後保留目前的搜尋關鍵字'
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
  teleported: {
    type: Boolean as PropType<Props.Teleported>,
    required: false,
    default: true,
    description: '是否使用 teleport。設定成 true則會被追加到 append-to 的位置'
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
  popperOptions: {
    type: Object as PropType<Props.PopperOptions>,
    required: false,
    default: () => {
      return {}
    },
    description: `
      popper.js 参数
      https://popper.js.org/docs/v2/
    `
  },
  automaticDropdown: {
    type: Boolean as PropType<Props.AutomaticDropdown>,
    required: false,
    default: false,
    description: '對於不可搜尋的Select，是否在輸入框獲得焦點後自動彈出選項選單'
  },
  height: {
    type: Number as PropType<Props.Height>,
    required: false,
    default: 274,
    description: '下拉式選單的高度'
  },
  itemHeight: {
    type: Number as PropType<Props.ItemHeight>,
    required: false,
    default: 34,
    description: '下拉式選單，選項的高度'
  },
  scrollbarAlwaysOn: {
    type: Boolean as PropType<Props.ScrollbarAlwaysOn>,
    required: false,
    default: false,
    description: '是否總是展示滾動條'
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
  validateEvent: {
    type: Boolean as PropType<Props.ValidateEvent>,
    required: false,
    default: false,
    description: '輸入時是否觸發表單的驗證'
  },
  offset: {
    type: Number as PropType<Props.Offset>,
    required: false,
    default: 12,
    description: '下拉式選單偏移量'
  },
  showArrow: {
    type: Boolean as PropType<Props.ShowArrow>,
    required: false,
    default: true,
    description: '下拉式選單是否顯示箭頭'
  },
  placement: {
    type: String as PropType<Props.Placement>,
    required: false,
    default: 'top',
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
  collapseTagsTooltip: {
    type: Boolean as PropType<Props.CollapseTagsTooltip>,
    required: false,
    default: false,
    description: '當滑鼠懸停於折疊標籤的文字時，是否顯示所有選取的標籤。 若要使用此屬性，collapse-tags屬性必須設定為 true'
  },
  maxCollapseTags: {
    type: Number as PropType<Props.MaxCollapseTags>,
    required: false,
    default: 1,
    description: '需要顯示的Tag 的最大數量只有當collapse-tags設定為true 時才會生效'
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
  ariaLabel: {
    type: String as PropType<Props.AriaLabel>,
    required: false,
    default: undefined,
    description: '等價於原生 input aria-label 屬性 (a11y)'
  },
  emptyValues: {
    type: Array as PropType<Props.EmptyValues>,
    required: false,
    default: () => {
      return [undefined, null, '']
    },
    description: '組件的空值配置 參考 Config Provider'
  },
  valueOnClear: {
    type: [String, Number, Boolean, Function] as PropType<Props.ValueOnClear>,
    required: false,
    default: null,
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

