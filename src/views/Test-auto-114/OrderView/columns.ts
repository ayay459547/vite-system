export const columnSetting = {
  orderId: {
    label: '訂單編號',
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
  demandDate: {
    label: '需求日',
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
  routeId: {
    label: '流程代號',
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
  isSettingsRushOrder: {
    label: '是否已設定插單',
    table: {
      minWidth: 180,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null
    },
    getValue (data: boolean) {
      if (typeof data === 'boolean') return data ? '是' : '否'
      return ''
    }
  }
}
