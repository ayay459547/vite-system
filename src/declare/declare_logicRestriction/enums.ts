// dynamicColumns.ts
export enum MaintainRestrictionType {
  // 機台合併條件限制管理 fund-1419
  // MergeConstraint = 'mergeConstraint',
  MachineMergeConstraint = 'machineMergeConstraint',
  MachineCategoryMergeConstraint = 'machineCategoryMergeConstraint',

  // 機台換線資訊 fund-1422
  MachineProcessChangeLine = 'machineProcessChangeLine',
  // MaintainMachineProcessChangeLine // 舊版本

  // 機台生產限制管理 fund-1435
  MachineProcessProductionConstraint = 'machineProcessProductionConstraint',
  // MaintainMachineProcessProductionConstraint // 舊版本

  // 途程型態分類管理 fund-1434
  RouteClassifySettingConstraint = 'routeClassifySettingConstraint',

  // 一貫機連續生產規則管理 fund-1427
  OneStopProducingConstraint = 'oneStopProducingConstraint',

  // 併批製程識別管理 fund-1431
  OrderRelaySetting = 'orderRelaySetting',
}

// scheduleBlock.ts
export enum ScheduleBlockType {
  // 機台工單排程順序管理 fund-1426
  Machine = 'machine',
  // 合併工單排程順序管理 fund-1442
  MergeMO = 'mergeMO',
  // 站點工單排程順序管理 fund-1441
  Process = 'process',
  // 併批工單排程順序管理 fund-1429
  OrderRelay = 'orderRelay'
}
