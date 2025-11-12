import type { PropType } from 'vue'
import type { EChartsOption } from 'echarts/types/dist/shared'

export const version = '__CustomCharts_1.0.0__'

export interface Types {
  buildOptions: (EChartsOption & {
    [key: string]: any
  }) | any
  buildFunction: () => Types['buildOptions']
}

export interface Props {
  Options: Types['buildOptions'] | Types['buildFunction']
}
export const props = {
  options: {
    type: [Function, Object] as PropType<Props['Options']>,
    required: true
  }
}

export interface Emits {
  click: (params: any) => void
}

export interface Expose {
  init: () => void
}
