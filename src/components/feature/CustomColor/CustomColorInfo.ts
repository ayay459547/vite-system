import type Color from 'element-plus/es/components/color-picker/src/utils/color.mjs'
import type { PropType } from 'vue'

export const version = '__CustomColor_1.0.0__'

export interface Types {
  size: 'large' | 'default' | 'small'
  colorFormat: 'hsl' | 'hsv' | 'hex' | 'rgb'
}

export interface Props {
  modelValue: string
  disabled: boolean
  size: Types['size']
  showAlpha: boolean
  colorFormat: Types['colorFormat']
  popperClass: string
  predefine: Array<string>
  validateEvent: boolean
  tabIndex: string | number
  ariaLabel: string
  id: string
  teleported: boolean
}
export const props = {
  modelValue: {
    type: String as PropType<Props['modelValue']>,
    required: false,
    default: undefined,
    description: '選取項目綁定值'
  },
  disabled: {
    type: Boolean as PropType<Props['disabled']>,
    required: false,
    default: false,
    description: '是否取消'
  },
  size: {
    type: String as PropType<Props['size']>,
    required: false,
    default: undefined,
    description: '尺寸'
  },
  showAlpha: {
    type: Boolean as PropType<Props['showAlpha']>,
    required: false,
    default: false,
    description: '是否支援寬度選擇'
  },
  colorFormat: {
    type: String as PropType<Props['colorFormat']>,
    required: false,
    default: 'rgb',
    description: '寫入v-model的顏色的格式'
  },
  popperClass: {
    type: String as PropType<Props['popperClass']>,
    required: false,
    default: undefined,
    description: '寫入v-model的顏色的格式'
  },
  predefine: {
    type: Array as PropType<Props['predefine']>,
    required: false,
    default: undefined,
    description: '預定義顏色'
  },
  validateEvent: {
    type: Boolean as PropType<Props['validateEvent']>,
    required: false,
    default: false,
    description: '輸入時是否觸發表單的校驗'
  },
  tabIndex: {
    type: [String, Number] as PropType<Props['tabIndex']>,
    required: false,
    default: 0,
    description: 'ColorPicker 的 tabindex'
  },
  ariaLabel: {
    type: String as PropType<Props['ariaLabel']>,
    required: false,
    default: undefined,
    description: 'ColorPicker 的 aria-label'
  },
  id: {
    type: String as PropType<Props['id']>,
    required: false,
    default: undefined,
    description: 'ColorPicker 的 id'
  },
  teleported: {
    type: Boolean as PropType<Props['teleported']>,
    required: false,
    default: undefined,
    description: '是否將popover的下拉清單渲染到body下'
  }
}

export interface Emits {
  change: (value: string) => void
  activeChange: (value: string) => void
  focus: (event: FocusEvent) => void
  blur: (event: FocusEvent) => void
}

export interface Expose {
  color: Color
  show: () => void
  hide: () => void
  focus: () => void
  blur: () => void
}
