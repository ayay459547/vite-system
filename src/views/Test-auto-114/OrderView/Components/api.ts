export type ResValidate = {
  // 上傳資料
  machineId: string
  rushOrders: RushOrders
  updateBy: string
  // 驗證用
  status: string
  errorEl: Element | null
}
