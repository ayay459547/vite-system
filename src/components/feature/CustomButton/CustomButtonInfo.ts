import type { Component, PropType, CSSProperties } from 'vue'

import type { CustomSize, CustomIconProps } from '@/components'

export const version = '__CustomButton_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  type Size = CustomSize
  type Type = '' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
  type Text = boolean
  type Bg = boolean
  type Link = boolean
  type Plain = boolean
  type Round = boolean
  type Circle = boolean
  type Disabled = boolean
  type Icon = string | Component
  type Loading = boolean
  type LoadingIcon = string | Component
  type Autofocus = boolean
  type NativeType = 'button' | 'submit' | 'reset'
  type AutoInsertSpace = boolean
  type Color = string | undefined
  type Dark = boolean
  type Tag = string | Component

  type Label = string
  type IconSize = CustomSize
  type IconType = CustomIconProps.Type
  type IconXType = CustomIconProps.XType
  type IconName = string
  type IconMove = 'none' | 'translate'| 'rotate' | 'scale'
  type TextColor = string | undefined
  type Style = string | CSSProperties
}
export const props = {
  // Element UI
  size: {
    type: String as PropType<Props.Size>,
    required: false,
    default: undefined,
    description: '尺寸'
  },
  type: {
    type: String as PropType<Props.Type>,
    required: false,
    default: undefined,
    description: '類型'
  },
  plain: {
    type: Boolean as PropType<Props.Plain>,
    required: false,
    default: false,
    description: '是否為樸素按鈕'
  },
  text: {
    type: Boolean as PropType<Props.Text>,
    required: false,
    default: false,
    description: '是否為文字按鈕'
  },
  bg: {
    type: Boolean as PropType<Props.Bg>,
    required: false,
    default: false,
    description: '是否顯示文字按鈕背景顏色'
  },
  link: {
    type: Boolean as PropType<Props.Link>,
    required: false,
    default: false,
    description: '是否為連結按鈕'
  },
  round: {
    type: Boolean as PropType<Props.Round>,
    required: false,
    default: false,
    description: '是否為圓角按鈕'
  },
  circle: {
    type: Boolean as PropType<Props.Circle>,
    required: false,
    default: false,
    description: '是否為圓形按鈕'
  },
  loading: {
    type: Boolean as PropType<Props.Loading>,
    required: false,
    default: false,
    description: '是否為載入中狀態'
  },
  loadingIcon: {
    type: [String, Object] as PropType<Props.LoadingIcon>,
    required: false,
    default: undefined,
    description: '自訂載入中狀態圖示組件'
  },
  disabled: {
    type: Boolean as PropType<Props.Disabled>,
    required: false,
    default: false,
    description: '按鈕是否為停用狀態'
  },
  icon: {
    type: [String, Object] as PropType<Props.Icon>,
    required: false,
    default: undefined,
    description: '圖示組件'
  },
  autofocus: {
    type: Boolean as PropType<Props.Autofocus>,
    required: false,
    default: false,
    description: '原生 autofocus 屬性'
  },
  nativeType: {
    type: String as PropType<Props.NativeType>,
    required: false,
    default: 'button',
    description: '原生 type 屬性'
  },
  autoInsertSpace: {
    type: Boolean as PropType<Props.AutoInsertSpace>,
    required: false,
    default: undefined,
    description: '自動在兩個中文字元之間插入空格'
  },
  color: {
    type: String as PropType<Props.Color>,
    required: false,
    default: undefined,
    description: '自訂按鈕顏色, 並自動計算 hover 和 active 觸發後的顏色'
  },
  dark: {
    type: Boolean as PropType<Props.Dark>,
    required: false,
    default: false,
    description: 'dark 模式, 表示自動設定 color 為 dark 模式的顏色'
  },
  tag: {
    type: [String, Object] as PropType<Props.Tag>,
    required: false,
    default: 'button',
    description: '自訂元素標籤'
  },
  // Custom
  label: {
    type: String as PropType<Props.Label>,
    required: false,
    default: '',
    description: '文字'
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
  iconXType: {
    type: String as PropType<Props.IconXType>,
    required: false,
    default: '',
    description: '前綴圖示類型 參考 XIcon'
  },
  iconName: {
    type: String as PropType<Props.IconName>,
    required: false,
    default: '',
    description: '前綴圖示 參考 fontawesome/XIcon'
  },
  iconMove: {
    type: String as PropType<Props.IconMove>,
    required: false,
    default: 'none',
    description: 'hover後 的效果'
  },
  textColor: {
    type: String as PropType<Props.TextColor>,
    required: false,
    default: undefined,
    description: '文字顏色'
  },
  style: {
    type: [String, Object] as PropType<Props.Style>,
    default: '',
    description: '自訂樣式'
  },
  // tsx event
  onClick: Function as PropType<(e: MouseEvent) => void>
}

export declare namespace Emits {
  type Click = ($event: Event) => void
}

export declare namespace Expose {}
