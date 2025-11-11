import type { PropType } from 'vue'

export const version = '__CustomDraggable_1.0.0__'

export interface Types {
  draggableChange: {
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
}

export interface Props {
  modelValue: Array<any>
  itemKey: string
  handle: string
  width: string
  height: string
  stripe: boolean
  class: string
  style: Record<string, string>
  rowClass: string
  rowStyle: Record<string, string>
  tag: string
  sort: boolean
  list: Array<any>
  disabled: Function | boolean | undefined
  clone: Function
  move: Function | undefined
  componentData: Record<any, any> | null
  ghostClass: string
  direction: 'column' | 'row'
  group: any
}
export const props = {
  modelValue: {
    type: Array as PropType<Props['modelValue']>,
    required: false,
    default: undefined,
    description: '綁定資料列表'
  },
  itemKey: {
    type: String as PropType<Props['itemKey']>,
    required: false,
    default: 'id',
    description: '每筆資料的key'
  },
  handle: {
    type: String as PropType<Props['handle']>,
    required: false,
    default: '.__draggable-move__',
    description: '指定可拖拉的元素(css選擇器)'
  },
  width: {
    type: String as PropType<Props['width']>,
    required: false,
    default: '100%',
    description: '列表寬度'
  },
  height: {
    type: String as PropType<Props['height']>,
    required: false,
    default: '100%',
    description: '列表高度'
  },
  stripe: {
    type: Boolean as PropType<Props['stripe']>,
    required: false,
    default: false,
    description: '列表高度'
  },
  class: {
    type: String as PropType<Props['class']>,
    required: false,
    default: '',
    description: '外層class'
  },
  style: {
    type: Object as PropType<Props['style']>,
    required: false,
    default: () => {
      return {}
    },
    description: '外層style 類型為object 不能使用string'
  },
  rowClass: {
    type: String as PropType<Props['rowClass']>,
    required: false,
    default: '',
    description: '資料列class'
  },
  rowStyle: {
    type: Object as PropType<Props['rowStyle']>,
    required: false,
    default: () => {
      return {}
    },
    description: '資料列style 類型為object 不能使用string'
  },
  tag: {
    type: String as PropType<Props['tag']>,
    required: false,
    // default: 'TransitionGroup'
    default: 'ul',
    description: '外層html標籤'
  },
  sort: {
    type: Boolean as PropType<Props['sort']>,
    required: false,
    default: true,
    description: '是否可更換順序'
  },
  list: {
    type: Array as PropType<Props['list']>,
    required: false,
    default: () => [],
    description: '資料列表'
  },
  clone: {
    type: Function as PropType<Props['clone']>,
    required: false,
    default: (original: any) => original,
    description: '自訂拷貝方式'
  },
  move: {
    type: [Function, undefined] as PropType<Props['move']>,
    required: false,
    default: undefined,
    description: '移動後的回調函數'
  },
  disabled: {
    type: [Function, Boolean, undefined] as PropType<Props['disabled']>,
    required: false,
    default: false,
    description: '定義是否可移動'
  },
  // componentData: {
  //   type: [Object, null] as PropType<Props['componentData']>,
  //   required: false,
  //   default: null
  // },
  ghostClass: {
    type: String as PropType<Props['ghostClass']>,
    required: false,
    default: 'ghost',
    description: '移動中的class'
  },
  direction: {
    type: String as PropType<Props['direction']>,
    default: 'column',
    description: '方向'
  },
  group: {
    type: [String, Object] as PropType<Props['group']>,
    required: false,
    default: 'name',
    description: '資料列class'
  }
}

export interface Emits {
  // filter: ($event: any) => void
  start: ($event: any) => void
  end: ($event: any) => void
  add: ($event: any) => void
  remove: ($event: any) => void
  choose: ($event: any) => void
  unchoose: ($event: any) => void
  clone: ($event: any) => void
  change: ($event: Types['draggableChange']) => void
  // update: ($event: any) => void
  sort: ($event: any) => void
}

export interface Expose {}
