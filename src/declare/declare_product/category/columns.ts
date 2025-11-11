export const columnSetting = {
  productCategoryId: {
    label: '產品類別編號',
    i18nLabel: 'product-category-no',
    table: {
      minWidth: 250,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  productCategoryName: {
    label: '產品類別名稱',
    i18nLabel: 'product-category-name',
    table: {
      minWidth: 250,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  }
}
