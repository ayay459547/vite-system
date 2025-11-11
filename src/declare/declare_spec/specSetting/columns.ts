export const columnSetting = {
  specId: {
    label: '規格編號',
    i18nLabel: 'specification-no',
    table: {
      minWidth: 160,
      sortable: false
    },
    formTable: {
      minWidth: 160,
      sortable: false
    },
    form: {
      i18nModule: 'fund_common',
      type: 'select',
      options: [],
      default: null,
      multiple: true,
      remote: true,
      required: true
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  specName: {
    label: '規格名稱',
    i18nLabel: 'specification-name',
    table: {
      minWidth: 160,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  specContent: {
    label: '規格內容',
    i18nLabel: 'specification-content',
    table: {
      minWidth: 160,
      sortable: false
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
