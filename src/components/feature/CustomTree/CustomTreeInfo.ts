import type { PropType } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'

export const version = '__CustomTree_1.0.0__'

export declare namespace Types {
  type CheckNode = Node | string | number
  type TreeKey = string | number
  interface TreeNodeData {
    [key: string]: any
  }
  interface TreeOptionProps {
    children?: string
    label?: string | ((data: Types.TreeNodeData, node: Node) => string)
    disabled?: string | ((data: Types.TreeNodeData, node: Node) => string)
    isLeaf?: string | ((data: Types.TreeNodeData, node: Node) => boolean)
    class?: (
      data: Types.TreeNodeData,
      node: Node
    ) =>
      | string
      | {
          [key: string]: boolean
        }
      | string
  }
}

export declare namespace Props {
  type Data = Array<any>
  type Props = Types.TreeOptionProps | any
  type NodeKey = string
  type HighlightCurrent = boolean
  type DefaultExpandAll = boolean
  type ShowCheckbox = boolean
}
export const props = {
  data: {
    type: Array as PropType<Props.Data>,
    required: false,
    default: () => {
      return []
    },
    description: '樹結構資料'
  },
  props: {
    type: Object as PropType<Props.Props>,
    required: false,
    default: () => {
      return {
        label: 'label',
        children: 'children'
      }
    },
    description: '參數'
  },
  nodeKey: {
    type: String as PropType<Props.NodeKey>,
    required: false,
    description: '節點資料唯一值'
  },
  highlightCurrent: {
    type: Boolean as PropType<Props.HighlightCurrent>,
    required: false,
    default: false,
    description: '是否有背景顏色 在節點被選中'
  },
  defaultExpandAll: {
    type: Boolean as PropType<Props.DefaultExpandAll>,
    required: false,
    default: false,
    description: '是否展開所有節點'
  },
  showCheckbox: {
    type: Boolean as PropType<Props.ShowCheckbox>,
    required: false,
    default: false,
    description: '是否使用checkbox'
  }
}

export declare namespace Emits {
  type NodeClick = ($data1: any, $data2: any, $data3: any, $data4: any) => void | any
  type CheckChange = ($data1: any, $data2: any, $data3: any) => void | any
  type Check = (nodeDate: any, checkedData: any) => void | any
}

export declare namespace Expose {
  type GetCheckedNodes = (leafOnly?: boolean, includeHalfChecked?: boolean) => Array<Types.TreeNodeData>
  type GetCheckedKeys = (leafOnly?: boolean) => Types.TreeKey[]
  type SetCheckedNodes = (nodeList: Node[], leafOnly?: boolean) => void
  type SetCheckedKeys = (keyList: Array<string | number>, leafOnly?: boolean) => void
  type ResetChecked = () => void
  type SetChecked = (checkNode: Types.CheckNode, checked: boolean, deep: boolean) => void
}
