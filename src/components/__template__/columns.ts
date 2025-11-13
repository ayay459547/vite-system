export const exampleColumnSetting = {
  machineId: {
    label: '機台編號',
    i18nLabel: 'machine-no',
    table: {
      minWidth: 200,
      sortable: false
    },
    form: {
      i18nModule: 'system',
      type: 'select',
      default: null,
      filterable: true,
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
  // 選擇範例
  waitProduceSettingType: {
    label: '最低待製鎖定單位',
    i18nLabel: 'waitProduce-settingtype',
    table: {
      width: 250,
      sortable: false
    },
    form: {
      i18nModule: 'system',
      type: 'radio',
      default: 1,
      options: [
        { i18nLabel: 'lot-size', label: '批數', value: 1 },
        { i18nLabel: 'time-min', label: '時間(分)', value: 0 }
      ],
      required: true,
      isCondition: true
    },
    filter: {
      width: 250,
      type: 'select',
      isValidate: false,
      default: '',
      options: [
        { i18nLabel: 'all', label: '全部', value: '' },
        { i18nLabel: 'lot-size', label: '批數', value: '1' },
        { i18nLabel: 'time-min', label: '時間(分)', value: '0' }
      ],
      isCondition: true
    },
    getValue(data: number): string {
      switch (data) {
        case 1: return '批數'
        case 0: return '時間(分)'
        default: return ''
      }
    },
    getI18nValue(data: number): string {
      switch (data) {
        case 1: return 'lot-size'
        case 0: return 'time-min'
        default: return ''
      }
    }
  },
  // 數字範例
  minWaitingProduceUnit: {
    label: '最低待製鎖定數值',
    i18nLabel: 'waitProduce-minUnit',
    table: {
      minWidth: 250,
      sortable: false,
      align: 'right'
    },
    form: {
      type: 'number',
      i18nModule: 'system',
      default: null,
      validate: ['number'],
      required: true,
      isCondition: true
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null
    }
  },
  // 布林範例
  isEnable: {
    label: '狀態',
    i18nLabel: 'enabled-status',
    table: {
      minWidth: 250,
      sortable: false,
      align: 'center'
    },
    form: {
      i18nModule: 'system',
      type: 'radio',
      default: true,
      options: [
        { i18nLabel: 'enabled-status-true', label: '已啟用', value: true },
        { i18nLabel: 'enabled-status-false', label: '不啟用', value: false }
      ],
      required: true
    },
    filter: {
      width: 250,
      type: 'select',
      isValidate: false,
      default: '',
      options: [
        { i18nLabel: 'all', label: '全部', value: '' },
        { i18nLabel: 'enabled-status-true', label: '已啟用', value: 'true' },
        { i18nLabel: 'enabled-status-false', label: '不啟用', value: 'false' }
      ],
      isCondition: true
    },
    getValue(data?: boolean) {
      if (typeof data === 'boolean') return data ? '已啟用' : '不啟用'
      return ''
    },
    getI18nValue(data?: boolean) {
      if (typeof data === 'boolean') return data ? 'enabled-status-true' : 'enabled-status-false'
      return ''
    }
  },
  // 日期範例
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
