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

export const props = {
  modelValue: {
    type: Array as PropType<any[]>,
    required: true,
    description: '綁定資料列表'
  },
  itemKey: {
    type: String as PropType<string>,
    required: false,
    default: 'id',
    description: '每筆資料的key'
  },
  handle: {
    type: String as PropType<string>,
    required: false,
    default: '.__draggable',
    description: '指定可拖拉的元素(css選擇器)'
  },
  width: {
    type: String as PropType<string>,
    required: false,
    default: '100%',
    description: '列表寬度'
  },
  height: {
    type: String as PropType<string>,
    required: false,
    default: '100%',
    description: '列表高度'
  },
  stripe: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '列表高度'
  },
  class: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '外層class'
  },
  style: {
    type: Object as PropType<Record<string, string>>,
    required: false,
    default () {
      return {}
    },
    description: '外層style 類型為object 不能使用string'
  },
  rowClass: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '資料列class'
  },
  rowStyle: {
    type: Object as PropType<Record<string, string>>,
    required: false,
    default () {
      return {}
    },
    description: '資料列style 類型為object 不能使用string'
  },
  tag: {
    type: String as PropType<string>,
    required: false,
    // default: 'TransitionGroup'
    default: 'ul',
    description: '外層html標籤'
  },
  clone: {
    type: Function as PropType<Function>,
    required: false,
    default: (original: any) => {
      return original
    },
    description: '自訂拷貝方式'
  },
  move: {
    type: [Function, undefined] as PropType<Function | undefined>,
    required: false,
    default: undefined,
    description: '移動後的回調函數'
  },
  // componentData: {
  //   type: [Object, null] as PropType<Record<any, any> | null>,
  //   required: false,
  //   default: null
  // },
  ghostClass: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '移動中的class'
  },
  direction: {
    type: String as PropType<'column' | 'row'>,
    default: 'column',
    description: '方向'
  },
  group: {
    type: [String, Object] as PropType<any>,
    required: false,
    default: 'name',
    description: '資料列class'
  }
}
