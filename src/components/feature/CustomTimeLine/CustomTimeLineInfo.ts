import type { PropType } from 'vue'
import type { TimelineItemProps } from 'element-plus'

import { getUuid } from '@/lib/lib_utils'

export const version = '1.0.0'

export const scopedId = getUuid('__i-time-line__')

export type Size = 'large'| 'default'| 'small'
export type Placement = 'top'| 'bottom'
export type TimeType = 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'

export type Options = TimelineItemProps & {
  label?: string
  timestamp?: string
  type?: TimeType
  color?: string
  size?: Size
  hollow?: boolean
  placement?: Placement
} & any

export const props = {
  options: {
    type: Array as PropType<Options[]>,
    default () {
      return []
    }
  }
}
