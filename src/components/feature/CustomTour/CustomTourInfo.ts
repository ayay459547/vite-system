import type { PropType, Ref, CSSProperties, Component, VNode } from 'vue'
import type { ElTourStep } from 'element-plus'

import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'

export const version = '__CustomTour_1.0.0__'

export declare namespace Types {
  type ContentStyle = CSSProperties
  type Mask = boolean | { style?: CSSProperties; color?: string; }
  type Type = 'default' | 'primary'
  type _ScrollIntoViewOptions_ = boolean | ScrollIntoViewOptions

  type Step = typeof ElTourStep | {
    target?: HTMLElement | string | (() => HTMLElement) | Ref<any> // Dom 元素
    showArrow?: boolean // 是否顯示箭頭
    title?: string // 標題
    description?: string // 說明
    placement?: string | any
    contentStyle: Types.ContentStyle
    mask?: Types.Mask
    type?: Types.Type
    nextButtonProps?: { children: VNode | string; onClick: Function }
    prevButtonProps?: { children: VNode | string; onClick: Function }
    scrollIntoViewOptions?: Types._ScrollIntoViewOptions_
    showClose: boolean
    closeIcon: string | Component

    i18nTitle?: string | string[] // 標題: i18nTranslate
    i18nDescription?: string | string[] // 說明: i18nTranslate
  }
}

export declare namespace Props {
  type Steps = Array<Types.Step>
  type I18nModule = ScopeKey

  type ShowArrow = boolean
  type Placement = string | any
  type ContentStyle = Types.ContentStyle
  type Mask = Types.Mask
  type Type = Types.Type
  type ModelValue = boolean
  type Current = number
  type ScrollIntoViewOptions = Types._ScrollIntoViewOptions_
  type ZIndex = number
  type ShowClose = boolean
  type CloseIcon = string | Component
  type CloseOnPressEscape = boolean
  type TargetAreaClickable = boolean
}
export const props = {
  // custom
  steps: {
    type: Array as PropType<Props.Steps>,
    required: false,
    default() {
      return []
    },
    description: '引導'
  },
  i18nModule: {
    type: String as PropType<Props.I18nModule>,
    required: false,
    default: defaultModuleType,
    description: `
      title, i18nTitle
      steps 使用 i18nLabel 時套用的翻譯模組
    `
  },
  // element plus ui
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
  contentStyle: {
    type: [Object, String] as PropType<Props.ContentStyle>,
    required: false,
    default: undefined,
    description: '為內容自訂樣式'
  },
  mask: {
    type: [Boolean, Object] as PropType<Props.Mask>,
    required: false,
    default: true,
    description: '為內容自訂樣式'
  },
  type: {
    type: String as PropType<Props.Type>,
    required: false,
    default: 'default',
    description: '類型，影響底色與文字顏色'
  },
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
  scrollIntoViewOptions: {
    type: [Boolean, Object] as PropType<Props.ScrollIntoViewOptions>,
    required: false,
    default: undefined,
    description: '是否支援目前元素捲動到視窗內，也可傳入配置指定捲動視窗的相關參數'
  },
  zIndex: {
    type: Number as PropType<Props.ZIndex>,
    required: false,
    default: 2001,
    description: 'z-index 目前無效'
  },
  showClose: {
    type: Boolean as PropType<Props.ShowClose>,
    required: false,
    default: false,
    description: '是否顯示關閉按鈕'
  },
  closeIcon: {
    type: [String, Object] as PropType<Props.CloseIcon>,
    required: false,
    default: undefined,
    description: '自訂關閉圖標，預設Close'
  },
  closeOnPressEscape: {
    type: Boolean as PropType<Props.CloseOnPressEscape>,
    required: false,
    default: true,
    description: '是否可以按下 ESC 關閉引導'
  },
  targetAreaClickable: {
    type: Boolean as PropType<Props.TargetAreaClickable>,
    required: false,
    default: true,
    description: '引導中是否可點擊 steps 中的 target'
  }
}

export declare namespace Emits {
  type Close = (current: number) => void
  type Finish = () => void
  type Change = (current: number) => void
  type StepClose = () => void
}

export declare namespace Expose {}
