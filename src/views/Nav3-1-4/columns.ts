export const columnSetting = {
  customerName: {
    label: '客戶名稱',
    i18nLabel: 'customer-name',
    table: {
      width: 150,
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
    i18nLabel: 'product-no',
    table: {
      width: 150,
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
      width: 150,
      fixed: 'left',
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  }
  // deliveryDate: {
  //   label: '達交日期',
  //   i18nLabel: 'delivery-date',
  //   table: {
  //     width: 160,
  //     // minWidth: 160,
  //     // fixed: 'right',
  //     sortable: false
  //   },
  //   filter: {
  //     width: 250,
  //     isValidate: false,
  //     default: null,
  //     isCondition: true
  //   }
  // },
  // quantity: {
  //   label: '達交數量',
  //   i18nLabel: 'delivery-quantity',
  //   table: {
  //     width: 160,
  //     // minWidth: 160,
  //     // fixed: 'right',
  //     sortable: false
  //   },
  //   filter: {
  //     width: 250,
  //     isValidate: false,
  //     default: null,
  //     isCondition: true
  //   }
  // }
}