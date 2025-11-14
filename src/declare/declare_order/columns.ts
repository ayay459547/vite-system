import { formatDatetime } from '@/lib/lib_format' // 格式化
import { operatorOptions } from '@/declare/declare_variable'

export const columnSetting = {
  id: {
    label: '訂單編號',
    i18nLabel: 'order-no',
    table: {
      width: 170,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  custDeviceNo: {
    label: '客戶型號',
    i18nLabel: 'customer-product-id',
    table: {
      width: 160,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  bomId: {
    label: '產品編號',
    i18nLabel: 'product-no',
    table: {
      width: 160,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  bomRevision: {
    label: '流程代號',
    i18nLabel: 'routing-no',
    table: {
      width: 200,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  classCode: {
    label: '生產類別',
    i18nLabel: 'production-type',
    table: {
      width: 170,
      sortable: false,
      isShow: false
    },
    filter: {
      width: 250,
      isValidate: false,
      type: 'select',
      default: '',
      options: [
        { i18nLabel: 'all', label: '全部', value: '' },
        { i18nLabel: 'product-type-arrived', label: '到廠', value: 'Arrived' },
        { i18nLabel: 'product-type-wip', label: '在製品', value: 'Wip' },
        { i18nLabel: 'product-type-engineeringWip', label: '工程指定貨批', value: 'EngineeringWip' },
        { i18nLabel: 'product-type-reserved', label: '未到廠', value: 'Reserved' }
      ],
      isCondition: true
    },
    getValue: (data: string) => {
      switch (data) {
        case 'Arrived':
          return '到廠'
        case 'EngineeringWip':
          return '工程指定貨批'
        case 'Reserved':
          return '未到廠'
        case 'Wip':
          return '在製品'
        default:
          return ''
      }
    },
    getI18nValue: (data: string) => {
      switch (data) {
        case '到廠':
          return 'product-type-arrived'
        case '工程指定貨批':
          return 'product-type-engineeringWip'
        case '未到廠':
          return 'product-type-reserved'
        case '在製品':
          return 'product-type-wip'
        default:
          return data
      }
    }
  },
  customerId: {
    label: '客戶編號',
    i18nLabel: 'customer-no',
    table: {
      width: 170,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  custName: {
    label: '客戶名稱',
    i18nLabel: 'customer-name',
    table: {
      width: 170,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  productGroupId: {
    label: '產品族',
    i18nLabel: 'product-group',
    table: {
      width: 160,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  status: {
    label: '工單狀態',
    i18nLabel: 'manufacturing-order-status',
    table: {
      width: 170,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      type: 'select',
      default: '',
      options: [
        { i18nLabel: 'all', label: '全部', value: '' },
        { i18nLabel: 'manufacturing-order-status-created', label: '已創單', value: 'Created' },
        { i18nLabel: 'manufacturing-order-status-iPaspOrderGenerated', label: '已拆單', value: 'iPaspOrderGenerated' },
        { i18nLabel: 'manufacturing-order-status-close', label: '已結案', value: 'Close' }
      ],
      isCondition: true
    },
    getValue: (data: string) => {
      switch (data) {
        case 'Created':
          return '已創單'
        case 'iPaspOrderGenerated':
          return '已拆單'
        case 'Close':
          return '已結案'
        default:
          return '未定義'
      }
    },
    getI18nValue: (data: string) => {
      switch (data) {
        case 'Created':
          return 'manufacturing-order-status-created'
        case 'iPaspOrderGenerated':
          return 'manufacturing-order-status-iPaspOrderGenerated'
        case 'Close':
          return 'manufacturing-order-status-close'
        default:
          return 'undefined'
      }
    }
  },
  acquiredDate: {
    label: '需求日',
    i18nLabel: 'demand-date',
    table: {
      width: 170,
      sortable: false
    },
    filter: {
      width: 350,
      placement: 'top-end',
      isValidate: false,
      default: null,
      type: 'daterange',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      isCondition: true
    },
    getValue(data: string) {
      return formatDatetime(data, 'YYYY-MM-DD')
    }
  },
  createDate: {
    label: '資料建立時間',
    i18nLabel: 'create-date',
    table: {
      width: 200,
      sortable: false
    },
    filter: {
      width: 350,
      placement: 'top-end',
      isValidate: false,
      default: null,
      type: 'daterange',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      isCondition: true
    }
  },
  lastUpdateTimestamp: {
    label: '最後更新時間',
    i18nLabel: 'last-updateTime',
    table: {
      width: 200,
      sortable: false
    },
    filter: {
      width: 350,
      placement: 'top-end',
      isValidate: false,
      default: null,
      type: 'datetimerange',
      format: 'YYYY-MM-DD HH:mm',
      valueFormat: 'YYYY-MM-DDTHH:mm',
      isCondition: true
    }
  },
  numPriority: {
    label: '優先權值',
    i18nLabel: 'priority-value',
    table: {
      width: 170,
      sortable: false
    },
    filter: {
      width: 250,
      type: 'operator',
      operatorType: 'number',
      isValidate: false,
      default: ['greatterThanOrEqualTo', null],
      options: operatorOptions,
      isCondition: true
    }
  }
}

export const subColumnSetting = {
  erpNo: {
    label: '訂單編號',
    i18nLabel: 'order-no',
    // label: '工單編號',
    // i18nLabel: 'manufacturing-order-no',
    table: {
      width: 160,
      sortable: false
    }
  },
  sequence: {
    label: '生產順序',
    i18nLabel: 'production-sequence',
    table: {
      width: 85,
      sortable: false
    }
  },
  custDeviceNo: {
    label: '客戶型號',
    i18nLabel: 'customer-product-id',
    table: {
      width: 250,
      sortable: false
    }
  },
  bom_Id: {
    label: '產品編號',
    i18nLabel: 'product-no',
    table: {
      width: 250,
      sortable: false
    }
  },
  bom_ver: {
    label: '流程代號',
    i18nLabel: 'routing-no',
    table: {
      width: 250,
      sortable: false
    }
  },
  no: {
    // label: '產品批號',
    label: '訂單批號',
    i18nLabel: 'order-lot-no',
    table: {
      width: 160,
      sortable: false
    }
  },
  predeinedAmount: {
    // number
    label: '生產量',
    i18nLabel: 'production-quantity',
    table: {
      width: 80,
      sortable: false
    }
  },
  cust: {
    label: '客戶名稱',
    i18nLabel: 'customer-name',
    table: {
      width: 160,
      sortable: false
    }
  },
  custNo: {
    label: '客戶編號',
    i18nLabel: 'customer-no',
    table: {
      width: 160,
      sortable: false
    }
  },
  productGroup_Id: {
    label: '產品族',
    i18nLabel: 'product-group',
    table: {
      width: 250,
      sortable: false
    }
  },
  process_name: {
    label: '製程名稱',
    i18nLabel: 'process-name',
    table: {
      width: 250,
      sortable: false
    }
  },
  process_id: {
    label: '製程編號',
    i18nLabel: 'process-no',
    table: {
      width: 100,
      sortable: false
    }
  },
  scheduledMachine_Id: {
    i18nLabel: 'machine-no',
    label: '機台編號',
    table: {
      width: 250,
      sortable: false
    }
  },
  status: {
    i18nLabel: 'manufacturing-order-status',
    label: '工單狀態',
    table: {
      width: 85,
      sortable: false
    },
    getValue: (data: number) => {
      switch (data) {
        case 0: return '未開工'
        case 2: return '完工'
        case 3: return '生產中'
        case 6: return '停工中'
        case 7: return '工單到站'
        case 8: return '工單出站'
        case 999: return '已結案'
        default: return '未定義'
      }
    }
  },
  CREATE_DATE: {
    label: '子指令建立時間',
    i18nLabel: 'subManufacture-createTime',
    table: {
      width: 200,
      sortable: false
    }
  },
  LAST_UPDATE_TIMESTAMP: {
    label: '子指令最後更新時間',
    i18nLabel: 'subManufacture-lastUpdatedTime',
    table: {
      width: 200,
      sortable: false
    }
  },
  predefinedstartdatetime: {
    label: '預計開工時間',
    i18nLabel: 'estimate-startTime',
    table: {
      width: 200,
      sortable: false
    }
  },
  predefinedcompletedatetime: {
    label: '預計完工時間',
    i18nLabel: 'estimate-endTime',
    table: {
      width: 200,
      sortable: false
    }
  },
  required_amount: {
    // number
    label: '需求量',
    i18nLabel: 'demand-quantity',
    table: {
      width: 80,
      sortable: false
    }
  },
  machine_areaName: {
    label: '機台區域',
    i18nLabel: 'machine-area',
    table: {
      width: 85,
      sortable: false
    }
  },
  numPriority: {
    label: '優先權值',
    i18nLabel: 'priority-value',
    table: {
      width: 85,
      sortable: false
    }
  }
}

// 跳轉設定
const fromPage = 'nav2-1'
export const linkSetting = {
  id: {
    fromPage,
    options: [
      {
        toPage: 'nav1-1'
        // description: '訂單排程資訊'
      },
      {
        toPage: 'nav1-2'
        // description: '訂單報工作業',
        // i18nDescription: 'link-order-report'
      }
    ]
  },
  bomRevision: {
    fromPage,
    options: [
      {
        toPage: 'nav2-1'
        // description: '途程詳細資訊',
        // i18nDescription: 'link-routing-detail'
      }
    ]
  }
}
