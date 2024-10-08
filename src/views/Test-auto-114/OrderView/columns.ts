export const columnSetting = {
  id: {
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
  acquiredDate: {
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
    i18nLabel: 'bom-ver',
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
  isAlreadySetRushOrder: {
    label: '是否已設定插單',
    i18nLabel: 'insertOrder-exist',
    table: {
      minWidth: 180,
      sortable: false
    },
    filter: {
      width: 250,
      type: 'select',
      default: '',
      options: [
        { i18nLabel: 'all', label: '全部', value: '' },
        { i18nLabel: 'select-true', label: '是', value: 'Y' },
        { i18nLabel: 'select-false', label: '否', value: 'N' }
      ],
      isValidate: false
    },
    getValue(data: String) {
      switch (data) {
        case 'Y':
          return '是'
        case 'N':
          return '否'
        default:
          return ''
      }
    }
  }
}

// 跳轉設定
const fromPage = 'auto-114'
export const linkSetting = {
  id: {
    fromPage,
    options: [
      {
        toPage: 'auto-36'
        // description: '訂單詳細資訊',
        // i18nDescription: 'link-auto-36'
      }
    ]
  }
}