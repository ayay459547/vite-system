import type { PropType } from 'vue'

export const version = '1.0.0'

export type CheckNode = Node | string | number

export interface TreeNodeData {
  [key: string]: any
}

export interface TreeV2OptionProps {
  value?: string | number
  children?: string
  label?: string
  disabled?: string
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
    type: Object as PropType<TreeV2OptionProps | any>,
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
