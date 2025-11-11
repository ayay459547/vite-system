import type { PropType } from 'vue'
import type { TimelineItemProps } from 'element-plus'

import type { CustomSize } from '@/components' // 系統組件

export const version = '__CustomTimeLine_1.0.0__'

export interface Types {
  option: Partial<TimelineItemProps> & {
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

export interface Props {
  options: Array<Types['option']>
}
export const props = {
  options: {
    type: Array as PropType<Props['options']>,
    default: () => []
  }
}

export interface Emits {}

export interface Expose {}
