import type { PropType } from 'vue'

import type { IconType } from '@/components'

export const version = '1.0.0'

export type ButtonType = 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
export type ButtonSize = 'large'| 'default'| 'small'
export type ButtonMove = 'none' | 'translate'| 'rotate' | 'scale'
export type ButtonIconType = 'fas' | 'far' | 'fab'

export enum ElType {
  default = '',
  primary = 'primary',
  success = 'success',
  info = 'info',
  warning = 'warning',
  danger = 'danger'
}

export enum ElSize {
  large = 'large',
  default = 'default',
  small = 'small'
}

export enum FontIconType {
  fas = 'fas',
  far = 'far',
  fab = 'fab'
}

export const props = {
  label: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '文字'
  },
  size: {
    type: String as PropType<ButtonSize>,
    required: false,
    default: 'default',
    description: 'Button尺寸'
  },
  type: {
    type: String as PropType<ButtonType>,
    required: false,
    default: 'default',
    description: '類型 對應到不同顏色'
  },
  text: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '外型樣式'
  },
  plain: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '外型樣式'
  },
  round: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '外型樣式-圓角'
  },
  circle: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '外型樣式-圓形'
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '不可點擊'
  },
  loading: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '讀取中(無法點擊)'
  },
  color: {
    type: String as PropType<string | undefined>,
    required: false,
    default: undefined,
    description: '顏色'
  },
  textColor: {
    type: String as PropType<string | undefined>,
    required: false,
    default: undefined,
    description: '文字顏色'
  },
  dark: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否為深色模式'
  },
  iconSize: {
    type: String as PropType<ButtonSize>,
    required: false,
    default: 'default',
    description: 'Icon尺寸'
  },
  iconType: {
    type: String as PropType<IconType>,
    required: false,
    default: 'fas',
    description: '前綴圖示類型 參考 fontawesome'
  },
  iconName: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '前綴圖示 參考 fontawesome'
  },
  iconMove: {
    type: String as PropType<ButtonMove>,
    required: false,
    default: 'none',
    description: 'hover後 的效果'
  },
  style: {
    type: Object as PropType<any>,
    default: {},
    description: `
      ElButton 使用的style
      以 Object 格式輸入
    `
  },
  // tsx event
  onClick: Function as PropType<(e: MouseEvent) => void>
}
