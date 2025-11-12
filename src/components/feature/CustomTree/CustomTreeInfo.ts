import type { PropType } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'

export const version = '__CustomTree_1.0.0__'

export interface Types {
  checkNode: Node | string | number
  treeKey: string | number
  treeNodeData: {
    [key: string]: any
  }
  treeOptionProps: {
    children?: string
    label?: string | ((data: Types['treeNodeData'], node: Node) => string)
    disabled?: string | ((data: Types['treeNodeData'], node: Node) => string)
    isLeaf?: string | ((data: Types['treeNodeData'], node: Node) => boolean)
    class?: (data: Types['treeNodeData'], node: Node) => string | { [key: string]: boolean }
  }
}

export interface Props {
  data: Array<any>
  props: Types['treeOptionProps'] | any
  nodeKey: string
  highlightCurrent: boolean
  defaultExpandAll: boolean
  showCheckbox: boolean
}
export const props = {
  data: {
    type: Array as PropType<Props['data']>,
    required: false,
    default: () => [],
    description: '樹結構資料'
  },
  props: {
    type: Object as PropType<Props['props']>,
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
    type: String as PropType<Props['nodeKey']>,
    required: false,
    description: '節點資料唯一值'
  },
  highlightCurrent: {
    type: Boolean as PropType<Props['highlightCurrent']>,
    required: false,
    default: false,
    description: '是否有背景顏色 在節點被選中'
  },
  defaultExpandAll: {
    type: Boolean as PropType<Props['defaultExpandAll']>,
    required: false,
    default: false,
    description: '是否展開所有節點'
  },
  showCheckbox: {
    type: Boolean as PropType<Props['showCheckbox']>,
    required: false,
    default: false,
    description: '是否使用checkbox'
  }
}

export interface Emits {
  nodeClick: ($data1: any, $data2: any, $data3: any, $data4: any) => void | any
  checkChange: (data: any, checked: boolean, indeterminate: boolean) => void
  check: (nodeDate: any, checkedData: any) => void | any
}

export interface Expose {
  getCheckedNodes: (leafOnly?: boolean, includeHalfChecked?: boolean) => Array<Types['treeNodeData']>
  getCheckedKeys: (leafOnly?: boolean) => Types['treeKey'][]
  setCheckedNodes: (nodeList: Node[], leafOnly?: boolean) => void
  setCheckedKeys: (keyList: Array<string | number>, leafOnly?: boolean) => void
  resetChecked: () => void
  setChecked: (checkNode: Types['checkNode'], checked: boolean, deep: boolean) => void
}
