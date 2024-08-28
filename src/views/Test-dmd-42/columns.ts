export const columnSetting = {
  customerName: {
    label: '客戶名稱',
    i18nLabel: 'customer-name',
    table: {
      width: 120,
      fixed: 'left',
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  productId: {
    label: '產品型號',
    i18nLabel: 'product-id',
    table: {
      width: 120,
      fixed: 'left',
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  deliveryType: {
    label: '達交類型',
    i18nLabel: 'delivery-type',
    table: {
      width: 120,
      fixed: 'left',
      sortable: false
    },
    filter: {
      width: 250,
      type: 'select',
      options: [
        { label: '庫存出貨', value: 'inventory' },
        { label: '生產出貨', value: 'manufacture' },
        { label: '已出貨', value: 'delivered' },
        { label: '未排產', value: 'null' }
      ],
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  deliveryDate: {
    label: '達交日期',
    i18nLabel: 'delivery-date',
    // table: {
    //   width: 120,
    //   sortable: false
    // },
    filter: {
      width: 250,
      type: 'month',
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  quantity: {
    label: '達交數量',
    i18nLabel: 'delivery-quantity'
    // table: {
    //   width: 120,
    //   sortable: false
    // },
    // filter: {
    //   width: 250,
    //   isValidate: false,
    //   default: null,
    //   isCondition: true
    // }
  }
}