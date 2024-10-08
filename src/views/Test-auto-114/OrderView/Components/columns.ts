export const workReportColumnSetting = {
  sequence: {
    label: '生產順序',
    i18nLabel: 'production-sequence',
    table: {
      width: 100,
      align: 'center'
    }
  },
  process_Id: {
    label: '站點編號',
    i18nLabel: 'process-no',
    table: {
      minWidth: 180,
      required: true
    },
    form: {
      type: 'select',
      default: null,
      validate: [],
      options: [],
      remote: true,
      remoteShowSuffix: true,
      filterable: true,
      remoteMethod: () => {},
      hiddenLabel: true,
      required: true
    }
  },
  erpNo: {
    label: '插單單號',
    i18nLabel: 'rushOrder-no',
    table: {
      minWidth: 180,
      required: false
    }
  },
  LAST_UPDATE_TIMESTAMP: {
    label: '最後更新時間',
    i18nLabel: 'last-updateTime',
    table: {
      minWidth: 180
    },
    form: {
      default: null,
      validate: [],
      hiddenLabel: true,
      required: true
    }
  },
  updateBy: {
    label: '最後更新者',
    i18nLabel: 'lastUpdated-by',
    table: {
      minWidth: 180
    },
    form: {
      default: null,
      validate: [],
      hiddenLabel: true,
      required: true
    }
  }
}
