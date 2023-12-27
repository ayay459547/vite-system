export const columnSetting = {
  name: {
    label: '姓名',
    table: {
      width: 150
    },
    form: {
      type: 'text',
      default: null,
      validate: [],
      required: true
    }
  },
  date: {
    label: '生日',
    table: {
      width: 150,
      // fixed: 'left',
      align: 'center'
    },
    form: {
      type: 'date',
      default: null,
      validate: [],
      required: true
    }
  },
  address: {
    label: '地址',
    table: {
      minWidth: 300
    },
    form: {
      type: 'select',
      default: '',
      required: false,
      options: [
        { label: 'address-1-No. 189, Grove St, Los Angeles', value: 'address-1' },
        { label: 'address-2-No. 177, Grove St, Los Angeles', value: 'address-2' },
        { label: 'address-3-No. 123, Grove St, Los Angeles', value: 'address-3' }
      ]
    }
  },
  test: {
    label: '多欄測試',
    table: {
      sortable: false,
      children: {
        state: {
          label: '狀態',
          width: 160,
          align: 'center'
        },
        city: {
          label: '城市',
          width: 250,
          align: 'left'
        }
      }
    }
  },
  operations: {
    label: '操作',
    table: {
      width: 60,
      align: 'center',
      fixed: 'right',
      isOperations: true
    }
  }
}
