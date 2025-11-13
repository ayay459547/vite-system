export const columnSetting = {
  machineId: {
    label: '機台編號',
    i18nLabel: 'machine-no',
    table: {
      minWidth: 180,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  machineName: {
    label: '機台名稱',
    i18nLabel: 'machine-name',
    table: {
      minWidth: 180,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  areaNo: {
    label: '機台區域',
    i18nLabel: 'machine-area-no',
    table: {
      minWidth: 240,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  areaName: {
    label: '機台區域',
    i18nLabel: 'machine-area-name',
    table: {
      minWidth: 240,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  machineNote: {
    label: '機台狀態註記',
    i18nLabel: 'machine-note',
    table: {
      minWidth: 180,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  hasWorkingTime: {
    label: '工時設定',
    i18nLabel: 'machine-workingHours-has',
    table: {
      minWidth: 180,
      sortable: false
    },
    filter: {
      type: 'select',
      default: null,
      i18nModule: 'system',
      options: [
        { i18nLabel: 'select-true', label: '是', value: 1 },
        { i18nLabel: 'select-false', label: '否', value: 0 }
      ]
    }
  },
  horizontal_LAST_UPDATE_TIMESTAMP: {
    label: '最後更新時間',
    i18nLabel: 'last-updateTime',
    table: {
      width: 350,
      sortable: false
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
