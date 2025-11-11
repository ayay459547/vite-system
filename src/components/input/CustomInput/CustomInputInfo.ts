import type { PropType, Ref } from 'vue'

import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'
import type { ValidateType } from '@/lib/lib_validate'

import { props as formInputProps } from '@/components/input/FormInput/FormInputInfo'
import { props as formSelectProps } from '@/components/input/FormSelect/FormSelectInfo'
import { props as formSelectV2Props } from '@/components/input/FormSelectV2/FormSelectV2Info'
import { props as formSelectTreeProps } from '@/components/input/FormSelectTree/FormSelectTreeInfo'
import { props as formDatePickerProps } from '@/components/input/FormDatePicker/FormDatePickerInfo'
import { props as formTimePickerProps } from '@/components/input/FormTimePicker/FormTimePickerInfo'
import { props as formAutocompleteProps } from '@/components/input/FormAutocomplete/FormAutocompleteInfo'
import { props as formRadioProps } from '@/components/input/FormRadio/FormRadioInfo'
import { props as formCheckboxProps } from '@/components/input/FormCheckbox/FormCheckboxInfo'

import type { Props as ModalSelectProps } from '@/components/input/ModalSelect/ModalSelectInfo'

export const version = '__CustomInput_2.0.0__'

export interface Types {}

export interface Props {
  modelValue: any
  type: string
  isValidate: boolean
  direction: 'column' | 'row'
  label: string
  hiddenLabel: boolean
  hiddenErrorMessage: boolean
  round: number | null
  floor: number | null
  ceil: number | null
  max: number | null
  min: number | null
  required: boolean
  validate: ValidateType[] | ValidateType
  text: boolean
  i18nModule: ScopeKey
  i18nLabel: string
  __key__: string

  modalSelect: ModalSelectProps
}

const customProps = {
  modelValue: {
    type: [Array, String, Number, Boolean, null, undefined] as PropType<Props['modelValue']>,
    required: true,
    description: '綁定值 v-model="..." '
  },
  isValidate: {
    type: Boolean as PropType<Props['isValidate']>,
    require: false,
    default: false,
    description: `
      是否為驗證輸入框
      會引響高度 部分元素是否顯示`
  },
  direction: {
    type: String as PropType<Props['direction']>,
    required: false,
    default: 'column',
    description: '方向 column:直 row:橫'
  },
  label: {
    type: String as PropType<Props['label']>,
    required: false,
    default: '',
    description: '文字'
  },
  hiddenLabel: {
    type: Boolean as PropType<Props['hiddenLabel']>,
    required: false,
    default: false,
    description: '是否隱藏文字'
  },
  hiddenErrorMessage: {
    type: Boolean as PropType<Props['hiddenErrorMessage']>,
    required: false,
    default: false,
    description: '是否隱藏驗證錯誤訊息'
  },
  required: {
    type: Boolean as PropType<Props['required']>,
    required: false,
    default: false,
    description: `
      isValidate 必須為 true
      是否必填`
  },
  validate: {
    type: [Array, String, null] as PropType<Props['validate']>,
    required: false,
    default: null,
    description: `
      驗證同時符合 多個條件 :validate="[keyword, keyword, keyword ......]"
      驗證符合一個條件 validate="keyword"
      參考檔案: lib_validate.ts`
  },
  text: {
    type: Boolean as PropType<Props['text']>,
    required: false,
    default: false,
    description: '是否顯示純文字 隱藏輸入框 顯示 modelValue 的值'
  },
  i18nModule: {
    type: String as PropType<Props['i18nModule']>,
    required: false,
    default: defaultModuleType,
    description: `
      label, options 使用 i18nLabel 時套用的翻譯模組
    `
  },
  i18nLabel: {
    type: String as PropType<Props['i18nLabel']>,
    required: false,
    default: null,
    description: `
      提供翻譯檔參照用的 i18nLabel
      翻譯結果有效時會把原先的 label 替換掉
    `
  },
  __key__: {
    type: String as PropType<Props['__key__']>,
    required: false,
    default: '',
    description: 'validateKey 識別驗證的key'
  }
}

const formProps: any = {
  ...formInputProps,
  ...formSelectProps,
  ...formSelectV2Props,
  ...formSelectTreeProps,
  ...formDatePickerProps,
  ...formTimePickerProps,
  ...formAutocompleteProps,
  ...formCheckboxProps,
  ...formRadioProps,
  // 不同 input 有衝突的key
  type: {
    type: String as PropType<any>,
    required: false,
    default: 'text'
  },
  operatorType: {
    type: String as PropType<any>,
    required: false,
    default: 'text'
  },
  name: {
    type: [String, Array] as PropType<any>,
    required: false,
    default: undefined
  },
  format: {
    type: String as PropType<any>,
    required: false,
    default: undefined
  },
  valueFormat: {
    type: String as PropType<any>,
    required: false,
    default: undefined
  },
  placement: {
    type: String as PropType<any>,
    required: false,
    default: undefined
  },
  showArrow: {
    type: Boolean as PropType<any>,
    required: false,
    default: undefined
  },
  step: {
    type: [String, Number] as PropType<any>,
    required: false,
    default: undefined
  },
  modalSelect: {
    type: Object as PropType<Props['modalSelect']>,
    required: false,
    default: undefined
  }
}

export const props = { ...formProps, ...customProps }

export interface Emits {
  modalSelectSubmit: (selectedValue: any[]) => void
}

export interface Expose {
  key: string
  value: Ref<any>
  resetValidate: () => void
  validate: () => Promise<{
    errors: string[]
    valid: boolean
    value?: any
    validateKey?: string
  }>
  getDom: () => Element | null
  focus: () => void
  blur: () => void
  openModal: () => void
}
