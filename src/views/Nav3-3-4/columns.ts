export const columnSetting = {
  version: {
    label: '版本',
    search: {
      type: 'select',
      default: '',
      // multiple: true,
      required: true,
      options: []
    }
  },
  dateInterval: {
    label: '日期',
    // table: {
    //   width: 150,
    //   sortable: false
    // },
    search: {
      type: 'select',
      default: [],
      multiple: true,
      required: true,
      options: []
    }
  },
  showCorrectCompare: {
    label: '是否顯示正確資料',
    search: {
      type: 'checkbox',
      default: false,
      required: false,
      hiddenLabel: true
    }
  },
  // 有排序
  machine: {
    label: '機台',
    table: {
      width: 150,
      sortable: false
    },
    filter: {
      type: 'select',
      default: [],
      multiple: true,
      filterable: true,
      required: false,
      options: []
    }
  },
  custProduct: {
    label: '客戶產品',
    table: {
      width: 200,
      sortable: false
    },
    filter: {
      type: 'select',
      default: [],
      multiple: true,
      required: false,
      options: []
    }
  },
  process: {
    label: '製程',
    table: {
      width: 150,
      sortable: false
    },
    filter: {
      type: 'select',
      default: [],
      multiple: true,
      filterable: true,
      required: false,
      options: []
    }
  },
  product: {
    label: '產品型號',
    table: {
      width: 200,
      sortable: false
    },
    filter: {
      type: 'select',
      default: [],
      multiple: true,
      filterable: true,
      required: false,
      options: []
    }
  },
  productGroup: {
    label: '產品類',
    table: {
      width: 200,
      sortable: false
    },
    filter: {
      type: 'select',
      default: [],
      multiple: true,
      filterable: true,
      required: false,
      options: []
    }
  },
  reportRestrictedGroup: {
    label: '裝置類',
    table: {
      width: 200,
      sortable: false
    },
    filter: {
      type: 'select',
      default: [],
      multiple: true,
      filterable: true,
      required: false,
      options: []
    }
  },
  // 無排序
  restrictionCategoryName: {
    label: '配置分類',
    table: {
      width: 180,
      sortable: false
    }
  },
  restrictionResourceName: {
    label: '配置資源',
    table: {
      width: 250,
      sortable: false
    }
  },
  // 細部資料
  restrictionName: {
    label: '比對類別',
    table: {
      width: 200,
      sortable: false
    }
  },
  restrictionValue: {
    label: '設定基準',
    table: {
      width: 200,
      sortable: false
    }
  },
  matchingType: {
    label: '比對方式',
    table: {
      width: 200,
      sortable: false
    }
  },
  inputValue: {
    label: '實際配置',
    table: {
      width: 200,
      sortable: false
    }
  },
  compareDetailInsufficient: {
    label: '缺少配置',
    table: {
      width: 200,
      sortable: false
    }
  },
  compareDetailExtra: {
    label: '多餘配置',
    table: {
      width: 200,
      sortable: false
    }
  },
  discrepancy: {
    label: '數量計算後多寡',
    table: {
      minWidth: 200,
      sortable: false
    }
  }
}