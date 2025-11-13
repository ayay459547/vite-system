export const columnSetting = {
  id: {
    label: '規格編號',
    i18nLabel: 'specification-no',
    table: {
      minWidth: 160,
      sortable: false
    },
    formTable: {
      minWidth: 160,
      sortable: false,
      required: true
    },
    form: {
      i18nModule: 'system',
      type: 'text',
      default: null,
      validate: ['pkId'],
      required: true
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  name: {
    label: '規格名稱',
    i18nLabel: 'specification-name',
    table: {
      minWidth: 160,
      sortable: false
    },
    formTable: {
      minWidth: 160,
      sortable: false,
      required: true
    },
    form: {
      i18nModule: 'system',
      type: 'text',
      default: null,
      required: true
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  content: {
    label: '規格內容',
    i18nLabel: 'specification-content',
    table: {
      minWidth: 160,
      sortable: false
    },
    formTable: {
      minWidth: 160,
      sortable: false,
      required: true
    },
    form: {
      i18nModule: 'system',
      type: 'text',
      default: null,
      required: true
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  specTypeId: {
    label: '規格類型編號',
    i18nLabel: 'specification-type-no',
    table: {
      minWidth: 160,
      sortable: false
    },
    formTable: {
      minWidth: 160,
      sortable: false,
      required: true
    },
    form: {
      i18nModule: 'system',
      type: 'select',
      options: [],
      filterable: true,
      default: null,
      required: true
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  LAST_UPDATE_TIMESTAMP: {
    label: '最後更新時間',
    i18nLabel: 'last-updateTime',
    table: {
      width: 350,
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
  }
}

// 跳轉設定
const fromPage = 'fund-202'
export const linkSetting: Record<string, any> = {
  specTypeId: {
    fromPage,
    options: [
      {
        toPage: 'fund-201'
        // description: '規格類型管理',
        // i18nDescription: 'fund-201'
      }
    ]
  },
  id: {
    fromPage,
    options: [
      {
        toPage: 'fund-203'
        // description: '機台規格管理',
        // i18nDescription: 'fund-203'
      },
      {
        toPage: 'fund-204'
        // description: '產品規格管理',
        // i18nDescription: 'fund-204'
      },
      {
        toPage: 'fund-205'
        // description: '工單規格管理',
        // i18nDescription: 'fund-205'
      }
    ]
  }
}
