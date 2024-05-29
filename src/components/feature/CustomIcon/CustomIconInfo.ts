import type { PropType } from 'vue'
import type { CustomSize } from '@/components'

export const version = '1.0.0'

export declare namespace Custom {
  type IconType = 'fas' | 'far' | 'fab'
}

/**
 * icon 和 type, name 選一種給
 */
export declare namespace Props {
  type Icon = [Custom.IconType, string] | []
  type Type = Custom.IconType
  type Name = string
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
