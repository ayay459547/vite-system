// 常用欄位設定

export const textColumn = {
  table: {
    minWidth: 200,
    sortable: false
  },
  form: {
    type: 'text',
    default: null,
    required: true
  },
  filter: {
    width: 250,
    isValidate: false,
    default: null,
    isCondition: true
  }
}

export const dateColumn = {
  table: {
    minWidth: 350,
    sortable: false
  },
  form: {

  },
  filter: {
    width: 350,
    placement: 'top-end',
    isValidate: false,
    default: null,
    type: 'daterange',
    format: 'YYYY-MM-DD',
    valueFormat: 'YYYY-MM-DD',
    isCondition: true
  }
}
