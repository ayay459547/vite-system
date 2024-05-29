import type { PropType } from 'vue'
import type { TimelineItemProps } from 'element-plus'

import type { CustomSize } from '@/components'

export const version = '1.0.0'

export declare namespace Custom {
  type Option = Partial<TimelineItemProps> & {
    label?: string
    timestamp?: string
    type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
    color?: string
    size?: CustomSize
    hollow?: boolean
    placement?: 'top' | 'bottom'
  } & any
}

export declare namespace Props {
  type Options = Array<Custom.Option>
}

export const props = {
  options: {
    type: Array as PropType<Props.Options>,
    default() {
      return []
    }
  }
}
