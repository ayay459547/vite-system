import type { PropType, Ref, CSSProperties, Component, VNode } from 'vue'
import type { ElTourStep } from 'element-plus'

import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'

export const version = '__CustomTour_1.0.0__'

export interface Types {
  contentStyle: CSSProperties
  mask: boolean | { style?: CSSProperties; color?: string; }
  type: 'default' | 'primary'
  _scrollIntoViewOptions_: boolean | ScrollIntoViewOptions

  step: typeof ElTourStep & {
    target?: HTMLElement | string | (() => HTMLElement) | Ref<any> // Dom 元素
    showArrow?: boolean // 是否顯示箭頭
    title?: string // 標題
    description?: string // 說明
    placement?: string | any
    contentStyle: Types['contentStyle']
    mask?: Types['mask']
    type?: Types['type']
    nextButtonProps?: { children: VNode | string; onClick: Function }
    prevButtonProps?: { children: VNode | string; onClick: Function }
    scrollIntoViewOptions?: Types['_scrollIntoViewOptions_']
    showClose: boolean
    closeIcon: string | Component

    i18nTitle?: string | string[] // 標題: i18nTranslate
    i18nDescription?: string | string[] // 說明: i18nTranslate
  } | any
}

export interface Props {
  steps: Array<Types['step']>
  i18nModule: ScopeKey

  showArrow: boolean
  placement: string | any
  contentStyle: Types['contentStyle']
  mask: Types['mask']
  type: Types['type']
  modelValue: boolean
  current: number
  scrollIntoViewOptions: Types['_scrollIntoViewOptions_']
  zIndex: number
  showClose: boolean
  closeIcon: string | Component
  closeOnPressEscape: boolean
  targetAreaClickable: boolean
}
export const props = {
  // custom
  steps: {
    type: Array as PropType<Props['steps']>,
    required: false,
    default: () => [],
    description: '引導'
  },
  i18nModule: {
    type: String as PropType<Props['i18nModule']>,
    required: false,
    default: defaultModuleType,
    description: `
      title, i18nTitle
      steps 使用 i18nLabel 時套用的翻譯模組
    `
  },
  // element plus ui
  showArrow: {
    type: Boolean as PropType<Props['showArrow']>,
    required: false,
    default: false,
    description: '是否顯示箭頭'
  },
  placement: {
    type: String as PropType<Props['placement']>,
    required: false,
    default: 'bottom',
    description: '是否顯示箭頭'
  },
  contentStyle: {
    type: [Object, String] as PropType<Props['contentStyle']>,
    required: false,
    default: undefined,
    description: '為內容自訂樣式'
  },
  mask: {
    type: [Boolean, Object] as PropType<Props['mask']>,
    required: false,
    default: true,
    description: '為內容自訂樣式'
  },
  type: {
    type: String as PropType<Props['type']>,
    required: false,
    default: 'default',
    description: '類型，影響底色與文字顏色'
  },
  modelValue: {
    type: Boolean as PropType<Props['modelValue']>,
    required: true,
    description: '是否打開'
  },
  current: {
    type: Number as PropType<Props['current']>,
    required: false,
    default: 0,
    description: '當前步驟'
  },
  scrollIntoViewOptions: {
    type: [Boolean, Object] as PropType<Props['scrollIntoViewOptions']>,
    required: false,
    default: undefined,
    description: '是否支援目前元素捲動到視窗內，也可傳入配置指定捲動視窗的相關參數'
  },
  zIndex: {
    type: Number as PropType<Props['zIndex']>,
    required: false,
    default: 2001,
    description: 'z-index 目前無效'
  },
  showClose: {
    type: Boolean as PropType<Props['showClose']>,
    required: false,
    default: false,
    description: '是否顯示關閉按鈕'
  },
  closeIcon: {
    type: [String, Object] as PropType<Props['closeIcon']>,
    required: false,
    default: undefined,
    description: '自訂關閉圖標，預設Close'
  },
  closeOnPressEscape: {
    type: Boolean as PropType<Props['closeOnPressEscape']>,
    required: false,
    default: true,
    description: '是否可以按下 ESC 關閉引導'
  },
  targetAreaClickable: {
    type: Boolean as PropType<Props['targetAreaClickable']>,
    required: false,
    default: true,
    description: '引導中是否可點擊 steps 中的 target'
  }
}

export interface Emits {
  close: (current: number) => void
  finish: () => void
  change: (current: number) => void
  stepClose: () => void
}

export interface Expose {}
