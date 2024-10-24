import type { PropType } from 'vue'

import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'

export const version = '__CustomAnchor_1.0.0__'

export declare namespace Types {
  type Link = {
    title?: string // 標題
    i18nTitle?: string | string[] // 標題: i18nTranslate
    href?: string // 連結
    links?: Link[]
  }
}

export declare namespace Props {
  type Container = string | HTMLElement | Window
  type Offset = number
  type Bound = number
  type Duration = number
  type Marker = boolean
  type Type = 'default' | 'underline'
  type Direction = 'vertical' | 'horizontal'

  type Links = Array<Types.Link>
  type I18nModule = ScopeKey
}

export const props = {
  // Element UI
  container: {
    type: [String, Object] as PropType<Props.Container>,
    required: false,
    default: undefined,
    description: '滾動的容器'
  },
  offset: {
    type: Number as PropType<Props.Offset>,
    required: false,
    default: 0,
    description: '設定錨點滾動的偏移量'
  },
  bound: {
    type: Number as PropType<Props.Bound>,
    required: false,
    default: 15,
    description: '觸發錨點的元素的位置偏移量'
  },
  duration: {
    type: Number as PropType<Props.Duration>,
    required: false,
    default: 300,
    description: '設定容器滾動持續時間(毫秒)'
  },
  marker: {
    type: Boolean as PropType<Props.Marker>,
    required: false,
    default: true,
    description: '是否顯示標記'
  },
  type: {
    type: String as PropType<Props.Type>,
    required: false,
    default: 'default',
    description: '設定錨點類型'
  },
  direction: {
    type: String as PropType<Props.Direction>,
    required: false,
    default: 'vertical',
    description: '設定錨點方向'
  },
  // Custom
  links: {
    type: Array as PropType<Props.Links>,
    required: false,
    default () {
      return []
    },
    description: '連結'
  },
  i18nModule: {
    type: String as PropType<Props.I18nModule>,
    required: false,
    default: defaultModuleType,
    description: `
      title, i18nTitle
      links 使用 i18nLabel 時套用的翻譯模組
    `
  }
}

export declare namespace Emits {
  type Change = (href: string) => void
  type Click = ($event: MouseEvent, href?: string) => void
}

export declare namespace Expose {
  type ScrollTo = (href: string) => void
}
