import type { PropType } from 'vue'

export const version = '__CustomCarousel_1.0.0__'

export interface Types {
  indicatorTrigger: 'hover' | 'click'
  indicatorPosition: 'outside' | 'none' | undefined
  arrowTrigger: 'always' | 'hover' | 'never'
  type: 'card'
  direction: 'horizontal' | 'vertical'
  carouselItem: {
    name?: string
    label?: string
    [key: string]: any
  }
  carouselItems: Array<CarouselItem>
}

export type IndicatorTrigger = Types['indicatorTrigger']
export type IndicatorPosition = Types['indicatorPosition']
export type ArrowTrigger = Types['arrowTrigger']
export type Type = Types['type']
export type Direction = Types['direction']

export type CarouselItem = Types['carouselItem']
export type CarouselItems = Types['carouselItems']

export interface Props {
  height: string
  initialIndex: number
  trigger: Types['indicatorTrigger']
  autoplay: boolean
  interval: number
  indicatorPosition: Types['indicatorPosition']
  arrow: Types['arrowTrigger']
  type: Types['type']
  loop: boolean
  direction: Types['direction']
  pauseOnHover: boolean
  motionBlur: boolean
  items: Types['carouselItems']
}

export const props = {
  height: {
    type: String as PropType<Props['height']>,
    default: '',
    description: 'Carousel 的高度'
  },
  initialIndex: {
    type: Number as PropType<Props['initialIndex']>,
    default: 0,
    description: '預設開始展示的幻燈片 index'
  },
  trigger: {
    type: String as PropType<Props['trigger']>,
    default: 'hover',
    description: '指式物的觸發方式'
  },
  autoplay: {
    type: Boolean as PropType<Props['autoplay']>,
    default: true,
    description: '是否自動切換'
  },
  interval: {
    type: Number as PropType<Props['interval']>,
    default: 3000,
    description: `
      自動切換的時間間隔 單位:毫秒
      autoplay 為 true 時有效
    `
  },
  indicatorPosition: {
    type: String as PropType<Props['indicatorPosition']>,
    description: '指式物的位置'
  },
  arrow: {
    type: String as PropType<Props['arrow']>,
    default: 'hover',
    description: '切換箭頭的顯示時機'
  },
  type: {
    type: String as PropType<Props['type']>,
    default: '',
    description: 'Carousel的類型'
  },
  loop: {
    type: Boolean as PropType<Props['loop']>,
    default: true,
    description: '是否循環顯示'
  },
  direction: {
    type: String as PropType<Props['direction']>,
    default: 'horizontal',
    description: '展示的方向'
  },
  pauseOnHover: {
    type: Boolean as PropType<Props['pauseOnHover']>,
    default: true,
    description: '是否在 hover 時停止自動切換'
  },
  motionBlur: {
    type: Boolean as PropType<Props['motionBlur']>,
    default: true,
    description: '是否在切換時添加動態效果'
  },
  items: {
    type: Array as PropType<CarouselItems>,
    default: [],
    description: 'Carousel Item 的列表'
  }
}

export interface Emits {
  change: (curIndex: number, prevIndex: number) => void
}

export interface Expose {
  setActiveItem: (item: number | string) => void
  prev: () => void
  next: () => void
}
