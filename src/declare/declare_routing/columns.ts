import { operatorOptions } from '@/declare/declare_variable'

// 表格設定
export const columnSetting = {
  routeId: {
    label: '途程編號',
    i18nLabel: 'routing-no',
    table: {
      width: 300,
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
  orderIndex: {
    label: '途程站點順序',
    i18nLabel: 'routing-orderIndex',
    table: {
      width: 200,
      sortable: false,
      align: 'center',
      order: 'ascending',
      orderIndex: 1
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
  },
  processId: {
    label: '製程編號',
    i18nLabel: 'process-no',
    table: {
      minWidth: 200,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  processName: {
    label: '製程名稱',
    i18nLabel: 'process-name',
    table: {
      minWidth: 200,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  routePhaseIndx: {
    label: '生產道次編號',
    i18nLabel: 'routing-phase-no',
    table: {
      minWidth: 180,
      sortable: false
    },
    filter: {
      width: 250,
      type: 'select',
      isValidate: false,
      default: null,
      options: [
        { i18nLabel: 'all', label: '全部', value: '' },
        { label: '1', value: '1' },
        { label: '2', value: '2' }
      ],
      isCondition: true
    }
  },
  routePhase: {
    label: '生產道次名稱',
    i18nLabel: 'routing-phase-name',
    table: {
      minWidth: 180,
      sortable: false
    },
    filter: {
      width: 250,
      type: 'select',
      isValidate: false,
      default: '',
      options: [
        { i18nLabel: 'all', label: '全部', value: '' },
        { i18nLabel: 'routing-FEOL', label: '前道', value: 'FRONT' },
        { i18nLabel: 'routing-BEOL', label: '後道', value: 'END' }
      ],
      isCondition: true
    },
    getI18nValue: (data?: string) => {
      switch (data) {
        case 'FRONT': return 'routing-FEOL'
        case 'END': return 'routing-BEOL'
        default: return ''
      }
    },
    displayData: (params: any) => {
      const { data, i18nTranslate } = params
      switch (data) {
        case 'FRONT': return i18nTranslate('routing-FEOL')
        case 'END': return i18nTranslate('routing-BEOL')
        default: return ''
      }
    }
  },
  LAST_UPDATE_TIMESTAMP: {
    label: '最後更新時間',
    i18nLabel: 'last-updateTime',
    table: {
      minWidth: 350,
      sortable: false
    },
    filter: {
      width: 300,
      placement: 'top-end',
      isValidate: false,
      default: null,
      type: 'daterange',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      isCondition: true
    }
  }
}

// 跳轉設定
export const linkSetting = {
  processId: {
    fromPage: 'nav1-1',
    options: [
      {
        toPage: 'nav1-2'
        // description: '製程基本資訊'
      },
      {
        toPage: 'nav1-3'
        // description: '製程對應機台'
      }
    ]

  },
  routeId: {
    fromPage: 'nav2-1',
    options: [
      {
        toPage: 'nav2-2'
        // description: '途程相關訂單'
      }
    ]
  }
}
