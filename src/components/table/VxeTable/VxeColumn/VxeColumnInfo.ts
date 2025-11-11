import type { PropType } from 'vue'

export const version = '__VxeColumn_1.0.0__'

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
  type: string
    | 'seq'
    | 'checkbox'
    | 'radio'
    | 'expand'
    | 'html'

  field: string
  title: string
  label: string
  width: string | number | undefined
  minWidth: string | number | undefined
  fixed: 'left' | 'right' | string | any

  align: 'center' | 'left' | 'right' | string | any

  className: string | ((params: Types['classCallbackParams']) => any) | undefined
  headerClassName: string | ((params: Types['classCallbackParams']) => any) | undefined
  footerClassName: string | ((params: Types['classCallbackParams']) => any) | undefined
}
export const props = {
  type: {
    type: String as PropType<Props['type']>,
    required: false,
    default: '',
    description: '欄位類型'
  },
  field: {
    type: String as PropType<Props['field']>,
    required: false,
    default: undefined,
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
  width: {
    type: [String, Number] as PropType<Props['width']>,
    required: false,
    default: undefined,
    description: '寬度'
  },
  minWidth: {
    type: [String, Number] as PropType<Props['minWidth']>,
    required: false,
    default: undefined,
    description: '最小寬度'
  },
  fixed: {
    type: String as PropType<Props['fixed']>,
    required: false,
    default: undefined,
    description: '固定位置'
  },
  align: {
    type: String as PropType<Props['align']>,
    required: false,
    default: undefined,
    description: '對齊方式'
  },
  className: {
    type: [Function, String] as PropType<Props['className']>,
    required: false,
    default: undefined,
    description: '將表格的行附加 className'
  },
  headerClassName: {
    type: [Function, String] as PropType<Props['headerClassName']>,
    required: false,
    default: undefined,
    description: '將表頭的行附加 className'
  },
  footerClassName: {
    type: [Function, String] as PropType<Props['footerClassName']>,
    required: false,
    default: undefined,
    description: '將表頭的行附加 className'
  }
}

export interface Emits {}

export interface Expose {}
