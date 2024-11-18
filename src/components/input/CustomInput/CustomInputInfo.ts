import type { PropType } from 'vue'

import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'
import type { ValidateType } from '@/lib/lib_validate'
import type {
  Option,
  FormInputProps,
  FormDatePickerProps,
  FormTimePickerProps,
  FormAutocompleteProps
} from '@/components' // 系統組件

import { props as formInputProps } from '@/components/input/FormInput/FormInputInfo'
import { props as formSelectProps } from '@/components/input/FormSelect/FormSelectInfo'
import { props as formSelectV2Props } from '@/components/input/FormSelectV2/FormSelectV2Info'
import { props as formSelectTreeProps } from '@/components/input/FormSelectTree/FormSelectTreeInfo'

export const version = '__CustomInput_1.0.0__'

export declare namespace Types {
  type InputType =
    | 'text'
    | 'number'
    | 'textarea'
    | 'password'
    | 'select'
    | 'select-tree'
    | 'select-v2'
    | 'checkbox'
    | 'radio'
    | 'autocomplete'
    | 'operator'
    | FormDatePickerProps.Type
    | FormTimePickerProps.Type

  type InputShortcuts = FormDatePickerProps.Shortcuts
  type InputFetchSuggestions = FormAutocompleteProps.FetchSuggestions
}

export declare namespace Props {
  type ModelValue = any

  type IsValidate = boolean
  type ValidateKey = string
  type Direction = 'column' | 'row'
  type Label = string
  type HiddenLabel = boolean
  type HiddenErrorMessage = boolean
  type OnlyNumber = boolean
  type Round = number | null
  type Floor = number | null
  type Ceil = number | null
  type Max = number | null
  type Min = number | null
  type Required = boolean
  type Validate = ValidateType[] | ValidateType
  type Text = boolean
  type I18nModule = ScopeKey
  type I18nLabel = string

  type Type = Types.InputType
  type Clearable = boolean
  type Disabled = boolean
  type Placeholder = string
  type Options = Option[]

  type Rows = FormInputProps.Rows
  type Autosize = FormInputProps.Autosize
  type Autocomplete = FormInputProps.Autocomplete
  type Name = FormInputProps.Name
  type ShowPassword = FormInputProps.ShowPassword

  type Loading = boolean
  type Remote = boolean
  type RemoteMethod = Function
  type RemoteShowSuffix = boolean
  type Multiple = boolean
  type MultipleLimit = number
  type MaxCollapseTags = number
  type Filterable = boolean
  type ReserveKeyword = boolean
  type AllowCreate = boolean
  type DefaultFirstOption = boolean

  type Format = string
  type ValueFormat = string
  type Shortcuts = Types.InputShortcuts[]

  type IsRange = boolean
  type RangeSeparator = string

  type Indeterminate = boolean

  type ValueKey = string
  type FitInputWidth = boolean
  type FetchSuggestions = Types.InputFetchSuggestions
}

const custom = {
  modelValue: {
    type: [Array, String, Number, Boolean, null, undefined] as PropType<Props.ModelValue>,
    required: true,
    description: '綁定值 v-model="..." '
  },
  isValidate: {
    type: Boolean as PropType<Props.IsValidate>,
    require: false,
    default: false,
    description: `
      是否為驗證輸入框
      會引響高度 部分元素是否顯示`
  },
  validateKey: {
    type: String as PropType<Props.ValidateKey>,
    required: false,
    default: 'field',
    description: `
      驗證用的 key 值
      useField 綁定用
      會以 class 綁定在 dom
    `
  },
  direction: {
    type: String as PropType<Props.Direction>,
    required: false,
    default: 'column',
    description: '方向 column:直 row:橫'
  },
  label: {
    type: String as PropType<Props.Label>,
    required: false,
    default: '',
    description: '文字'
  },
  hiddenLabel: {
    type: Boolean as PropType<Props.HiddenLabel>,
    required: false,
    default: false,
    description: '是否隱藏文字'
  },
  hiddenErrorMessage: {
    type: Boolean as PropType<Props.HiddenErrorMessage>,
    required: false,
    default: false,
    description: '是否隱藏驗證錯誤訊息'
  },
  round: {
    type: [Number, null] as PropType<Props.Round>,
    required: false,
    default: null,
    description: `
      四捨五入 取小數點到第幾位`
  },
  floor: {
    type: [Number, null] as PropType<Props.Floor>,
    required: false,
    default: null,
    description: `
      無條件捨去 取小數點到第幾位`
  },
  ceil: {
    type: [Number, null] as PropType<Props.Ceil>,
    required: false,
    default: null,
    description: `
      無條件進位 取小數點到第幾位`
  },
  max: {
    type: [Number, null] as PropType<Props.Max>,
    required: false,
    default: null,
    description: '最大值'
  },
  min: {
    type: [Number, null] as PropType<Props.Min>,
    required: false,
    default: null,
    description: '最小值'
  },
  required: {
    type: Boolean as PropType<Props.Required>,
    required: false,
    default: false,
    description: `
      isValidate 必須為 true
      是否必填`
  },
  validate: {
    type: [Array, String, null] as PropType<Props.Validate>,
    required: false,
    default: null,
    description: `
      驗證同時符合 多個條件 :validate="[keyword, keyword, keyword ......]"
      驗證符合一個條件 validate="keyword"
      參考檔案: lib_validate.ts`
  },
  text: {
    type: Boolean as PropType<Props.Text>,
    required: false,
    default: false,
    description: '是否顯示純文字 隱藏輸入框 顯示 modelValue 的值'
  },
  i18nModule: {
    type: String as PropType<Props.I18nModule>,
    required: false,
    default: defaultModuleType,
    description: `
      label, options 使用 i18nLabel 時套用的翻譯模組
    `
  },
  i18nLabel: {
    type: String as PropType<Props.I18nLabel>,
    required: false,
    default: null,
    description: `
      提供翻譯檔參照用的 i18nLabel
      翻譯結果有效時會把原先的 label 替換掉
    `
  }
}

const elDatePicker = {
  format: {
    type: String as PropType<Props.Format>,
    required: false,
    description: '顯示格式'
  },
  valueFormat: {
    type: String as PropType<Props.ValueFormat>,
    required: false,
    description: '資料格式'
  },
  shortcuts: {
    type: Array as PropType<Props.Shortcuts>,
    required: false,
    description: `
      預設時間範圍選項
      [
        {
          text: 選項文字
          i18nLabel: i18nKey
          value: 時間範圍
        } 
        , ...
      ]
    `
  }
}

const elTimePicker = {
  rangeSeparator: {
    type: String as PropType<Props.RangeSeparator>,
    default: '-',
    description: '間格文字'
  }
}

const elCheckbox = {
  indeterminate: {
    type: Boolean as PropType<Props.Indeterminate>,
    required: false,
    default: false,
    description: '用在有選但非全選狀態'
  }
}

const elRadio = {}

const elAutocomplete = {
  valueKey: {
    type: String as PropType<Props.ValueKey>,
    required: false,
    default: 'value'
  },
  fitInputWidth: {
    type: Boolean as PropType<Props.FitInputWidth>,
    required: false,
    default: false
  },
  fetchSuggestions: {
    type: Function as PropType<Props.FetchSuggestions>,
    required: false
  }
}

export const props = {
  ...formInputProps,
  ...formSelectProps,
  ...formSelectV2Props,
  ...formSelectTreeProps,
  ...elDatePicker,
  ...elTimePicker,
  ...elCheckbox,
  ...elRadio,
  ...elAutocomplete,
  // 不同input 有衝突的key
  name: {
    type: [String, Array] as PropType<string | [string, string]>,
    required: false,
    default: undefined,
    description: '原生 name 屬性'
  },
  ...custom
}

export declare namespace Emits {}

export declare namespace Expose {}
