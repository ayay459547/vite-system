export const restrictionColumnSetting = {
  restrictionType: {
    label: '條件',
    i18nLabel: 'column-name',
    required: true,
    table: {},
    form: {
      type: 'select',
      default: '',
      validate: [],
      hiddenErrorMessage: true,
      hiddenLabel: true
    }
  },
  matchingTypeValue: {
    label: '條件',
    i18nLabel: 'select-condition',
    required: true,
    table: {},
    form: {
      type: 'select',
      default: '',
      validate: [],
      hiddenErrorMessage: true,
      hiddenLabel: true
    }
  },
  valueInArray: {
    label: '比對值',
    i18nLabel: 'select-condition-value',
    required: true,
    table: {},
    form: {
      default: '',
      validate: [],
      hiddenErrorMessage: true,
      hiddenLabel: true
    }
  }
}
