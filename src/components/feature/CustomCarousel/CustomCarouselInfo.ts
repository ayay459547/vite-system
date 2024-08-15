import type { PropType } from 'vue'

export const version = '1.0.0'

export type IndicatorTrigger = 'hover' | 'click'
export type IndicatorPosition = 'outside' | 'none' | undefined
export type ArrowTrigger = 'always' | 'hover' | 'never'
export type Type = 'card'
export type Direction = 'horizontal' | 'vertical'

export type CarouselItems = CarouselItem[]
export type CarouselItem = {
  name?: string
  label?: string
} & any

export const props = {
  height: {
    type: String as PropType<string>,
    default: '',
    description: `
      Carousel 的高度
    `
  },
  initialIndex: {
    type: Number as PropType<number>,
    default: 0,
    description: `
      預設開始展示的幻燈片 index
    `
  },
  trigger: {
    type: String as PropType<IndicatorTrigger>,
    default: 'hover',
    description: `
      指式物的觸發方式
    `
  },
  autoplay: {
    type: Boolean as PropType<boolean>,
    default: true,
    description: `
      是否自動切換
    `
  },
  interval: {
    type: Number as PropType<number>,
    default: 3000,
    description: `
      自動切換的時間間隔 單位:毫秒
      autoplay 為 true 時有效
    `
  },
  indicatorPosition: {
    type: String as PropType<IndicatorPosition>,
    description: `
      指式物的位置
    `
  },
  arrow: {
    type: String as PropType<ArrowTrigger>,
    default: 'hover',
    description: `
      切換箭頭的顯示時機
    `
  },
  type: {
    type: String as PropType<Type>,
    default: '',
    description: `
      Carousel的類型
    `
  },
  loop: {
    type: Boolean as PropType<boolean>,
    default: true,
    description: `
      是否循環顯示
    `
  },
  direction: {
    type: String as PropType<Direction>,
    default: 'horizontal',
    description: `
      展示的方向
    `
  },
  pauseOnHover: {
    type: Boolean as PropType<boolean>,
    default: true,
    description: `
      是否在 hover 時停止自動切換
    `
  },
  motionBlur: {
    type: Boolean as PropType<boolean>,
    default: true,
    description: `
      是否在切換時添加動態效果
    `
  },
  items: {
    type: Array as PropType<CarouselItems>,
    default: [],
    description: `
      Carousel Item 的列表
    `
  }
}
