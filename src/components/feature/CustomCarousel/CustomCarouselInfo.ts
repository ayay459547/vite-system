import type { PropType } from 'vue'

export const version = '1.0.0'

export declare namespace Custom {
  type IndicatorTrigger = 'hover' | 'click'
  type IndicatorPosition = 'outside' | 'none' | undefined
  type ArrowTrigger = 'always' | 'hover' | 'never'
  type Type = 'card'
  type Direction = 'horizontal' | 'vertical'
  type CarouselItem = {
    name?: string
    label?: string
  } & any
  type CarouselItems = Array<CarouselItem>
}

export type IndicatorTrigger = Custom.IndicatorTrigger
export type IndicatorPosition = Custom.IndicatorPosition
export type ArrowTrigger = Custom.ArrowTrigger
export type Type = Custom.Type
export type Direction = Custom.Direction

export type CarouselItem = Custom.CarouselItem
export type CarouselItems = Custom.CarouselItems

export declare namespace Props {
  type Height = string
  type InitialIndex = number
  type Trigger = Custom.IndicatorTrigger
  type Autoplay = boolean
  type Interval = number
  type IndicatorPosition = Custom.IndicatorPosition
  type Arrow = Custom.ArrowTrigger
  type Type = Custom.Type
  type Loop = boolean
  type Direction = Custom.Direction
  type PauseOnHover = boolean
  type MotionBlur = boolean
  type Items = Custom.CarouselItems
}

export const props = {
  height: {
    type: String as PropType<Props.Height>,
    default: '',
    description: 'Carousel 的高度'
  },
  initialIndex: {
    type: Number as PropType<Props.InitialIndex>,
    default: 0,
    description: '預設開始展示的幻燈片 index'
  },
  trigger: {
    type: String as PropType<Props.Trigger>,
    default: 'hover',
    description: '指式物的觸發方式'
  },
  autoplay: {
    type: Boolean as PropType<Props.Autoplay>,
    default: true,
    description: '是否自動切換'
  },
  interval: {
    type: Number as PropType<Props.Interval>,
    default: 3000,
    description: `
      自動切換的時間間隔 單位:毫秒
      autoplay 為 true 時有效
    `
  },
  indicatorPosition: {
    type: String as PropType<Props.IndicatorPosition>,
    description: '指式物的位置'
  },
  arrow: {
    type: String as PropType<Props.Arrow>,
    default: 'hover',
    description: '切換箭頭的顯示時機'
  },
  type: {
    type: String as PropType<Props.Type>,
    default: '',
    description: 'Carousel的類型'
  },
  loop: {
    type: Boolean as PropType<Props.Loop>,
    default: true,
    description: '是否循環顯示'
  },
  direction: {
    type: String as PropType<Props.Direction>,
    default: 'horizontal',
    description: '展示的方向'
  },
  pauseOnHover: {
    type: Boolean as PropType<Props.PauseOnHover>,
    default: true,
    description: '是否在 hover 時停止自動切換'
  },
  motionBlur: {
    type: Boolean as PropType<Props.MotionBlur>,
    default: true,
    description: '是否在切換時添加動態效果'
  },
  items: {
    type: Array as PropType<CarouselItems>,
    default: [],
    description: 'Carousel Item 的列表'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
