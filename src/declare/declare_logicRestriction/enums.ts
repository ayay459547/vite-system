// dynamicColumns.ts
export enum MaintainRestrictionType {
  MachineMergeConstraint = 'machineMergeConstraint',
  MachineCategoryMergeConstraint = 'machineCategoryMergeConstraint',

  MachineProcessChangeLine = 'machineProcessChangeLine',

  MachineProcessProductionConstraint = 'machineProcessProductionConstraint',

  RouteClassifySettingConstraint = 'routeClassifySettingConstraint',

  OneStopProducingConstraint = 'oneStopProducingConstraint',

  OrderRelaySetting = 'orderRelaySetting',
}

// scheduleBlock.ts
export enum ScheduleBlockType {
  Machine = 'machine',
  MergeMO = 'mergeMO',
  Process = 'process',
  OrderRelay = 'orderRelay'
}
