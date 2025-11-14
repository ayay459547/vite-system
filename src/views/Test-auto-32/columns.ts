import { numberFormat } from '@/lib/lib_format' // 格式化
import { operatorOptions } from '@/declare/declare_variable'

export const columnSetting = {
  erpNo: {
    label: '訂單編號',
    i18nLabel: 'order-no',
    table: {
      width: 170,
      sortable: false,
      order: 'ascending',
      orderIndex: 0
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  no: {
    label: '工單編號', // 產品批號 -> 工單編號
    i18nLabel: 'manufacturing-order-no',
    table: {
      width: 220,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  /**
   * 工單緊急度 LEVEL_1 ~ LEVEL_10
   * 急單 是 LEVEL_1, 否 LEVEL_10
   */
  severity: {
    label: '急單',
    i18nLabel: 'superHotRun',
    // label: '工單緊急度',
    // i18nLabel: 'manufacturing-order-severity',
    table: {
      width: 140,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      type: 'select',
      default: '',
      options: [
        { label: '全部', i18nLabel: 'all', value: '' },
        { label: '是', i18nLabel: 'select-true', value: 'LEVEL_1' },
        { label: '否', i18nLabel: 'select-false', value: 'LEVEL_10' }
      ]
    }
  },
  sequence: {
    label: '生產順序',
    i18nLabel: 'production-sequence',
    table: {
      width: 150,
      sortable: false,
      align: 'center',
      order: 'ascending',
      orderIndex: 1
    },
    filter: {
      width: 250,
      type: 'operator',
      isValidate: false,
      default: ['greatterThanOrEqualTo', null],
      options: operatorOptions,
      onlyNumber: true,
      isCondition: true
    }
  },
  process_id: {
    label: '製程編號',
    i18nLabel: 'process-no',
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
  process_name: {
    label: '製程名稱',
    i18nLabel: 'process-name',
    table: {
      width: 170,
      sortable: false,
      isShow: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  scheduledMachine_Id: {
    label: '機台編號',
    i18nLabel: 'machine-no',
    table: {
      minWidth: 180,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  moveInTime: {
    label: '預計到站時間',
    i18nLabel: 'move-in-time',
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
  predefinedstartdatetime: {
    label: '預計開工時間',
    i18nLabel: 'estimate-startTime',
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
  predefinedCompleteDate: {
    label: '預計完工時間',
    i18nLabel: 'estimate-endTime',
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
  status: {
    label: '工單狀態',
    i18nLabel: 'manufacturing-order-status',
    table: {
      width: 180,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      type: 'select',
      multiple: true,
      default: [],
      options: [
        // { i18nLabel: 'all', label: '全部', value: '' },
        { label: '生產中', value: '3' },
        { label: '完工', value: '2' },
        { label: '停工中', value: '6' },
        { label: '工單到站', value: '7' },
        { label: '工單出站', value: '8' },
        { label: '已結案', value: '999' },
        { label: '未開工', value: '0' }
      ]
    },
    getValue(data?: number) {
      switch (data) {
        case 3:
          return '生產中'
        case 2:
          return '完工'
        case 6:
          return '停工中'
        case 7:
          return '工單到站'
        case 8:
          return '工單出站'
        case 999:
          return '已結案'
        case 0:
          return '未開工'
        default:
          return ''
      }
    }
  },
  predeinedAmount: {
    label: '需求量',
    i18nLabel: 'demand-quantity',
    // i18nLabel: 'production-quantity',
    table: {
      width: 170,
      sortable: false,
      align: 'right'
    },
    filter: {
      width: 250,
      type: 'operator',
      isValidate: false,
      default: ['greatterThanOrEqualTo', null],
      options: operatorOptions,
      onlyNumber: true,
      isCondition: true
    },
    getValue(data?: number): string {
      return numberFormat(data, {
        isToLocaleString: true,
        type: 'none'
      })
    }
  },
  quantityOfQualification: {
    label: '生產量',
    i18nLabel: 'production-quantity',
    table: {
      width: 170,
      sortable: false,
      align: 'right'
    },
    filter: {
      width: 250,
      type: 'operator',
      isValidate: false,
      default: ['greatterThanOrEqualTo', null],
      options: operatorOptions,
      onlyNumber: true,
      isCondition: true
    },
    getValue(data?: number): string {
      return numberFormat(data, {
        isToLocaleString: true,
        type: 'none'
      })
    }
  },
  bom_ver: {
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
  custDeviceNo: {
    label: '客戶型號',
    i18nLabel: 'customer-product-id',
    table: {
      width: 200,
      sortable: false,
      isShow: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  bom_Id: {
    label: '產品編號',
    i18nLabel: 'product-no',
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
  // isSchedule: {
  //   label: '是否有排程',
  //   i18nLabel: 'schedule-exist',
  //   table: {
  //     width: 180,
  //     sortable: false
  //   },
  //   filter: {
  //     width: 160,
  //     isValidate: false,
  //     type: 'select',
  //     default: '',
  //     options: [
  //       { i18nLabel: 'all', label: '全部', value: '' },
  //       { i18nLabel: 'select-true', label: 'Y', value: 'Y' },
  //       { i18nLabel: 'select-false', label: 'N', value: 'N' }
  //     ]
  //   },
  //   getI18nValue(data?: string) {
  //     switch (data) {
  //       case 'Y':
  //         return 'yes'
  //       case 'N':
  //         return 'no'
  //       default:
  //         return ''
  //     }
  //   }
  // },
  planInfo: {
    label: '分配資訊',
    i18nLabel: 'allocate-information',
    table: {
      width: 120,
      sortable: false,
      align: 'center'
    }
  },
  cust: {
    label: '客戶名稱',
    i18nLabel: 'customer-name',
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
  custNo: {
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
  productGroup_Id: {
    label: '產品族',
    i18nLabel: 'product-group',
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
  CREATE_DATE: {
    label: '工單建立時間',
    i18nLabel: 'subManufacture-createTime',
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
  LAST_UPDATE_TIMESTAMP: {
    label: '工單最後更新時間',
    i18nLabel: 'subManufacture-lastUpdatedTime',
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
  machine_areaName: {
    label: '機台區域',
    i18nLabel: 'machine-area',
    table: {
      width: 180,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  numPriority: {
    label: '優先權值',
    i18nLabel: 'priority-value',
    table: {
      width: 180,
      sortable: false,
      align: 'right'
    },
    filter: {
      width: 250,
      type: 'operator',
      isValidate: false,
      default: ['greatterThanOrEqualTo', null],
      options: operatorOptions,
      onlyNumber: true,
      isCondition: true
    },
    getValue(data?: number): string {
      return numberFormat(data, {
        isToLocaleString: true,
        type: 'none'
      })
    }
  }
}

// 跳轉設定
const fromPage = 'nav1-1'
export const linkSetting = {
  erpNo: {
    fromPage,
    options: [
      {
        toPage: 'nav1-2'
        // description: '訂單詳細資訊'
      },
      {
        toPage: 'nav1-3'
        // description: '訂單報工作業'
      }
    ]
  },
  process_id: {
    fromPage,
    options: [
      {
        toPage: 'nav2-3'
        // description: '製程基本資訊'
      },
      {
        toPage: 'nav2-1'
      },
      {
        fromPage: fromPage + '_process',
        toPage: 'nav1-1'
      }
    ]
  },
  bom_ver: {
    fromPage,
    options: [
      {
        toPage: 'nav1-2'
        // description: '途程詳細資訊'
      }
    ]
  },
  scheduledMachine_Id: {
    fromPage,
    options: [
      {
        toPage: 'nav2-1'
        // description: '機台基本資訊'
      },
      {
        toPage: 'nav2-2'
      },
      {
        toPage: 'nav2-3'
      }
    ]
  },
  machine_areaName: {
    fromPage,
    options: [
      {
        toPage: 'nav2-4'
        // description: '區域資訊'
      }
    ]
  }
}
