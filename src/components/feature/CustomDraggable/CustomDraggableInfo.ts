import type { PropType } from 'vue'

export const version = '1.0.0'

export type DraggableChange = {
  added?: {
    newIndex: number
    element: Record<string, any>
  }
  removed?: {
    oldIndex: number
    element: Record<string, any>
  }
  moved?: {
    newIndex: number
    oldIndex: number
    element: Record<string, any>
  }
}

export declare namespace Props {
  type ModelValue = any[]
  type ItemKey = string
  type Handle = string
  type Width = string
  type Height = string
  type Stripe = boolean
  type Class = string
  type Style = Record<string, string>
  type RowClass = string
  type RowStyle = Record<string, string>
  type Tag = string
  type Clone = Function
  type Move = Function | undefined
  type ComponentData = Record<any, any> | null
  type GhostClass = string
  type Direction = 'column' | 'row'
  type Group = any
}

export const props = {
  modelValue: {
    type: Array as PropType<Props.ModelValue>,
    required: true,
    description: '綁定資料列表'
  },
  itemKey: {
    type: String as PropType<Props.ItemKey>,
    required: false,
    default: 'id',
    description: '每筆資料的key'
  },
  handle: {
    type: String as PropType<Props.Handle>,
    required: false,
    default: '.__draggable',
    description: '指定可拖拉的元素(css選擇器)'
  },
  width: {
    type: String as PropType<Props.Width>,
    required: false,
    default: '100%',
    description: '列表寬度'
  },
  height: {
    type: String as PropType<Props.Height>,
    required: false,
    default: '100%',
    description: '列表高度'
  },
  stripe: {
    type: Boolean as PropType<Props.Stripe>,
    required: false,
    default: false,
    description: '列表高度'
  },
  class: {
    type: String as PropType<Props.Class>,
    required: false,
    default: '',
    description: '外層class'
  },
  style: {
    type: Object as PropType<Props.Style>,
    required: false,
    default() {
      return {}
    },
    description: '外層style 類型為object 不能使用string'
  },
  rowClass: {
    type: String as PropType<Props.RowClass>,
    required: false,
    default: '',
    description: '資料列class'
  },
  rowStyle: {
    type: Object as PropType<Props.RowStyle>,
    required: false,
    default() {
      return {}
    },
    description: '資料列style 類型為object 不能使用string'
  },
  tag: {
    type: String as PropType<Props.Tag>,
    required: false,
    // default: 'TransitionGroup'
    default: 'ul',
    description: '外層html標籤'
  },
  clone: {
    type: Function as PropType<Props.Clone>,
    required: false,
    default: (original: any) => {
      return original
    },
    description: '自訂拷貝方式'
  },
  move: {
    type: [Function, undefined] as PropType<Props.Move>,
    required: false,
    default: undefined,
    description: '移動後的回調函數'
  },
  // componentData: {
  //   type: [Object, null] as PropType<Props.ComponentData>,
  //   required: false,
  //   default: null
  // },
  ghostClass: {
    type: String as PropType<Props.GhostClass>,
    required: false,
    default: '',
    description: '移動中的class'
  },
  direction: {
    type: String as PropType<Props.Direction>,
    default: 'column',
    description: '方向'
  },
  group: {
    type: [String, Object] as PropType<Props.Group>,
    required: false,
    default: 'name',
    description: '資料列class'
  }
}
