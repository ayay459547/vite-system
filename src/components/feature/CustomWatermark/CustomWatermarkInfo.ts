import type { PropType } from 'vue'

export const version = '__CustomWatermark_1.0.0__'
const system = (import.meta as any).env.VITE_API_SYSTEM_TYPE

export declare namespace Types {
  type FontWeight = 'normal' | 'light' | 'weight' | number
  type FontStyle = 'none' | 'normal' | 'italic' | 'oblique'
  type TextAlign = 'left' | 'right' | 'center' | 'start' | 'end'
  type TextBaseline = 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom'
  type Font = {
    color?: string
    fontSize?: number
    fontWeight?: FontWeight
    fontFamily?: string
    fontStyle?: FontStyle
    textAlign?: TextAlign
    textBaseline?: TextBaseline
  }
  type SubWatermark = {
    content?: string | string[]
    font?: Font
    image?: string
    width?: number
    height?: number
    shift?: [number, number, number]
  }
}

export declare namespace Props {
  type Width = number
  type Height = number
  type Rotate = number
  type ZIndex = number
  type Image = string
  type Content = string | string[]
  type Font = Types.Font
  type Gap = [number, number]
  type Offset = [number, number]
  type SizeFit = 'parent' | 'children'
  type Sub = Array<Types.SubWatermark>
}
export const props = {
  width: {
    type: Number as PropType<Props.Width>,
    required: false,
    default: undefined,
    description: '浮水印 的寬度'
  },
  height: {
    type: Number as PropType<Props.Height>,
    required: false,
    default: undefined,
    description: '浮水印 的高度'
  },
  rotate: {
    type: Number as PropType<Props.Rotate>,
    required: false,
    default: -22,
    description: `
      旋轉角度
      正數為順時針方向，可為負值
    `
  },
  zIndex: {
    type: Number as PropType<Props.ZIndex>,
    required: false,
    default: 9,
    description: '浮水印 的 zIndex'
  },
  image: {
    type: [String] as PropType<Props.Image>,
    required: false,
    default: undefined,
    description: `
      浮水印 顯示的圖片，優先序高於 content
      圖片尺寸由 width , height 定義
    `
  },
  content: {
    type: [String, Array] as PropType<Props.Content>,
    required: false,
    default: system,
    description: `
      浮水印 顯示的文字內容，優先序低於 imgae
      字體設定由 font 定義
    `
  },
  font: {
    type: Object as PropType<Props.Font>,
    required: false,
    default: undefined,
    description: `
      浮水印 顯示的字體格式，屬性皆為選填
      {
        color 顏色
        fontSize 大小
        fontWeight 粗細
        fontFamily 字型
        fontStyle 字型的變體
        textAlign 文字於水平軸對齊位置
        textBaseline 文字於垂直軸的基線
      }
    `
  },
  gap: {
    type: Object as PropType<Props.Gap>,
    required: false,
    default: [100, 100],
    description: '浮水印 之間的 [ x , y ] 相隔間距'
  },
  offset: {
    type: Object as PropType<Props.Offset>,
    required: false,
    default: undefined,
    description: '浮水印 的 [ x , y ] 位移量，預設值為gap的一半'
  },
  sizeFit: {
    type: String as PropType<Props.SizeFit>,
    required: false,
    default: 'parent',
    description: `
      浮水印覆蓋的範圍，預設為 'parent'
      'parent' : 自動填滿父層元素
      'children' : 根據內含元素大小調整
    `
  },
  sub: {
    type: Object as PropType<Props.Sub>,
    required: false,
    default: [],
    description: `
      Array of {content?, font?, image?, width?, height?, shift?:[x, y, z]}
      content image shift 預設為空值
      其餘屬性預設皆與主浮水印相同
      增加的浮水印數量等同於陣列中存在的物件數
      
      shift定義子浮水印的位移，受rotate影響
    `
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
