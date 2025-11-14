export const columnSetting = {
  processId: {
    label: '製程編號',
    i18nLabel: 'process-no',
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
  processName: {
    label: '製程名稱',
    i18nLabel: 'process-name',
    table: {
      minWidth: 220,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  processGroup: {
    label: '製程群組',
    i18nLabel: 'process-group',
    table: {
      minWidth: 220,
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
  processNote: {
    label: '備註',
    i18nLabel: 'note',
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
  lastUpdateDate: {
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
const fromPage = 'nav1-1'
export const linkSetting = {
  processId: {
    fromPage,
    options: [
      {
        toPage: 'nav2-1'
        // description: '製程相關途程'
      },
      {
        toPage: 'nav2-2'
        // description: '製程對應機台'
      },
      {
        toPage: 'nav2-3'
        // description: '排程排序設定''
      }
    ]
  }
}
