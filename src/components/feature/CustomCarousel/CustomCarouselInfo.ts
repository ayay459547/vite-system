import type { PropType } from 'vue'

export const version = '__CustomCarousel_1.0.0__'

export declare namespace Types {
  type IndicatorTrigger = 'hover' | 'click'
  type IndicatorPosition = 'outside' | 'none' | undefined
  type ArrowTrigger = 'always' | 'hover' | 'never'
  type Type = 'card'
  type Direction = 'horizontal' | 'vertical'
  type CarouselItem = {
    name?: string
    label?: string
    [key: string]: any
  }
  type CarouselItems = Array<CarouselItem>
}

export type IndicatorTrigger = Types.IndicatorTrigger
export type IndicatorPosition = Types.IndicatorPosition
export type ArrowTrigger = Types.ArrowTrigger
export type Type = Types.Type
export type Direction = Types.Direction

export type CarouselItem = Types.CarouselItem
export type CarouselItems = Types.CarouselItems

export declare namespace Props {
  type Height = string
  type InitialIndex = number
  type Trigger = Types.IndicatorTrigger
  type Autoplay = boolean
  type Interval = number
  type IndicatorPosition = Types.IndicatorPosition
  type Arrow = Types.ArrowTrigger
  type Type = Types.Type
  type Loop = boolean
  type Direction = Types.Direction
  type PauseOnHover = boolean
  type MotionBlur = boolean
  type Items = Types.CarouselItems
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

export declare namespace Emits {
  type Change = (curIndex: number, prevIndex: number) => void
}

export declare namespace Expose {
  type SetActiveItem = (item: number | string) => void
  type Prev = () => void
  type Next = () => void
}
