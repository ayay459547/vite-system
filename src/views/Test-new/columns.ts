export const columnSetting = {
  column1: {
    label: '欄位1',
    table: {
      width: 180,
      align: 'left',
      fixed: 'left'
    },
    form: {
      type: 'text',
      default: null,
      required: true
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null
    }
  },
  column2: {
    label: '欄位2',
    table: {
      width: 280,
      align: 'center'
    },
    form: {
      type: 'text',
      default: null,
      required: true
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null
    }
  },
  column3: {
    label: '欄位3',
    table: {
      width: 280,
      isSorting: false
    },
    form: {
      type: 'text',
      default: null,
      required: true
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null
    }
  },
  column4: {
    label: '欄位4',
    table: {
      minWidth: 300
    },
    form: {
      type: 'text',
      default: null,
      required: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null
    }
  },
  column5: {
    label: '欄位5',
    table: {
      width: 200,
      align: 'left',
      fixed: 'right',
      isOperations: true
    },
    form: {
      type: 'text',
      default: null,
      required: false
    }
  },
  operations: {
    label: '操作',
    table: {
      width: 60,
      align: 'center',
      fixed: 'right',
      isOperations: true
    }
  }
}