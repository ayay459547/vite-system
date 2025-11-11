import type { PropType } from 'vue'
import type { CustomSize } from '@/components' // 系統組件

export const version = '__CustomIcon_1.0.0__'

export interface Types {
  iconType: 'fas' | 'far' | 'fab'
  xIconType: '' | string
    | 'fluent' | 'ionicons4' | 'ionicons5'
    | 'antd' | 'material' | 'fa'
    | 'tabler' | 'carbon'
    | null | undefined
}

/**
 * 預設使用 fontawesome 的 icon
 * icon 和 type, name 選一種給
 *
 * 如果有 xType 使用 xicons, name 對應顯示圖示
 */
export interface Props {
  // fontawesome
  icon: [Types['iconType'], string] | []
  type: Types['iconType']

  // xicons
  xType: Types['xIconType']

  name: string
  size: CustomSize | string
  iconClass: string
}
export const props = {
  icon: {
    type: Array as unknown as PropType<Props['icon']>,
    required: false,
    default: () => {
      return []
    },
    description: '[類型, 名稱]'
  },
  type: {
    type: String as PropType<Props['type']>,
    required: false,
    default: 'fas',
    description: '類型'
  },
  xType: {
    type: [String, null] as PropType<Props['xType']>,
    required: false,
    default: '',
    description: 'XIcon類型'
  },
  name: {
    type: String as PropType<Props['name']>,
    required: false,
    default: 'circle-question',
    description: '名稱'
  },
  size: {
    type: String as PropType<Props['size']>,
    required: false,
    default: 'default',
    description: '大小'
  },
  iconClass: {
    type: String as PropType<Props['iconClass']>,
    required: false,
    default: '',
    description: 'class 樣式'
  }
}

export interface Emits {}

export interface Expose {}
