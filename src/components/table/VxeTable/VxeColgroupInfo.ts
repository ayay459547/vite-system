import type { PropType } from 'vue'

export const version = '__VxeColgroup_1.0.0__'

export interface Types {
  ClassCallbackParams: {
    row?: any
    rowIndex?: number
    $rowIndex?: number
    column?: any
    columnIndex?: number
    $columnIndex?: number
  }
}

export interface Props {
  Field: string
  Title: string
  HeaderClassName: string | ((params: Types['ClassCallbackParams']) => any) | undefined
}
export const props = {
  field: {
    type: String as PropType<Props['Field']>,
    required: false,
    default: '',
    description: '資料key'
  },
  title: {
    type: String as PropType<Props['Title']>,
    required: false,
    default: '',
    description: '欄位名稱'
  },
  headerClassName: {
    type: [Function, String] as PropType<Props['HeaderClassName']>,
    required: false,
    default: undefined,
    description: '將表頭的行附加 className'
  }
}

export interface Emits {}

export interface Expose {}
