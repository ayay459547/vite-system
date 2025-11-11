import type { PropType } from 'vue'
// import type { TreeNode } from 'element-plus'
import type { TreeNode } from 'element-plus/es/components/tree-v2/src/types'

export const version = '__CustomTreeV2_1.0.0__'

export interface Types {
  checkNode: Node | string | number
  treeKey: string | number
  treeNodeData: {
    [key: string]: any
  }
  treeV2OptionProps: {
    value?: string | number
    children?: string
    label?: string
    disabled?: string
  }
  filterMethod: (query: string, node: TreeNode | any) => boolean | any
}

export interface Props {
  data: Array<any>
  props: Types['treeV2OptionProps'] | any
  highlightCurrent: boolean
  defaultExpandAll: boolean
  showCheckbox: boolean
  filterMethod: Types['filterMethod'] | undefined
}
export const props = {
  data: {
    type: Array as PropType<Props['data']>,
    required: false,
    default: () => {
      return []
    },
    description: '樹結構資料'
  },
  props: {
    type: Object as PropType<Props['props']>,
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
  },
  filterMethod: {
    type: Function as PropType<Props['filterMethod']>,
    required: false,
    default: undefined,
    description: '過濾'
  }
}

export interface Emits {
  nodeClick: (data: Types['treeNodeData'], node: TreeNode, e: MouseEvent) => void | any
  checkChange: (data: Types['treeNodeData'], checked: boolean) => void | any
  check: (nodeDate: any, checkedData: any) => void | any
}

export interface Expose {
  getCheckedNodes: (leafOnly?: boolean) => Array<Types['treeNodeData']>
  getCheckedKeys: (leafOnly?: boolean) => Types['treeKey'][]
  setCheckedKeys: (keyList: Array<Types['treeKey']>) => void
  resetChecked: () => void
  setChecked: (key: Types['treeKey'], checked: boolean) => void
  filter:(query: string) => void
}
