import type { PropType } from 'vue'

import type { Option as CommonOption } from '@/components' // 系統組件

export const version = '__FormSelectTree_1.0.0__'

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
  type ErrorMessage = string
  type Options = Array<Types.Option>
  type Clearable = boolean
  type Disabled = boolean
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
  type Placeholder = string
  type ValueKey = string
}
export const props = {
  modelValue: {
    type: [String, Number, Boolean, Array, Object, null] as PropType<Props.ModelValue>,
    required: true
  },
  errorMessage: {
    type: String as PropType<Props.ErrorMessage>,
    default: ''
  },
  options: {
    type: Array as PropType<Props.Options>,
    default() {
      return []
    }
  },
  // element ui plus
  clearable: {
    type: Boolean as PropType<Props.Clearable>,
    default: false
  },
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    default: false
  },
  loading: {
    type: Boolean as PropType<Props.Loading>,
    default: false
  },
  remote: {
    type: Boolean as PropType<Props.Remote>,
    default: false
  },
  remoteMethod: {
    type: Function as PropType<Props.RemoteMethod>,
    required: false
  },
  remoteShowSuffix: {
    type: Boolean as PropType<Props.RemoteShowSuffix>,
    default: false
  },
  multiple: {
    type: Boolean as PropType<Props.Multiple>,
    default: false
  },
  multipleLimit: {
    type: Number as PropType<Props.MultipleLimit>,
    default: 0
  },
  maxCollapseTags: {
    type: Number as PropType<Props.MaxCollapseTags>,
    default: 1
  },
  filterable: {
    type: Boolean as PropType<Props.Filterable>,
    default: false
  },
  reserveKeyword: {
    type: Boolean as PropType<Props.ReserveKeyword>,
    default: false
  },
  allowCreate: {
    type: Boolean as PropType<Props.AllowCreate>,
    default: false
  },
  defaultFirstOption: {
    type: Boolean as PropType<Props.DefaultFirstOption>,
    default: false
  },
  placeholder: {
    type: String as PropType<Props.Placeholder>,
    required: false
  },
  valuekey: {
    type: String as PropType<Props.ValueKey>,
    default: 'value'
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

