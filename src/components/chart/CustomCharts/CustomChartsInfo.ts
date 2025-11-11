import type { PropType } from 'vue'
import type { EChartsOption } from 'echarts/types/dist/shared'

export const version = '__CustomCharts_1.0.0__'

export interface Types {
  BuildOptions: (EChartsOption & {
    [key: string]: any
  }) | any
  BuildFunction: () => Types['BuildOptions']
}

export interface Props {
  Options: Types['BuildOptions'] | Types['BuildFunction']
}
export const props = {
  options: {
    type: [Function, Object] as PropType<Props['Options']>,
    required: true
  }
}

export interface Emits {
  Click: (params: any) => void
}

export interface Expose {
  Init: () => void
}
