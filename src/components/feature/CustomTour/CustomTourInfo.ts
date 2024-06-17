import type { PropType } from 'vue'

export const version = '1.0.0'

export declare namespace Custom {
  type Placement = 'top' | 'top-start' | 'top-end'
    |'bottom' | 'bottom-start' | 'bottom-end'
    |'left' | 'left-start' | 'left-end'
    |'right' | 'right-start' | 'right-end'

  type Step = {
    // Dom 元素
    target?: () => HTMLElement | HTMLElement | string
    title?: string // 標題
    description?: string // 說明
    showArrow?: boolean // 是否顯示箭頭
    placement?: Custom.Placement
  }
}

export declare namespace Props {
  type ModelValue = boolean
  type Current = number
  type ZIndex = number
  type ShowArrow = boolean
  type Placement = Custom.Placement
  type TargetAreaClickable = boolean
  type Steps = Array<Custom.Step>
}

export const props = {
  modelValue: {
    type: Boolean as PropType<Props.ModelValue>,
    required: true,
    description: '是否打開'
  },
  current: {
    type: Number as PropType<Props.Current>,
    required: false,
    default: 0,
    description: '當前步驟'
  },
  zIndex: {
    type: Number as PropType<Props.ZIndex>,
    required: false,
    default: 2001,
    description: 'z-index 目前無效'
  },
  showArrow: {
    type: Boolean as PropType<Props.ShowArrow>,
    required: false,
    default: false,
    description: '是否顯示箭頭'
  },
  placement: {
    type: String as PropType<Props.Placement>,
    required: false,
    default: 'bottom',
    description: '是否顯示箭頭'
  },
  targetAreaClickable: {
    type: Boolean as PropType<Props.TargetAreaClickable>,
    required: false,
    default: false,
    description: '引導中是否可點擊 steps 中的 target'
  },
  steps: {
    type: Array as PropType<Props.Steps>,
    required: false,
    default () {
      return []
    },
    description: '引導'
  }
}
