import type { PropType } from 'vue'
import type { CustomSize } from '@/components'

export const version = '__CustomIcon_1.0.0__'

export declare namespace Types {
  type IconType = 'fas' | 'far' | 'fab'
  type XIconType = '' | 'fluent' | 'ionicons4' | 'ionicons5' | 'antd' | 'material' | 'fa' | 'tabler' | 'carbon' | null | undefined
}

/**
 * 預設使用 fontawesome 的 icon
 * icon 和 type, name 選一種給
 *
 * 如果有 xType 使用 xicons
 */
export declare namespace Props {
  // fontawesome
  type Icon = [Types.IconType, string] | []
  type Type = Types.IconType
  type Name = string
  // xicons
  type XType = Types.XIconType

  type Size = CustomSize
  type IconClass = string
}
export const props = {
  icon: {
    type: Array as unknown as PropType<Props.Icon>,
    required: false,
    default: () => {
      return []
    },
    description: '[類型, 名稱]'
  },
  type: {
    type: String as PropType<Props.Type>,
    required: false,
    default: 'fas',
    description: '類型'
  },
  xType: {
    type: [String, null] as PropType<Props.XType>,
    required: false,
    default: '',
    description: 'XIcon類型'
  },
  name: {
    type: String as PropType<Props.Name>,
    required: false,
    default: 'circle-question',
    description: '名稱'
  },
  size: {
    type: String as PropType<Props.Size>,
    required: false,
    default: 'default',
    description: '大小'
  },
  iconClass: {
    type: String as PropType<Props.IconClass>,
    required: false,
    default: '',
    description: 'class 樣式'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
