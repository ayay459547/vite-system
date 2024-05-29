import type { PropType } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'

export const version = '1.0.0'

export declare namespace Custom {
  type CheckNode = Node | string | number
  type TreeKey = string | number
  interface TreeNodeData {
    [key: string]: any
  }
  interface TreeOptionProps {
    children?: string
    label?: string | ((data: Custom.TreeNodeData, node: Node) => string)
    disabled?: string | ((data: Custom.TreeNodeData, node: Node) => string)
    isLeaf?: string | ((data: Custom.TreeNodeData, node: Node) => boolean)
    class?: (
      data: Custom.TreeNodeData,
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
  type Props = Custom.TreeOptionProps | any
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
  type GetCheckedNodes = (leafOnly?: boolean, includeHalfChecked?: boolean) => Array<Custom.TreeNodeData>
  type GetCheckedKeys = (leafOnly?: boolean) => Custom.TreeKey[]
  type SetCheckedNodes = (nodeList: Node[], leafOnly?: boolean) => void
  type SetCheckedKeys = (keyList: Array<string | number>, leafOnly?: boolean) => void
  type ResetChecked = () => void
  type SetChecked = (checkNode: Custom.CheckNode, checked: boolean, deep: boolean) => void
}
