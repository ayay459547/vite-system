import type { Component, PropType, CSSProperties } from 'vue'

import type { CustomSize } from '@/components' // 系統組件
import type { CustomIconProps } from '@/components/feature' // 系統組件: 功能

export const version = '__CustomButton_1.0.0__'

export interface Types {}

export interface Props {
  size: CustomSize
  type: '' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
  plain: boolean
  text: boolean
  bg: boolean
  link: boolean
  round: boolean
  circle: boolean
  disabled: boolean
  icon: string | Component
  loading: boolean
  loadingIcon: string | Component
  autofocus: boolean
  nativeType: 'button' | 'submit' | 'reset'
  autoInsertSpace: boolean
  color: string | undefined
  dark: boolean
  tag: string | Component

  label: string
  iconSize: CustomSize | string
  iconType: CustomIconProps['type']
  iconXType: CustomIconProps['xType']
  iconName: string
  iconMove: 'none' | 'translate'| 'rotate' | 'scale'
  textColor: string | undefined
  style: string | CSSProperties
  hoverDisplay: boolean
}
export const props = {
  // Element UI
  size: {
    type: String as PropType<Props['size']>,
    required: false,
    default: undefined,
    description: '尺寸'
  },
  type: {
    type: String as PropType<Props['type']>,
    required: false,
    default: undefined,
    description: '類型'
  },
  plain: {
    type: Boolean as PropType<Props['plain']>,
    required: false,
    default: false,
    description: '是否為樸素按鈕'
  },
  text: {
    type: Boolean as PropType<Props['text']>,
    required: false,
    default: false,
    description: '是否為文字按鈕'
  },
  bg: {
    type: Boolean as PropType<Props['bg']>,
    required: false,
    default: false,
    description: '是否顯示文字按鈕背景顏色'
  },
  link: {
    type: Boolean as PropType<Props['link']>,
    required: false,
    default: false,
    description: '是否為連結按鈕'
  },
  round: {
    type: Boolean as PropType<Props['round']>,
    required: false,
    default: false,
    description: '是否為圓角按鈕'
  },
  circle: {
    type: Boolean as PropType<Props['circle']>,
    required: false,
    default: false,
    description: '是否為圓形按鈕'
  },
  loading: {
    type: Boolean as PropType<Props['loading']>,
    required: false,
    default: false,
    description: '是否為載入中狀態'
  },
  loadingIcon: {
    type: [String, Object] as PropType<Props['loadingIcon']>,
    required: false,
    default: undefined,
    description: '自訂載入中狀態圖示組件'
  },
  disabled: {
    type: Boolean as PropType<Props['disabled']>,
    required: false,
    default: false,
    description: '按鈕是否為停用狀態'
  },
  icon: {
    type: [String, Object] as PropType<Props['icon']>,
    required: false,
    default: undefined,
    description: '圖示組件'
  },
  autofocus: {
    type: Boolean as PropType<Props['autofocus']>,
    required: false,
    default: false,
    description: '原生 autofocus 屬性'
  },
  nativeType: {
    type: String as PropType<Props['nativeType']>,
    required: false,
    default: 'button',
    description: '原生 type 屬性'
  },
  autoInsertSpace: {
    type: Boolean as PropType<Props['autoInsertSpace']>,
    required: false,
    default: undefined,
    description: '自動在兩個中文字元之間插入空格'
  },
  color: {
    type: String as PropType<Props['color']>,
    required: false,
    default: undefined,
    description: '自訂按鈕顏色, 並自動計算 hover 和 active 觸發後的顏色'
  },
  dark: {
    type: Boolean as PropType<Props['dark']>,
    required: false,
    default: false,
    description: 'dark 模式, 表示自動設定 color 為 dark 模式的顏色'
  },
  tag: {
    type: [String, Object] as PropType<Props['tag']>,
    required: false,
    default: 'button',
    description: '自訂元素標籤'
  },
  // Custom
  label: {
    type: String as PropType<Props['label']>,
    required: false,
    default: '',
    description: '文字'
  },
  iconSize: {
    iype: String as PropType<Props['iconSize']>,
    required: false,
    default: 'default',
    description: 'Icon尺寸'
  },
  iconType: {
    type: String as PropType<Props['iconType']>,
    required: false,
    default: 'fas',
    description: '前綴圖示類型 參考 fontawesome'
  },
  iconXType: {
    type: String as PropType<Props['iconXType']>,
    required: false,
    default: '',
    description: '前綴圖示類型 參考 XIcon'
  },
  iconName: {
    type: String as PropType<Props['iconName']>,
    required: false,
    default: '',
    description: '前綴圖示 參考 fontawesome/XIcon'
  },
  iconMove: {
    type: String as PropType<Props['iconMove']>,
    required: false,
    default: 'none',
    description: 'hover後 的效果'
  },
  textColor: {
    type: String as PropType<Props['textColor']>,
    required: false,
    default: undefined,
    description: '文字顏色'
  },
  style: {
    type: [String, Object] as PropType<Props['style']>,
    default: '',
    description: '自訂樣式'
  },
  hoverDisplay: {
    type: Boolean as PropType<Props['hoverDisplay']>,
    required: false,
    default: false,
    description: '圖標外內容 在 非hover時隱藏 / hover時顯示'
  }
}

export interface Emits {
  click: ($event: Event) => void
}

export interface Expose {}
