import type { PropType } from 'vue'

export const version = '__VxeColumn_1.0.0__'

export declare namespace Types {
  type ClassCallbackParams = {
    row?: any
    rowIndex?: number
    $rowIndex?: number
    column?: any
    columnIndex?: number
    $columnIndex?: number
  }
}

export declare namespace Props {
  type Type = string
    | 'seq'
    | 'checkbox'
    | 'radio'
    | 'expand'
    | 'html'

  type Field = string
  type Title = string
  type Width = string | number | undefined
  type MinWidth = string | number | undefined
  type Fixed = String | any
    | 'left'
    | 'right'

  type Align = String | any
    | 'center'
    | 'left'
    | 'right'

  type ClassName = string | ((params: Types.ClassCallbackParams) => any) | undefined
  type HeaderClassName = string | ((params: Types.ClassCallbackParams) => any) | undefined
  type FooterRowClassName = string | ((params: Types.ClassCallbackParams) => any) | undefined
}
export const props = {
  type: {
    type: String as PropType<Props.Type>,
    required: false,
    default: '',
    description: '欄位類型'
  },
  field: {
    type: String as PropType<Props.Field>,
    required: false,
    default: undefined,
    description: '資料key'
  },
  title: {
    type: String as PropType<Props.Title>,
    required: false,
    default: '',
    description: '欄位名稱'
  },
  width: {
    type: [String, Number] as PropType<Props.Width>,
    required: false,
    default: undefined,
    description: '寬度'
  },
  minWidth: {
    type: [String, Number] as PropType<Props.MinWidth>,
    required: false,
    default: undefined,
    description: '最小寬度'
  },
  fixed: {
    type: String as PropType<Props.Fixed>,
    required: false,
    default: undefined,
    description: '固定位置'
  },
  align: {
    type: String as PropType<Props.Align>,
    required: false,
    default: undefined,
    description: '對齊方式'
  },
  className: {
    type: [Function, String] as PropType<Props.ClassName>,
    required: false,
    default: undefined,
    description: '將表格的行附加 className'
  },
  headerClassName: {
    type: [Function, String] as PropType<Props.HeaderClassName>,
    required: false,
    default: undefined,
    description: '將表頭的行附加 className'
  },
  footerClassName: {
    type: [Function, String] as PropType<Props.FooterRowClassName>,
    required: false,
    default: undefined,
    description: '將表頭的行附加 className'
  }
}

export declare namespace Emits {}

export declare namespace Expose {}
