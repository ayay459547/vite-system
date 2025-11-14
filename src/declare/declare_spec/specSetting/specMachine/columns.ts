import { columnSetting as baseColumnSetting } from '../columns'

export const columnSetting = {
  machineId: {
    label: '機台編號',
    i18nLabel: 'machine-no',
    table: {
      minWidth: 160,
      sortable: false
    },
    formTable: {
      minWidth: 160,
      sortable: false
    },
    form: {
      i18nModule: 'system',
      default: '',
      type: 'select',
      options: [],
      filterable: true,
      remote: true,
      multiple: true,
      required: true
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  ...baseColumnSetting
}

// 跳轉設定
const fromPage = 'nav1-1'
export const linkSetting: Record<string, any> = {
  machineId: {
    fromPage,
    options: [
      {
        toPage: 'nav1-2'
        // description: '機台基本資訊'
      }
    ]
  },
  specTypeId: {
    fromPage,
    options: [
      {
        toPage: 'nav1-3'
        // description: '規格類型管理'
      }
    ]
  },
  specId: {
    fromPage,
    options: [
      {
        toPage: 'nav1-4'
        // description: '全廠共通規格管理'
      }
    ]
  }
}
