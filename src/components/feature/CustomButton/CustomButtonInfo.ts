import type { PropType } from 'vue'

import type { CustomSize, IconProps } from '@/components'

export const version = '1.0.0'

export declare namespace Props {
  type Label = string
  type Size = CustomSize
  type Type = '' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
  type Text = boolean
  type Plain = boolean
  type Round = boolean
  type Circle = boolean
  type Disabled = boolean
  type Loading = boolean
  type Color = string | undefined
  type TextColor = string | undefined
  type Dark = boolean
  type IconSize = CustomSize
  type IconType = IconProps.Type
  type IconName = string
  type IconMove = 'none' | 'translate'| 'rotate' | 'scale'
  type Style = string | Record<string, string>
}

export const props = {
  label: {
    type: String as PropType<Props.Label>,
    required: false,
    default: '',
    description: '文字'
  },
  size: {
    type: String as PropType<Props.Size>,
    required: false,
    default: 'default',
    description: 'Button尺寸'
  },
  type: {
    type: String as PropType<Props.Type>,
    required: false,
    default: '',
    description: '類型 對應到不同顏色'
  },
  text: {
    type: Boolean as PropType<Props.Text>,
    required: false,
    default: false,
    description: '外型樣式'
  },
  plain: {
    type: Boolean as PropType<Props.Plain>,
    required: false,
    default: false,
    description: '外型樣式'
  },
  round: {
    type: Boolean as PropType<Props.Round>,
    required: false,
    default: false,
    description: '外型樣式-圓角'
  },
  circle: {
    type: Boolean as PropType<Props.Circle>,
    required: false,
    default: false,
    description: '外型樣式-圓形'
  },
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    required: false,
    default: false,
    description: '不可點擊'
  },
  loading: {
    type: Boolean as PropType<Props.Loading>,
    required: false,
    default: false,
    description: '讀取中(無法點擊)'
  },
  color: {
    type: String as PropType<Props.Color>,
    required: false,
    default: undefined,
    description: '顏色'
  },
  textColor: {
    type: String as PropType<Props.TextColor>,
    required: false,
    default: undefined,
    description: '文字顏色'
  },
  dark: {
    type: Boolean as PropType<Props.Dark>,
    required: false,
    default: false,
    description: '是否為深色模式'
  },
  iconSize: {
    type: String as PropType<Props.IconSize>,
    required: false,
    default: 'default',
    description: 'Icon尺寸'
  },
  iconType: {
    type: String as PropType<Props.IconType>,
    required: false,
    default: 'fas',
    description: '前綴圖示類型 參考 fontawesome'
  },
  iconName: {
    type: String as PropType<Props.IconName>,
    required: false,
    default: '',
    description: '前綴圖示 參考 fontawesome'
  },
  iconMove: {
    type: String as PropType<Props.IconMove>,
    required: false,
    default: 'none',
    description: 'hover後 的效果'
  },
  style: {
    type: [String, Object] as PropType<Props.Style>,
    default: '',
    description: `
      ElButton 使用的style
      以 Object 格式輸入
    `
  },
  // tsx event
  onClick: Function as PropType<(e: MouseEvent) => void>
}

export declare namespace Emits {
  type Click = ($event: Event) => void
}
