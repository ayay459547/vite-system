import type { PropType } from 'vue'

import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'

export const version = '__CustomAnchor_1.0.0__'

export interface Types {
  link: {
    title?: string // 標題
    i18nTitle?: string | string[] // 標題: i18nTranslate
    href?: string // 連結
    links?: Types['link'][]
  } | any
}

export interface Props {
  container: string | HTMLElement | Window
  offset: number
  bound: number
  duration: number
  marker: boolean
  type: 'default' | 'underline'
  direction: 'vertical' | 'horizontal'
  selectScrollTop: boolean

  links: Array<Types['link']>
  i18nModule: ScopeKey
}

export const props = {
  // Element UI
  container: {
    type: [String, Object] as PropType<Props['container']>,
    required: false,
    default: undefined,
    description: '滾動的容器'
  },
  offset: {
    type: Number as PropType<Props['offset']>,
    required: false,
    default: 0,
    description: '設定錨點滾動的偏移量'
  },
  bound: {
    type: Number as PropType<Props['bound']>,
    required: false,
    default: 15,
    description: '觸發錨點的元素的位置偏移量'
  },
  duration: {
    type: Number as PropType<Props['duration']>,
    required: false,
    default: 300,
    description: '設定容器滾動持續時間(毫秒)'
  },
  marker: {
    type: Boolean as PropType<Props['marker']>,
    required: false,
    default: true,
    description: '是否顯示標記'
  },
  type: {
    type: String as PropType<Props['type']>,
    required: false,
    default: 'default',
    description: '設定錨點類型'
  },
  direction: {
    type: String as PropType<Props['direction']>,
    required: false,
    default: 'vertical',
    description: '設定錨點方向'
  },
  selectScrollTop: {
    type: Boolean as PropType<Props['selectScrollTop']>,
    required: false,
    default: true,
    description: '捲動時，連結是否選取位於頂部'
  },
  // Custom
  links: {
    type: Array as PropType<Props['links']>,
    required: false,
    default: () => [],
    description: '連結'
  },
  i18nModule: {
    type: String as PropType<Props['i18nModule']>,
    required: false,
    default: defaultModuleType,
    description: `
      title, i18nTitle
      links 使用 i18nLabel 時套用的翻譯模組
    `
  }
}

export interface Emits {
  change: (href: string) => void
  click: ($event: MouseEvent, href?: string) => void
}

export interface Expose {
  scrollTo: (href: string) => void
}
