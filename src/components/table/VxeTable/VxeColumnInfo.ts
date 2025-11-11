import type { PropType } from 'vue'

export const version = '__VxeColumn_1.0.0__'

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
  Type: string
    | 'seq'
    | 'checkbox'
    | 'radio'
    | 'expand'
    | 'html'

  Field: string
  Title: string
  Width: string | number | undefined
  MinWidth: string | number | undefined
  Fixed: string | any
    | 'left'
    | 'right'

  Align: string | any
    | 'center'
    | 'left'
    | 'right'

  ClassName: string | ((params: Types['ClassCallbackParams']) => any) | undefined
  HeaderClassName: string | ((params: Types['ClassCallbackParams']) => any) | undefined
  FooterRowClassName: string | ((params: Types['ClassCallbackParams']) => any) | undefined
}
export const props = {
  type: {
    type: String as PropType<Props['Type']>,
    required: false,
    default: '',
    description: '欄位類型'
  },
  field: {
    type: String as PropType<Props['Field']>,
    required: false,
    default: undefined,
    description: '資料key'
  },
  title: {
    type: String as PropType<Props['Title']>,
    required: false,
    default: '',
    description: '欄位名稱'
  },
  width: {
    type: [String, Number] as PropType<Props['Width']>,
    required: false,
    default: undefined,
    description: '寬度'
  },
  minWidth: {
    type: [String, Number] as PropType<Props['MinWidth']>,
    required: false,
    default: undefined,
    description: '最小寬度'
  },
  fixed: {
    type: String as PropType<Props['Fixed']>,
    required: false,
    default: undefined,
    description: '固定位置'
  },
  align: {
    type: String as PropType<Props['Align']>,
    required: false,
    default: undefined,
    description: '對齊方式'
  },
  className: {
    type: [Function, String] as PropType<Props['ClassName']>,
    required: false,
    default: undefined,
    description: '將表格的行附加 className'
  },
  headerClassName: {
    type: [Function, String] as PropType<Props['HeaderClassName']>,
    required: false,
    default: undefined,
    description: '將表頭的行附加 className'
  },
  footerClassName: {
    type: [Function, String] as PropType<Props['FooterRowClassName']>,
    required: false,
    default: undefined,
    description: '將表頭的行附加 className'
  }
}

export interface Emits {}

export interface Expose {}
