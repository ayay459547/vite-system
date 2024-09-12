import type { PropType } from 'vue'

export const version = '__CustomColor_1.0.0__'

export declare namespace Types {
  type Size = '' | 'large' | 'default' | 'small'
  type ColorFormat = 'hsl' | 'hsv' | 'hex' | 'rgb'
}

export declare namespace Props {
  type ModelValue = string
  type Size = Types.Size
  // type Disabled = boolean
  // type ShowAlpha = boolean
  // type ColorFormat = Types.ColorFormat
  // type PopperClass = string
  // type Predefine = Array<string>
  // type ValidateEvent = boolean
  // type TabIndex = string | number
  // type Label = string
  // type AriaLabel = string
  // type Id = string
  // type Teleported = boolean
}
export const props = {
  modelValue: {
    type: String as PropType<Props.ModelValue>,
    required: true
  },
  size: {
    type: String as PropType<Props.Size>,
    default: ''
  }
  // disabled: {
  //   type: Boolean as PropType<Props.Disabled>,
  //   default: false
  // },

  // showAlpha: {
  //   type: Boolean as PropType<Props.ShowAlpha>,
  //   default: false
  // },
  // colorFormat: {
  //   type: String as PropType<Props.ColorFormat>,
  //   default: 'rgb'
  // },
  // popperClass: {
  //   type: String as PropType<Props.PopperClass>
  //   // default: ''
  // },
  // predefine: {
  //   type: Array as PropType<Props.Predefine>
  //   // default: []
  // },
  // validateEvent: {
  //   type: Boolean as PropType<Props.ValidateEvent>,
  //   default: true
  // },
  // tabIndex: {
  //   type: [String, Number] as PropType<Props.TabIndex>,
  //   default: 0
  // },
  // label: {
  //   type: String as PropType<Props.Label>
  //   // default:
  // },
  // ariaLabel: {
  //   type: String as PropType<Props.AriaLabel>
  //   // default:
  // },
  // id: {
  //   type: String as PropType<Props.Id>
  //   // default:
  // },
  // teleported: {
  //   type: Boolean as PropType<Props.Teleported>,
  //   default: true
  // }
}

export declare namespace Emits {
  type Change = (value: string) => void
}

export declare namespace Expose {}
