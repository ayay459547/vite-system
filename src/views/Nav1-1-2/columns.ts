export const columnSetting = {
  id: {
    label: '編號',
    table: {
      width: 100,
      // fixed: 'left',
      align: 'center'
    },
    filter: {
      default: null
    }
  },
  userId: {
    label: '使用者編號',
    table: {
      width: 150
    },
    filter: {
      default: null
    }
  },
  title: {
    label: '項目',
    table: {
      minWidth: 300
    },
    filter: {
      default: null
    }
  },
  completed: {
    label: '是否完成',
    table: {
      width: 120
    },
    filter: {
      default: '',
      options: [
        { label: '全部', value: '' },
        { label: '已完成', value: '1' },
        { label: '未完成', value: '0' }
      ]
    }
  }
}