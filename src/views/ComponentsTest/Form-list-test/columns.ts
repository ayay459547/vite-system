export const columnSetting = {
  columnType: {
    label: '欄位',
    table: {
      width: 200
    },
    form: {
      type: 'select',
      options: [
        { label: '客戶名稱', value: 'custName' },
        { label: '客戶編號', value: 'custNo' },
        { label: '產品族編號', value: 'productGroupNo' },
        { label: '客戶型號', value: 'custProductNo' },
        { label: '產品編號', value: 'productNo' }
      ],
      default: '',
      validate: [],
      required: true,
      hiddenLabel: true
    }
  },
  filterType: {
    label: '篩選類型',
    table: {
      width: 200
    },
    form: {
      type: 'select',
      options: [
        { label: 'like', value: 'like' },
        { label: 'not like', value: 'notLike' },
        { label: '=', value: 'equal' },
        { label: '!=', value: 'notEqual' },
        { label: '>', value: 'greatterThan' },
        { label: '>=', value: 'greaterThanOrEqualTo' },
        { label: '<', value: 'lessThan' },
        { label: '<=', value: 'lessThanOrEqualTo' },
        { label: 'is blank', value: 'isBlank' },
        { label: 'not blank', value: 'notBlank' },
        { label: 'is null', value: 'isNull' },
        { label: 'not null', value: 'notBlank' }
      ],
      default: '',
      validate: [],
      required: true,
      hiddenLabel: true
    }
  },
  filterValue: {
    label: '篩選值',
    table: {
      minWidth: 200
    },
    form: {
      default: '',
      validate: [],
      required: true,
      hiddenLabel: true
    }
  }
  // name: {
  //   label: '姓名',
  //   table: {
  //     width: 200
  //   },
  //   form: {
  //     default: '',
  //     validate: [],
  //     required: true,
  //     hiddenLabel: true
  //   }
  // },
  // date: {
  //   label: '生日',
  //   table: {
  //     width: 200
  //   },
  //   form: {
  //     default: '',
  //     validate: [],
  //     required: true,
  //     hiddenLabel: true
  //   }
  // },
  // age: {
  //   label: '年齡',
  //   table: {
  //     width: 200
  //   },
  //   form: {
  //     default: '',
  //     validate: [],
  //     required: true,
  //     hiddenLabel: true
  //   }
  // },
  // address: {
  //   label: '地址',
  //   table: {
  //     minWidth: 200
  //   },
  //   form: {
  //     default: '',
  //     validate: [],
  //     required: true,
  //     hiddenLabel: true
  //   }
  // }
}
