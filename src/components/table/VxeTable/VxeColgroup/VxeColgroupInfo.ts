import type { PropType } from 'vue'

export const version = '__VxeColgroup_1.0.0__'

export interface Types {
  classCallbackParams: {
    row?: any
    rowIndex?: number
    $rowIndex?: number
    column?: any
    columnIndex?: number
    $columnIndex?: number
  }
}

export interface Props {
  field: string
  title: string
  label: string
  headerClassName: string | ((params: Types['classCallbackParams']) => any) | undefined
}
export const props = {
  field: {
    type: String as PropType<Props['field']>,
    required: false,
    default: '',
    description: '資料key'
  },
   title: {
    type: String as PropType<Props['title']>,
    required: false,
    default: undefined,
    description: '欄位名稱'
  },
  label: {
    type: String as PropType<Props['label']>,
    required: false,
    default: '',
    description: '欄位名稱 配合 lib_columns 的格式'
  },
  headerClassName: {
    type: [Function, String] as PropType<Props['headerClassName']>,
    required: false,
    default: undefined,
    description: '將表頭的行附加 className'
  }
}

export interface Emits {}

export interface Expose {}
