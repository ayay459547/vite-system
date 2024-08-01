export const columnSetting = {
  column1: {
    label: '欄位1',
    i18nLabel: 'column1',
    table: {
      width: 180,
      align: 'left',
      fixed: 'left',
      isCondition: true
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
    i18nLabel: 'column2',
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
    i18nLabel: 'column3',
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
    i18nLabel: 'column4',
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
    i18nLabel: 'column5',
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
    i18nLabel: 'operationCommands',
    table: {
      width: 60,
      align: 'center',
      fixed: 'right',
      isOperations: true
    }
  }
}
