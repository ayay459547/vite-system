import type { PropType } from 'vue'

export const version = '1.0.0'

export declare namespace Custom {
  type FontWeight = 'normal' | 'light' | 'weight' | number
  type FontStyle = 'none' | 'normal' | 'italic' | 'oblique'
  type TextAlign = 'left' | 'right' | 'center' | 'start' | 'end'
  type TextBaseline = 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom'


  type Font = {
    color?: string
    fontSize?: number
    fontWeight?: Custom.FontWeight
    fontFamily?: string
    fontStyle?: Custom.FontStyle
    textAlign?: Custom.TextAlign
    textBaseline?: Custom.TextBaseline
  }
}

export declare namespace Props {
  type Width = number
  type Height = number
  type Rotate = number
  type ZIndex = number
  type Image = string
  type Content = string | string[]
  type Font = Custom.Font
  type Gap = [number, number]
  type offset = [number, number]
}

export const props = {
  width: {
    type: Number as PropType<Props.Width>,
    required: false,
    default: 120,
    description: '浮水印 的寬度'
  },
  height: {
    type: Number as PropType<Props.Height>,
    required: false,
    default: 64,
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
    description: `
      浮水印 的 zIndex`
  },
  image: {
    type: [String] as PropType<Props.Image>,
    required: false,
    default: '',
    description: `
      浮水印 顯示的圖片，優先序高於 content
      圖片尺寸由 width , height 定義
    `
  },
  content: {
    type: [String, Array] as PropType<Props.Content>,
    required: false,
    default: '',
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
      }`
  },
  gap: {
    type: Object as PropType<Props.Gap>,
    required: false,
    default: [100, 100],
    description: `
      浮水印 之間的 [ x , y ] 相隔間距`
  },
  offset: {
    type: Object as PropType<Props.offset>,
    required: false,
    default: undefined,
    description: `
      浮水印 的 [ x , y ] 位移量
      預設值為gap的一半
    `
  }
}