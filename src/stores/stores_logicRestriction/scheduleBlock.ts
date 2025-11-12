/**
 * 區塊排序
 *
 * 整合四個功能的code
 * 機台工單排程順序管理 fund-1426
 * 合併工單排程順序管理 fund-1442
 * 站點工單排程順序管理 fund-1441
 * 併批工單排程順序管理 fund-1429
 */
import { defineStore } from 'pinia'
// import { ref, shallowRef } from 'vue'

// 機台工單排程順序管理 fund-1426
export const useMachine = defineStore('scheduleBlock_Machine', () => {
  /**
   * tab
   * /demo-rest/scheduleBlock/getAllSettingMode
   *
   * 可設定的區塊
   * /demo-rest/scheduleBlock/getAllBlockTypes
   *
   * 區塊可用選項
   * /demo-rest/scheduleBlock/getSupportedSortingSettings
   */

  return {}
})

// 合併工單排程順序管理 fund-1442
export const useMergeMO = defineStore('scheduleBlock_MergeMO', () => {
  /**
   * tab
   * /demo-rest/mergeMO/scheduleBlock/getAllSettingMode
   *
   * 可設定的區塊
   * /demo-rest/mergeMO/scheduleBlock/getAllBlockTypes
   *
   * 區塊可用選項
   * /demo-rest/mergeMO/scheduleBlock/getSupportedSortingSettings
   */

  return {}
})

// 站點工單排程順序管理 fund-1441
export const useProcess = defineStore('scheduleBlock_Process', () => {
  /**
   * tab
   * /demo-rest/process/scheduleBlock/getAllSettingMode
   *
   * 可設定的區塊
   * /demo-rest/process/scheduleBlock/getAllBlockTypes
   *
   * 區塊可用選項
   * /demo-rest/process/scheduleBlock/getSupportedSortingSettings
   */

  return {}
})

// 併批工單排程順序管理 fund-1429
export const useOrderRelay =  defineStore('scheduleBlock_OrderRelay', () => {
  /**
   * tab
   * /demo-rest/orderRelay/scheduleBlock/getAllSettingMode
   *
   * 可設定的區塊
   * /demo-rest/orderRelay/scheduleBlock/getAllBlockTypes
   *
   * 區塊可用選項
   * /demo-rest/orderRelay/scheduleBlock/getSupportedSortingSettings
   */

  return {}
})

