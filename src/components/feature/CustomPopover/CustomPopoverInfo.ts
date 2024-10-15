import type { PropType, CSSProperties } from 'vue'

export const version = '__CustomPopover_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  type Visible = boolean | null
  type Width = number | string
  type Title = string
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
  type PopperStyle = string | CSSProperties
  type ShowArrow = boolean
  type Offset = number
  type VirtualRef = HTMLElement
  type VirtualTriggering = boolean
}
export const props = {
  visible: {
    type: Boolean as PropType<Props.Visible>,
    required: false,
    default: null,
    description: '是否顯示'
  },
  width: {
    type: [Number, String] as PropType<Props.Width>,
    required: false,
    default: 150,
    description: '寬度'
  },
  title: {
    type: String as PropType<Props.Title>,
    required: false,
    default: '',
    description: '標題'
  },
  placement: {
    type: String as PropType<Props.Placement>,
    required: false,
    default: 'top',
    description: '顯示位置'
  },
  trigger: {
    type: String as PropType<Props.Trigger>,
    required: false,
    default: 'click',
    description: '觸發方式'
  },
  popperClass: {
    type: String as PropType<Props.PopperClass>,
    required: false,
    default: '',
    description: 'class'
  },
  popperStyle: {
    type: String as PropType<Props.PopperStyle>,
    required: false,
    default: '',
    description: 'style'
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
  virtualRef: {
    type: [Object, null] as PropType<Props.VirtualRef>,
    required: false,
    default: null,
    description: 'virtual-ref'
  },
  virtualTriggering: {
    type: Boolean as PropType<Props.VirtualTriggering>,
    required: false,
    default: false,
    description: 'virtual-triggering'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
