export const columnSetting = {
  machineNo: {
    label: '機台編號',
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
  machineName: {
    label: '機台名稱',
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
  machineLocation: {
    label: '機台區域',
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
  machineStatusRemarks: {
    label: '機台狀態註記',
    table: {
      minWidth: 200
    },
    form: {
      default: null,
      validate: [],
      required: false
    },
    filter: {
      default: null
    }
  },
  leadTime: {
    label: '機台換線前置時間',
    table: {
      minWidth: 200
    },
    form: {
      default: null,
      validate: ['number'],
      required: true
    },
    filter: {
      default: null
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
        { label: 'effectiveCapacity', value: '1' },
        { label: 'infinityCapacity', value: '2' }
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
    label: '機台時間',
    table: {
      width: 180
    }
  }
}
