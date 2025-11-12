// import type { LogicRestriction_type } from '@/types/types_logicRestriction'

export const columnSetting = {
  maintainRestrictionType: {
    // 送到後端使用 不開放給使用者設定
    label: '邏輯類型',
    form: {
      i18nModule: 'fund_common',
      type: 'select',
      required: true,
      default: 'MachineProcessProductionConstraint',
      options: [
        // 製程內機台限制(機限)
        { label: 'MachineProcessProductionConstraint', value: 'MachineProcessProductionConstraint' },
        // 合併限制
        // { label: 'MergeConstraint', value: 'MergeConstraint' },
        { label: 'MachineMergeConstraint', value: 'MachineMergeConstraint' },
        { label: 'MachineCategoryMergeConstraint', value: 'MachineCategoryMergeConstraint' },
        // 機台換線
        { label: 'MachineProcessChangeLine', value: 'MachineProcessChangeLine' },
        // 一貫機
        { label: 'OneStopProducingConstraint', value: 'OneStopProducingConstraint' },
        // 途程限制
        { label: 'RouteClassifySettingConstraint', value: 'RouteClassifySettingConstraint' },
        // 併批製程
        { label: 'OrderRelaySetting', value: 'OrderRelaySetting' }
      ]
    }
  },
  positive: {
    label: '表列方式',
    i18nLabel: 'display-method',
    form: {
      i18nModule: 'fund_common',
      type: 'radio',
      required: true,
      default: true,
      options: [
        { i18nLabel: 'direction-positive', label: '正向', value: true },
        { i18nLabel: 'direction-negative', label: '負向', value: false }
      ]
    }
  },
  combineLogic: {
    label: '條件結合邏輯',
    i18nLabel: 'restriction-combineLogic',
    form: {
      i18nModule: 'fund_common',
      type: 'radio',
      required: true,
      default: 'OR',
      options: [
        { label: 'OR', value: 'OR' },
        { label: 'AND', value: 'AND' }
      ]
    }
  }
}
