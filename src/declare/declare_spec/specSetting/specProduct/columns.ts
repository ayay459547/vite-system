import { columnSetting as baseColumnSetting } from '../columns'

export const columnSetting = {
  productId: {
    label: '產品編號',
    i18nLabel: 'product-no',
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
  productId: {
    fromPage,
    options: [
      {
        toPage: 'nav1-4'
        // description: '產品基本資訊'
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
        toPage: 'nav1-2'
        // description: '全廠共通規格管理'
      }
    ]
  }
}
