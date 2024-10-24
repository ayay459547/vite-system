import type { PropType, Ref } from 'vue'
import type { ElTourStep } from 'element-plus'

import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'

export const version = '__CustomTour_1.0.0__'

export declare namespace Types {
  type Placement =
    |'top' | 'top-start' | 'top-end'
    |'bottom' | 'bottom-start' | 'bottom-end'
    |'left' | 'left-start' | 'left-end'
    |'right' | 'right-start' | 'right-end'

  type Step = typeof ElTourStep | {
    // Dom 元素
    target?: HTMLElement | string | (() => HTMLElement) | Ref<any>
    title?: string // 標題
    i18nTitle?: string | string[] // 標題: i18nTranslate
    description?: string // 說明
    i18nDescription?: string | string[] // 說明: i18nTranslate
    showArrow?: boolean // 是否顯示箭頭
    placement?: Types.Placement
  }
}

export declare namespace Props {
  type ModelValue = boolean
  type Current = number
  type ZIndex = number
  type ShowArrow = boolean
  type Placement = Types.Placement
  type TargetAreaClickable = boolean

  type Steps = Array<Types.Step>
  type I18nModule = ScopeKey
}
export const props = {
  // Element UI
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
  // Custom
  steps: {
    type: Array as PropType<Props.Steps>,
    required: false,
    default () {
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
  }
}

export declare namespace Emits {
  type Close = (current: number) => void
  type Finish = () => void
  type Change = (current: number) => void
  type StepClose = () => void
}

export declare namespace Expose {}
