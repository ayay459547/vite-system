import { SQLDataTypeOptions } from '@/declare/declare_dataType'

export const columnSetting = {
  id: {
    label: '規格類型編號',
    i18nLabel: 'specification-type-no',
    table: {
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
    label: '規格類型名稱',
    i18nLabel: 'specification-type-name',
    table: {
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
  dataType: {
    label: '規格內容資料類型',
    i18nLabel: 'specification-content-data-type',
    table: {
      minWidth: 160,
      sortable: false,
      required: true
    },
    form: {
      i18nModule: 'system',
      type: 'select',
      options: SQLDataTypeOptions,
      default: 'STRING',
      required: true
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  }
}

// 跳轉設定
export const linkSetting: Record<string, any> = {}
