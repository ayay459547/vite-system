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
const fromPage = 'fund-131'
export const linkSetting = {
  processId: {
    fromPage,
    options: [
      {
        toPage: 'fund-121'
        // description: '製程相關途程',
        // i18nDescription: 'link-process-route'
      },
      {
        toPage: 'fund-132'
        // description: '製程對應機台',
        // i18nDescription: 'link-process-machine'
      },
      {
        toPage: 'fund-1441'
        // description: '排程排序設定',
        // i18nDescription: 'link-fund-1441'
      }
    ]
  }
}
