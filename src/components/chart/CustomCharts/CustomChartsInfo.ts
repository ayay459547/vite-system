import type { PropType } from 'vue'
import type { EChartsOption } from 'echarts/types/dist/shared'

export const version = '__CustomCharts_1.0.0__'

export declare namespace Types {
  type BuildOptions = EChartsOption & {
    [key: string]: any
  }
  type BuildFunction = () => Types.BuildOptions
}

export declare namespace Props {
  type Options = Types.BuildOptions | Types.BuildFunction
}
export const props = {
  options: {
    type: [Function, Object] as PropType<Props.Options>,
    required: true
  }
}

export declare namespace Emits {
  type Click = (params: any) => void
}

export declare namespace Expose {
  type Init = () => void
}
