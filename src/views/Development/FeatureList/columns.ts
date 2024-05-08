export const columnSetting = {
  status: {
    label: '狀態',
    table: {
      width: 180,
      sortable: 'custom'
    },
    filter: {
      type: 'select',
      isValidate: false,
      default: '',
      direction: 'row',
      options: [
        { label: '全部', value: '' },
        { label: '已完成', value: 'completed' },
        { label: '進行中', value: 'inProgress' },
        { label: '未完成', value: 'new' }
      ],
      hiddenErrorMessage: true
    },
    getValue(data: string) {
      switch (data) {
        case 'completed':
          return '已完成'
        case 'inProgress':
          return '進行中'
        case 'new':
          return '未完成'
        default:
          return '未完成'
      }
    },
    getIcon(data: string) {
      switch (data) {
        case 'completed':
          return 'check'
        case 'inProgress':
          return 'hammer'
        case 'new':
          return 'xmark'
        default:
          return 'xmark'
      }
    },
    getClass(data: string) {
      switch (data) {
        case 'completed':
          return 'text-success'
        case 'inProgress':
          return 'text-warning'
        case 'new':
          return 'text-danger'
        default:
          return 'text-danger'
      }
    }
  },
  // startDate: {
  //   label: '預計開始日',
  //   table: {
  //     width: 130,
  //     sortable: 'custom'
  //   }
  // },
  // completedDate: {
  //   label: '預計完成日',
  //   table: {
  //     width: 130,
  //     sortable: 'custom'
  //   }
  // },
  title: {
    label: '名稱',
    table: {
      width: 250,
      sortable: 'custom'
    },
    filter: {
      type: 'text',
      isValidate: false,
      default: null,
      direction: 'row',
      hiddenErrorMessage: true
    }
  },
  path: {
    label: '網址',
    table: {
      width: 200,
      sortable: 'custom'
    },
    filter: {
      type: 'text',
      isValidate: false,
      default: null,
      direction: 'row',
      hiddenErrorMessage: true
    }
  },
  mode: {
    label: '功能模組',
    table: {
      width: 250,
      sortable: 'custom'
    },
    filter: {
      type: 'select',
      isValidate: false,
      default: null,
      direction: 'row',
      hiddenErrorMessage: true
    }
  },
  breadcrumbTitle: {
    label: '路徑',
    table: {
      minWidth: 320,
      sortable: 'custom'
    },
    filter: {
      type: 'text',
      isValidate: false,
      default: null,
      direction: 'row',
      hiddenErrorMessage: true
    }
  }
}
