export const columnSetting = {
  no: {
    label: '編號',
    table: {
      width: 200,
      isSorting: true,
      order: 'ascending'
    },
    form: {
      default: null,
      validate: [],
      required: true
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  name: {
    label: '名稱',
    table: {
      width: 200,
      isSorting: true,
      order: 'descending'
    },
    form: {
      default: null,
      validate: [],
      required: true
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  location: {
    label: '區域',
    table: {
      width: 200,
      isSorting: false
    },
    form: {
      default: null,
      validate: [],
      required: true
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  statusRemarks: {
    label: '狀態註記',
    table: {
      minWidth: 200
    },
    form: {
      default: null,
      validate: [],
      required: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  leadTime: {
    label: '換線前置時間',
    table: {
      minWidth: 200
    },
    form: {
      default: null,
      validate: [],
      required: true
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  productionCapacity: {
    label: '產能',
    table: {
      width: 200
    },
    form: {
      type: 'select',
      default: null,
      validate: [],
      required: true,
      options: [
        { i18nLabel: 'effectiveCapacity', label: '有限產能', value: '1' },
        { i18nLabel: 'infinityCapacity', label: '無限產能', value: '2' }
      ]
    },
    filter: {
      type: 'text',
      default: null,
      validate: []
      // options: [
      //   { label: 'effectiveCapacity', value: '1' },
      //   { label: 'infinityCapacity', value: '2' },
      //   { label: 'infinityCapacity2', value: '3' },
      //   { label: 'infinityCapacity3', value: '4' },
      //   { label: 'infinityCapacity4', value: '5' }
      // ]
    }
  },
  groupName: {
    label: '群組名稱',
    table: {
      width: 200
    },
    form: {
      default: null,
      validate: [],
      required: true
    },
    filter: {
      default: null
    }
  },
  operations: {
    label: '操作',
    i18nLabel: 'operationCommands',
    table: {
      width: 80,
      align: 'center',
      fixed: 'right',
      isOperations: true
    }
  }
}

export const childColumnSetting = {
  operationMethodCode: {
    label: '作業編號',
    table: {
      width: 180
    }
  },
  operationMethod: {
    label: '作業方式',
    table: {
      width: 180
    }
  },
  productivity: {
    label: '產能',
    table: {
      width: 180
    }
  },
  machineTime: {
    label: '時間',
    table: {
      width: 180
    }
  }
}
