import type { PropType } from 'vue'

export const version = '1.0.0'

export type CheckNode = Node | string | number

export interface TreeNodeData {
  [key: string]: any
}

export interface TreeOptionProps {
  children?: string
  label?: string | ((data: TreeNodeData, node: Node) => string)
  disabled?: string | ((data: TreeNodeData, node: Node) => string)
  isLeaf?: string | ((data: TreeNodeData, node: Node) => boolean)
  class?: (
    data: TreeNodeData,
    node: Node
  ) =>
    | string
    | {
        [key: string]: boolean
      }
    | string
}

export const props = {
  data: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => {
      return []
    },
    description: '樹結構資料'
  },
  props: {
    type: Object as PropType<TreeOptionProps | any>,
    required: false,
    default: () => {
      return {}
    },
    description: '參數'
  },
  nodeKey: {
    type: String as PropType<string>,
    required: false,
    description: '節點資料唯一值'
  },
  highlightCurrent: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否有背景顏色 在節點被選中'
  },
  defaultExpandAll: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否展開所有節點'
  },
  showCheckbox: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否使用checkbox'
  }
}
