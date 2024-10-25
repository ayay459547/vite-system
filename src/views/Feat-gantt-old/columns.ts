import { formatDatetime } from '@/lib/lib_format' // 格式化

const getDefaultDate = () => {
  const [start, end] = [new Date(), new Date()]
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
  end.setTime(end.getTime() + 3600 * 1000 * 24 * 1)

  return [formatDatetime(start, 'YYYY-MM-DD'), formatDatetime(end, 'YYYY-MM-DD')]
}

export const columnSetting = {
  orderIds: {
    label: '訂單',
    i18nLabel: 'order-no',
    table: {
      minWidth: 200,
      sortable: false
    }
  },
  // moId: {
  //   label: '母製令',
  //   table: {
  //     width: 150,
  //     sortable: false
  //   },
  //   filter: {
  //     isValidate: false,
  //     default: null
  //   }
  // },
  // moiId: {
  //   label: '工單',
  //   table: {
  //     width: 120,
  //     sortable: false
  //   },
  //   filter: {
  //     isValidate: false,
  //     default: null
  //   }
  // },
  // moiIndex: {
  // 	label: '工單編號',
  //   table: {
  //     width: 120,
  //     sortable: false
  //   },
  //   filter: {
  //     isValidate: false,
  //     default: null
  //   }
  // },
  status: {
    label: '狀態',
    i18nLabel: 'select-status',
    table: {
      width: 120,
      sortable: false
    },
    filter: {
      type: 'select',
      isValidate: false,
      default: '',
      options: [
        { i18nLabel: 'all', label: '全部', value: '' },
        { i18nLabel: 'gantt-state0', label: '未開工', value: '0' },
        { i18nLabel: 'gantt-state1', label: '已結清', value: '1' },
        { i18nLabel: 'gantt-state2', label: '已完工', value: '2' },
        { i18nLabel: 'gantt-state3', label: '生產中', value: '3' },
        { i18nLabel: 'gantt-state4', label: '已發放', value: '4' },
        { i18nLabel: 'gantt-state5', label: '未發放', value: '5' },
        { i18nLabel: 'gantt-state6', label: '暫緩', value: '6' },
        { i18nLabel: 'gantt-state999', label: '結案', value: '999' }
      ]
    }
  },
  productId: {
    label: '產品',
    i18nLabel: 'product-no',
    table: {
      minWidth: 200,
      sortable: false
    },
    filter: {
      isValidate: false,
      default: null
    }
  },
  productName: {
    label: '產品名稱',
    i18nLabel: 'product-name',
    table: {
      minWidth: 200,
      sortable: false
    },
    filter: {
      isValidate: false,
      default: null
    }
  },
  processId: {
    label: '製程',
    i18nLabel: 'process-no',
    table: {
      minWidth: 150,
      sortable: false
    },
    filter: {
      isValidate: false,
      default: null
    }
  },
  processName: {
    label: '製程名稱',
    i18nLabel: 'process-name',
    table: {
      minWidth: 150,
      sortable: false
    },
    filter: {
      isValidate: false,
      default: null
    }
  },
  machineId: {
    label: '機台',
    i18nLabel: 'machine-no',
    table: {
      minWidth: 180,
      sortable: false
    },
    filter: {
      isValidate: false,
      default: null
    }
  },
  machineName: {
    label: '機台名稱',
    i18nLabel: 'machine-name',
    table: {
      minWidth: 180,
      sortable: false
    },
    filter: {
      isValidate: false,
      default: null
    }
  },
  timeRange: {
    label: '時間區間',
    i18nLabel: 'datetime-range-date',
    filter: {
      isValidate: false,
      default: getDefaultDate(),
      type: 'daterange',
      shortcuts: [
        {
          text: '近一周',
          i18nLabel: 'nearlyAWeek',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
          }
        },
        {
          text: '近兩周',
          i18nLabel: 'nearlyTwoWeeks',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 14)
            return [start, end]
          }
        },
        {
          text: '近一個月',
          i18nLabel: 'nearlyAMonth',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
          }
        },
        {
          text: '近三個月',
          i18nLabel: 'nearlyThreeMonths',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
          }
        }
      ]
    }
  },
  startDate: {
    label: '預計開工時間',
    i18nLabel: 'estimate-startTime',
    table: {
      minWidth: 200,
      sortable: false
    }
  },
  endDate: {
    label: '預計完工時間',
    i18nLabel: 'estimate-endTime',
    table: {
      minWidth: 200,
      sortable: false
    }
  }
}
