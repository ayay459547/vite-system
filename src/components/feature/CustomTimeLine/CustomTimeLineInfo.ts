import type { PropType } from 'vue'
import type { TimelineItemProps } from 'element-plus'

import type { CustomSize } from '@/components'

export const version = '__CustomTimeLine_1.0.0__'

export declare namespace Types {
  type Option = Partial<TimelineItemProps> & {
    label?: string
    timestamp?: string
    type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
    color?: string
    size?: CustomSize
    hollow?: boolean
    placement?: 'top' | 'bottom'
    [key: string]: any
  }
}

export declare namespace Props {
  type Options = Array<Types.Option>
}
export const props = {
  options: {
    type: Array as PropType<Props.Options>,
    default() {
      return []
    }
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
