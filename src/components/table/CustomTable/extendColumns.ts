export const extendColumnSetting = {
  rowOperations: {
    label: '操作',
    i18nLabel: 'operationCommands',
    table: {
      width: 60,
      align: 'center',
      fixed: 'right',
      isOperations: true
    }
  }
}


export const rowOperationsColumn = {
    __key__: 'rowOperations',
    key: 'rowOperations',
    label: '操作',
    i18nLabel: 'operationCommands',
    prop: 'rowOperations',
    slotKey: 'row-operations',
    resizable: true,
    isOperations: true,
    fixed: 'right',
    isShow: true,
    columns: [],
    sortable: false,
    isSorting: false,
    order: 'none',
    orderIndex: -1,
    type: 'text',
    default: null,
    isValidate: false,
    required: false,
    clearable: false,
    validate: [],
    isCondition: false,
    width: 60
}
export const rowNoColumn = {
  __key__: 'rowNo',
  key: 'rowNo',
  label: '#',
  i18nLabel: '#',
  prop: 'rowNo',
  slotKey: 'row-no',
  resizable: true,
  isOperations: true,
  fixed: 'left',
  isShow: true,
  columns: [],
  sortable: false,
  isSorting: false,
  order: 'none',
  orderIndex: -1,
  type: 'text',
  default: null,
  isValidate: false,
  required: false,
  clearable: false,
  validate: [],
  isCondition: false,
  width: 60
}