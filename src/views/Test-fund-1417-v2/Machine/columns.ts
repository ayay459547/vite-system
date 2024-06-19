export const columnSetting = {
  machineId: {
    label: '機台編號',
    i18nLabel: 'machine-id',
    form: {
      i18nModule: 'fund_common',
      // type: 'select',
      type: 'select-v2',
      required: true,
      default: '',
      multiple: true,
      maxCollapseTags: 10,
      hiddenLabel: true,
      filterable: true,
      options: []
    }
  }
}
