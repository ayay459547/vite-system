import type { PropType } from 'vue'
import type { TreeNode } from 'element-plus'

export const version = '1.0.0'

export declare namespace Custom {
  type CheckNode = Node | string | number
  type TreeKey = string | number
  interface TreeNodeData {
    [key: string]: any
  }
  interface TreeV2OptionProps {
    value?: string | number
    children?: string
    label?: string
    disabled?: string
  }
}

export declare namespace Props {
  type Data = Array<any>
  type Props = Custom.TreeV2OptionProps | any
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
        value: 'id',
        label: 'label',
        children: 'children'
      }
    },
    description: '參數'
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
  type NodeClick = (data: Custom.TreeNodeData, node: TreeNode, e: MouseEvent) => void | any
  type CheckChange = (data: Custom.TreeNodeData, checked: boolean) => void | any
  type Check = (nodeDate: any, checkedData: any) => void | any
}

export declare namespace Expose {
  type GetCheckedNodes = (leafOnly?: boolean) => Array<Custom.TreeNodeData>
  type GetCheckedKeys = (leafOnly?: boolean) => Custom.TreeKey[]
  type SetCheckedKeys = (keyList: Array<Custom.TreeKey>) => void
  type ResetChecked = () => void
  type SetChecked = (key: Custom.TreeKey, checked: boolean) => void
}
