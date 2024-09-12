import type { PropType } from 'vue'

export const version = '__CustomTooltip_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  type Visible = boolean | null
  type Placement =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end'
  type Trigger = 'click' | 'focus' | 'hover' | 'contextmenu'
  type PopperClass = string
  type ShowArrow = boolean
  type Offset = number
  type VirtualRef = HTMLElement
  type VirtualTriggering = boolean
  type PopperOptions = Record<string, any>
  type Disabled = boolean
}
export const props = {
  visible: {
    type: Boolean as PropType<Props.Visible>,
    required: false,
    default: null,
    description: '是否顯示'
  },
  placement: {
    type: String as PropType<Props.Placement>,
    required: false,
    default: 'bottom',
    description: '顯示位置'
  },
  trigger: {
    type: String as PropType<Props.Trigger>,
    required: false,
    default: 'hover',
    description: '觸發方式'
  },
  popperClass: {
    type: String as PropType<Props.PopperClass>,
    required: false,
    default: '',
    description: 'class'
  },
  showArrow: {
    type: Boolean as PropType<Props.ShowArrow>,
    required: false,
    default: true,
    description: '是否顯示箭頭'
  },
  offset: {
    type: Number as PropType<Props.Offset>,
    required: false,
    default: 0,
    description: '定位偏移量'
  },
  enterable: {
    type: Boolean as PropType<Props.ShowArrow>,
    required: false,
    default: true,
    description: '滑鼠是否可進到 tooltip 中'
  },
  showAfter: {
    type: Number as PropType<Props.Offset>,
    required: false,
    default: 0,
    description: '觸發後多久顯示內容，單位毫秒'
  },
  virtualRef: {
    type: Object as PropType<Props.VirtualRef>,
    required: false,
    default: undefined,
    description: '觸發後多久顯示內容，單位毫秒'
  },
  virtualTriggering: {
    type: Boolean as PropType<Props.VirtualTriggering>,
    required: false,
    default: false,
    description: '觸發後多久顯示內容，單位毫秒'
  },
  popperOptions: {
    type: Object as PropType<Props.PopperOptions>,
    required: false,
    default () {
      return {}
    },
    description: '觸發後多久顯示內容，單位毫秒'
  },
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    required: false,
    default: false,
    description: '是否禁用'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
