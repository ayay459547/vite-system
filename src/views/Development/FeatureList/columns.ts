export const columnSetting = {
  status: {
    label: '狀態',
    table: {
      width: 180
    },
    filter: {
      default: '',
      options: [
        { label: '全部', value: '' },
        { label: '已完成', value: 'completed' },
        { label: '進行中', value: 'inProgress' },
        { label: '未完成', value: 'new' }
      ]
    },
    getValue (data: string) {
      switch (data) {
        case 'completed': return '已完成'
        case 'inProgress': return '進行中'
        case 'new': return '未完成'
        default: return '未完成'
      }
    },
    getIcon (data: string) {
      switch (data) {
        case 'completed': return 'check'
        case 'inProgress': return 'hammer'
        case 'new': return 'xmark'
        default: return 'xmark'
      }
    },
    getClass (data: string) {
      switch (data) {
        case 'completed': return 'text-success'
        case 'inProgress': return 'text-warning'
        case 'new': return 'text-danger'
        default: return 'text-danger'
      }
    }
  },
  title: {
    label: '名稱',
    table: {
      width: 250
    },
    filter: {
      default: null
    }
  },
  path: {
    label: '網址',
    table: {
      width: 200
    },
    filter: {
      default: null
    }
  },
  mode: {
    label: '功能模組',
    table: {
      width: 250
    },
    filter: {
      default: null
    }
  },
  breadcrumbTitle: {
    label: '路徑',
    table: {
      minWidth: 300
    },
    filter: {
      default: null
    }
  }
}