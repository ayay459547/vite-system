import type { PropType } from 'vue'
import type { MiniMapNodeFunc } from '@vue-flow/minimap'

export const version = '__FlowMiniMap_1.0.0__'

export interface Types {}

export interface Props {
  nodeColor: string | MiniMapNodeFunc
  nodeStrokeColor: string | MiniMapNodeFunc
  nodeClassName: string | MiniMapNodeFunc
  nodeBorderRadius: number
  nodeStrokeWidth: number
  maskColor: string
  pannable: boolean
  zoomable: boolean
}

/**
 * https://vueflow.dev/guide/components/background.html
 */
export const props = {
  nodeColor: {
    type: [String, Function] as PropType<Props['nodeColor']>,
    required: false,
    default: undefined,
    description: 'Node color, can be either a string or a string func that receives the current node'
  },
  nodeStrokeColor: {
    type: [String, Function] as PropType<Props['nodeStrokeColor']>,
    required: false,
    default: undefined,
    description: 'Node stroke color, can be either a string or a string func that receives the current node'
  },
  nodeClassName: {
    type: [String, Function] as PropType<Props['nodeClassName']>,
    required: false,
    default: undefined,
    description: 'Additional node class name, can be either a string or a string func that receives the current node'
  },
  nodeBorderRadius: {
    type: Number as PropType<Props['nodeBorderRadius']>,
    required: false,
    default: undefined,
    description: 'Node border radius'
  },
  nodeStrokeWidth: {
    type: Number as PropType<Props['nodeStrokeWidth']>,
    required: false,
    default: undefined,
    description: 'Node stroke width'
  },
  maskColor: {
    type: String as PropType<Props['maskColor']>,
    required: false,
    default: undefined,
    description: 'Background color of minimap mask'
  },
  pannable: {
    type: Boolean as PropType<Props['pannable']>,
    required: false,
    default: undefined,
    description: 'Enable drag minimap to drag viewport'
  },
  zoomable: {
    type: Boolean as PropType<Props['zoomable']>,
    required: false,
    default: undefined,
    description: 'Enable zoom minimap to zoom viewport'
  }
}

export interface Emits {}

export interface Expose {}
