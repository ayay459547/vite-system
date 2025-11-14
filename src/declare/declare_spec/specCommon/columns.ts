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
const fromPage = 'nav1-1'
export const linkSetting: Record<string, any> = {
  specTypeId: {
    fromPage,
    options: [
      {
        toPage: 'nav1-2'
        // description: '規格類型管理'
      }
    ]
  },
  id: {
    fromPage,
    options: [
      {
        toPage: 'nav1-3'
        // description: '機台規格管理'
      },
      {
        toPage: 'nav1-4'
        // description: '產品規格管理'
      },
      {
        toPage: 'nav2-1'
        // description: '工單規格管理'
      }
    ]
  }
}
