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
      default: null
    }
  },
  areaName: {
    label: '機台區域',
    i18nLabel: 'machine-area',
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
  sum: {
    label: '插單總數',
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
  machineNote: {
    label: '機台狀態',
    i18nLabel: 'machine-note',
    table: {
      minWidth: 180,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null
    }
  }
}
