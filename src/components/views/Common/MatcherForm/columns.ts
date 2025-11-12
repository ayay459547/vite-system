export const columnSetting = {
  // RouteClassifySettingConstraint 使用
  matchingMode: {
    label: '匹配模式',
    i18nLabel: 'matching-mode',
    form: {
      i18nModule: 'fund_common',
      type: 'select',
      default: 'singleTarget',
      required: true,
      options: [
        { i18nLabel: 'routing-singleTarget', label: '途程包含指定站點', value: 'singleTarget' },
        { i18nLabel: 'routing-continueObject', label: '途程內一段站點滿足同一條件', value: 'continueObject' }
      ]
    }
  }
}
