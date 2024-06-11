export const columnSetting = {
  machineId: {
    label: '機台編號',
    i18nLabel: 'machineId',
    table: {
      minWidth: 180,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null
    }
  },
  machineName: {
    label: '機台名稱',
    i18nLabel: 'machineName',
    table: {
      minWidth: 200,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null
    }
  },
  areaName: {
    label: '機台區域',
    i18nLabel: 'areaName',
    table: {
      minWidth: 200,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null
    }
  },
  machineNote: {
    label: '機台狀態註記',
    i18nLabel: 'machineNote',
    table: {
      minWidth: 180,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null
    }
  },
  operations: {
    label: '操作',
    i18nLabel: 'operationCommands',
    table: {
      width: 120,
      align: 'center',
      fixed: 'right',
      isOperations: true
    }
  }
}

// 跳轉設定
const fromPage = 'fund-1413'
export const linkSetting = {
  machineId: {
    fromPage,
    options: [
      {
        toPage: 'fund-132'
        // description: '機台對應製程',
        // i18nDescription: 'link-machine-process'
      },
      {
        toPage: 'fund-1426'
        // description: '排程排序設定',
        // i18nDescription: 'link-fund-1426'
      }
    ]
  }
}
