import type { PropType } from 'vue'
import type { Node, Edge } from '@vue-flow/core'

export const version = '__CustomFlow_1.0.0__'

export declare namespace Types {}

export declare namespace Props {
  type Nodes = Node[]
  type Edges = Edge[]
}


export const props = {
  nodes: {
    type: Array as PropType<Props.Nodes>,
    required: false,
    default: () => [],
    description: '節點'
  },
  edges: {
    type: Array as PropType<Props.Edges>,
    required: false,
    default: () => [],
    description: '連接線'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
