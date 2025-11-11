import type { PropType, WritableComputedRef, Ref, CSSProperties } from 'vue'
import type { Placement as ElPlacement } from 'element-plus'

import type { CustomEffect } from '@/components' // 系統組件

export const version = '__CustomPopover_1.0.0__'

export interface Types {}

export interface Props {
  trigger: 'click' | 'focus' | 'hover' | 'contextmenu'
  title: string
  effect: CustomEffect
  content: string
  width: number | string
  placement: ElPlacement
  disabled: boolean
  visible: Ref<boolean> | WritableComputedRef<boolean> | boolean | null
  Offset: number
  transition: string
  showArrow: boolean
  popperOptions: Record<string, any>
  popperClass: string
  popperStyle: string | CSSProperties
  showAfter: number
  hideAfter: number
  autoClose: number
  tabindex: string | number
  teleported: boolean
  persistent: boolean

  virtualRef: HTMLElement
  virtualTriggering: boolean
}
export const props = {
  trigger: {
    type: String as PropType<Props['trigger']>,
    required: false,
    default: 'click',
    description: '觸發方式'
  },
  title: {
    type: String as PropType<Props['title']>,
    required: false,
    default: '',
    description: '標題'
  },
  effect: {
    type: String as PropType<Props['effect']>,
    required: false,
    default: 'light',
    description: 'tooltip 主題，內建了 dark / light 兩種'
  },
  content: {
    type: String as PropType<Props['content']>,
    required: false,
    default: undefined,
    description: '顯示的內容，也可以透過寫入預設 slot 修改顯示內容'
  },
  width: {
    type: [Number, String] as PropType<Props['width']>,
    required: false,
    default: 150,
    description: '寬度'
  },
  placement: {
    type: String as PropType<Props['placement']>,
    required: false,
    default: 'top',
    description: '顯示位置'
  },
  disabled: {
    type: Boolean as PropType<Props['disabled']>,
    required: false,
    default: false,
    description: '是否禁用'
  },
  visible: {
    type: [Object, Boolean] as PropType<Props['visible']>,
    required: false,
    default: undefined,
    description: '是否顯示'
  },
  offset: {
    type: Number as PropType<Props['Offset']>,
    required: false,
    default: 0,
    description: '定位偏移量'
  },
  transition: {
    type: String as PropType<Props['transition']>,
    required: false,
    default: undefined,
    description: '動畫名稱'
  },
  showArrow: {
    type: Boolean as PropType<Props['showArrow']>,
    required: false,
    default: true,
    description: '是否顯示箭頭'
  },
  popperOptions: {
    type: Object as PropType<Props['popperOptions']>,
    required: false,
    default: () => {
      return {}
    },
    description: `
      popper.js 参数
      https://popper.js.org/docs/v2/
    `
  },
  popperClass: {
    type: String as PropType<Props['popperClass']>,
    required: false,
    default: '',
    description: 'class'
  },
  popperStyle: {
    type: [Object, String] as PropType<Props['popperStyle']>,
    required: false,
    default: '',
    description: 'style'
  },
  showAfter: {
    type: Number as PropType<Props['showAfter']>,
    required: false,
    default: 0,
    description: '觸發後多久顯示內容，單位毫秒'
  },
  hideAfter: {
    type: Number as PropType<Props['hideAfter']>,
    required: false,
    default: 0,
    description: '觸發後多久顯示內容，單位毫秒'
  },
  autoClose: {
    type: Number as PropType<Props['autoClose']>,
    required: false,
    default: 0,
    description: 'tooltip 出現後自動隱藏式延遲，單位毫秒'
  },
  tabindex: {
    type: [String, Number] as PropType<Props['tabindex']>,
    required: false,
    default: 0,
    description: 'Popover 组件的 tabindex'
  },
  teleported: {
    type: Boolean as PropType<Props['teleported']>,
    required: false,
    default: true,
    description: '是否將 popover body'
  },
  persistent: {
    type: Boolean as PropType<Props['persistent']>,
    required: false,
    default: undefined,
    description: `
      當 popover 元件長時間不觸發且 persistent 屬性設定為 false 時，
      popover 將會被刪除
    `
  },
  // v-popover
  virtualRef: {
    type: [Object, null] as PropType<Props['virtualRef']>,
    required: false,
    default: null,
    description: 'virtual-ref'
  },
  virtualTriggering: {
    type: Boolean as PropType<Props['virtualTriggering']>,
    required: false,
    default: false,
    description: 'virtual-triggering'
  }
}

export interface Emits {}

export interface Expose {}
