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
    table: {
      minWidth: 180,
      sortable: false
    },
    filter: {
      width: 250,
      type: 'select',
      default: '',
      options: [
        { label: '全部', value: '' },
        { label: '是', value: 'Y' },
        { label: '否', value: 'N' }
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