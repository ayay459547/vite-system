export const columnSetting = {
  date: {
    label: '生日',
    table: {
      width: 150,
      // fixed: 'left',
      align: 'center'
    },
    form: {
      default: null,
      validate: [],
      required: true
    }
  },
  name: {
    label: '姓名',
    table: {
      width: 150
    },
    form: {
      default: null,
      validate: [],
      required: true,
      isOperations: false
    }
  },
  address: {
    label: '地址',
    table: {
      minWidth: 300
    },
    form: {
      default: null,
      required: false,
      options: [
        { label: 'address-1-No. 189, Grove St, Los Angeles', value: 'address-1' },
        { label: 'address-2-No. 177, Grove St, Los Angeles', value: 'address-2' },
        { label: 'address-3-No. 123, Grove St, Los Angeles', value: 'address-3' }
      ],
      isOperations: false
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