import { columnSetting as baseColumnSetting } from '../columns'

export const columnSetting = {
  orderId: {
    label: '訂單編號',
    i18nLabel: 'order-no',
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
const fromPage = 'fund-205'
export const linkSetting: Record<string, any> = {
  orderId: {
    fromPage,
    options: [
      {
        toPage: 'auto-112'
        // description: '選單資訊',
        // i18nDescription: 'auto-112'
      }
    ]
  },
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
  specId: {
    fromPage,
    options: [
      {
        toPage: 'fund-202'
        // description: '全廠共通規格管理',
        // i18nDescription: 'fund-202'
      }
    ]
  }
}
