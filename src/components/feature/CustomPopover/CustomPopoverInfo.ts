import type { PropType, CSSProperties } from 'vue'
import type { Placement as ElPlacement } from 'element-plus'

import type { CustomEffect } from '@/components' // 系統組件

export const version = '__CustomPopover_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  type Trigger = 'click' | 'focus' | 'hover' | 'contextmenu'
  type Title = string
  type Effect = CustomEffect
  type Content = string
  type Width = number | string
  type Placement = ElPlacement
  type Disabled = boolean
  type Visible = boolean | null
  type Offset = number
  type Transition = string
  type ShowArrow = boolean
  type PopperOptions = Record<string, any>
  type PopperClass = string
  type PopperStyle = string | CSSProperties
  type ShowAfter = number
  type HideAfter = number
  type AutoClose = number
  type Tabindex = string | number
  type Teleported = boolean
  type Persistent = boolean

  type VirtualRef = HTMLElement
  type VirtualTriggering = boolean
}
export const props = {
  trigger: {
    type: String as PropType<Props.Trigger>,
    required: false,
    default: 'click',
    description: '觸發方式'
  },
  title: {
    type: String as PropType<Props.Title>,
    required: false,
    default: '',
    description: '標題'
  },
  effect: {
    type: String as PropType<Props.Effect>,
    required: false,
    default: 'light',
    description: 'tooltip 主題，內建了 dark / light 兩種'
  },
  content: {
    type: String as PropType<Props.Content>,
    required: false,
    default: undefined,
    description: '顯示的內容，也可以透過寫入預設 slot 修改顯示內容'
  },
  width: {
    type: [Number, String] as PropType<Props.Width>,
    required: false,
    default: 150,
    description: '寬度'
  },
  placement: {
    type: String as PropType<Props.Placement>,
    required: false,
    default: 'top',
    description: '顯示位置'
  },
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    required: false,
    default: false,
    description: '是否禁用'
  },
  visible: {
    type: Boolean as PropType<Props.Visible>,
    required: false,
    default: null,
    description: '是否顯示'
  },
  offset: {
    type: Number as PropType<Props.Offset>,
    required: false,
    default: 0,
    description: '定位偏移量'
  },
  transition: {
    type: String as PropType<Props.Transition>,
    required: false,
    default: undefined,
    description: '動畫名稱'
  },
  showArrow: {
    type: Boolean as PropType<Props.ShowArrow>,
    required: false,
    default: true,
    description: '是否顯示箭頭'
  },
  popperOptions: {
    type: Object as PropType<Props.PopperOptions>,
    required: false,
    default() {
      return {}
    },
    description: `
      popper.js 参数
      https://popper.js.org/docs/v2/
    `
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
  showAfter: {
    type: Number as PropType<Props.ShowAfter>,
    required: false,
    default: 0,
    description: '觸發後多久顯示內容，單位毫秒'
  },
  hideAfter: {
    type: Number as PropType<Props.HideAfter>,
    required: false,
    default: 0,
    description: '觸發後多久顯示內容，單位毫秒'
  },
  autoClose: {
    type: Number as PropType<Props.AutoClose>,
    required: false,
    default: 0,
    description: 'tooltip 出現後自動隱藏式延遲，單位毫秒'
  },
  tabindex: {
    type: [String, Number] as PropType<Props.Tabindex>,
    required: false,
    default: 0,
    description: 'Popover 组件的 tabindex'
  },
  teleported: {
    type: Boolean as PropType<Props.Teleported>,
    required: false,
    default: true,
    description: '是否將 popover 的下拉清單插入至 body'
  },
  persistent: {
    type: Boolean as PropType<Props.Persistent>,
    required: false,
    default: undefined,
    description: `    
      當 popover 元件長時間不觸發且 persistent 屬性設定為 false 時，
      popover 將會被刪除
    `
  },
  // v-popover
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
