import { hasOwnProperty } from '@/lib/lib_utils'
import { getMilliseconds } from '@/lib/lib_day'

import type { TableData } from '../api'

export type GroupCallback = (
  rowData: TableData,
  typeIndex: number,
  groupData: Record<string, any>,
  ganttData: any[],
  filter: string[]
) => boolean

export type GroupCallbackMap = {
  workOrder: GroupCallback
  process: GroupCallback
  machine: GroupCallback
}

export const groupKeyword = {
  order: 'orderIds',
  workOrder: 'orderIds',
  process: 'processId',
  machine: 'machineId'
}

export const groupCallbackMap: GroupCallbackMap = {
  workOrder(rowData, typeIndex, groupData, ganttData, filter) {
    const _keyword = groupKeyword['workOrder']

    let isTypeIndexAdd = false

    if (filter.length > 0 && !filter.includes(rowData[_keyword])) return

    if (!hasOwnProperty(groupData, rowData[_keyword])) {
      // 分組資料
      groupData[rowData[_keyword]] = {
        id: rowData[_keyword],
        name: rowData.machineName,
        index: typeIndex,
        dataList: []
      }
      // 甘特圖類型(y軸)
      ganttData.push({
        type: rowData[_keyword],
        index: typeIndex,
        list: []
      })

      isTypeIndexAdd = true
    }
    if (![null, undefined].includes(rowData[_keyword])) {
      // 分組資料
      groupData[rowData[_keyword]].dataList.push({
        ...rowData
      })

      // 甘特圖顯示資料(x軸)
      const [_startDate, _startTime] = rowData.startDate.split(' ')
      const [_endDate, _endTime] = rowData.endDate.split(' ')

      const start = getMilliseconds(_startDate, _startTime)
      const end = getMilliseconds(_endDate, _endTime)
      // moid 對使用者無意義
      // const title = rowData.moiId + '_' + rowData.moiIndex
      const title = rowData.orderIds + '_' + rowData.moiIndex

      const tempIndex = groupData[rowData[_keyword]].index
      ganttData[tempIndex].list.push([start, end, title, rowData])
    }

    return isTypeIndexAdd
  },
  process(rowData, typeIndex, groupData, ganttData, filter) {
    const _keyword = groupKeyword['process']

    let isTypeIndexAdd = false

    if (filter.length > 0 && !filter.includes(rowData[_keyword])) return

    if (!hasOwnProperty(groupData, rowData[_keyword])) {
      // 分組資料
      groupData[rowData[_keyword]] = {
        id: rowData[_keyword],
        name: rowData.machineName,
        index: typeIndex,
        dataList: []
      }
      // 甘特圖類型(y軸)
      ganttData.push({
        type: rowData[_keyword],
        index: typeIndex,
        list: []
      })

      isTypeIndexAdd = true
    }
    if (![null, undefined].includes(rowData[_keyword])) {
      // 分組資料
      groupData[rowData[_keyword]].dataList.push({
        ...rowData
      })

      // 甘特圖顯示資料(x軸)
      const [_startDate, _startTime] = rowData.startDate.split(' ')
      const [_endDate, _endTime] = rowData.endDate.split(' ')

      const start = getMilliseconds(_startDate, _startTime)
      const end = getMilliseconds(_endDate, _endTime)
      // moid 對使用者無意義
      // const title = rowData.moiId + '_' + rowData.moiIndex
      const title = rowData.orderIds + '_' + rowData.moiIndex

      const tempIndex = groupData[rowData[_keyword]].index
      ganttData[tempIndex].list.push([start, end, title, rowData])
    }

    return isTypeIndexAdd
  },
  machine(rowData, typeIndex, groupData, ganttData, filter) {
    const _keyword = groupKeyword['machine']

    let isTypeIndexAdd = false

    if (filter.length > 0 && !filter.includes(rowData[_keyword])) return

    if (!hasOwnProperty(groupData, rowData[_keyword])) {
      // 分組資料
      groupData[rowData[_keyword]] = {
        id: rowData[_keyword],
        name: rowData.machineName,
        index: typeIndex,
        dataList: []
      }
      // 甘特圖類型(y軸)
      ganttData.push({
        type: rowData[_keyword],
        index: typeIndex,
        list: []
      })

      isTypeIndexAdd = true
    }
    if (![null, undefined].includes(rowData[_keyword])) {
      // 分組資料
      groupData[rowData[_keyword]].dataList.push({
        ...rowData
      })

      // 甘特圖顯示資料(x軸)
      const [_startDate, _startTime] = rowData.startDate.split(' ')
      const [_endDate, _endTime] = rowData.endDate.split(' ')

      const start = getMilliseconds(_startDate, _startTime)
      const end = getMilliseconds(_endDate, _endTime)
      // moid 對使用者無意義
      // const title = rowData.moiId + '_' + rowData.moiIndex
      const title = rowData.orderIds + '_' + rowData.moiIndex

      const tempIndex = groupData[rowData[_keyword]].index
      ganttData[tempIndex].list.push([start, end, title, rowData])
    }

    return isTypeIndexAdd
  }
}

// 滑鼠移入顯示設定
export type TooltipCallback = (
  value: any,
  start: string,
  end: string,
  title: String,
  i18nTranslate?: Function
) => string
//export type TooltipCallback = (value: any, start: string, end: string, title: String) => string

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const defaultTooltipCallback: TooltipCallback = function (
  value,
  start,
  end,
  title,
  i18nTranslate
) {
  const getStatus = status => {
    switch (status) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 999:
        return i18nTranslate('gantt-state' + status)
      default:
        return 'undefined'
    }
  }
  const texts = [
    i18nTranslate('datetime-startTime') + ' : ' + value.startDate, //'開始時間' + ' : ' + value.startDate
    i18nTranslate('datetime-endTime') + ' : ' + value.endDate, //'結束時間' + ' : ' + value.endDate
    i18nTranslate('machine-no') + ' : ' + value.machineId, //'機台編號' + ' : ' + value.machineId
    i18nTranslate('process-no') + ' : ' + value.processId, //'製程編號' + ' : ' + value.processId
    i18nTranslate('status') + ' : ' + getStatus(value.status) //'狀態' + ' : ' + tempStatus
  ]

  const orderIds = value.orderIds
  const codeTexts = texts.map(text => `<div>${text}</div>`).join('')

  return `
    <div 
      class="gantt-tooltip" 
      style="display: flex; flex-direction: column; gap: 8px;"
    >
      <div style="font-size: 1.2em;">${orderIds}</div>
      ${codeTexts}
    </div>
  `

  // // const orderIds = '訂單編號' + ' : ' + value.orderIds
  // const textStartDate = '開始時間' + ' : ' + value.startDate
  // const textEndDate = '結束時間' + ' : ' + value.endDate
  // const textMachineId = '機台編號' + ' : ' + value.machineId
  // const textProcessId = '製程編號' + ' : ' + value.processId
  // // const mo = '系統單號' + ' : ' + title

  // let tempStatus = ''
  // switch (value.status) {
  //   case 0:
  //     tempStatus = '未開工'
  //     break
  //   case 1:
  //     tempStatus = '已結清'
  //     break
  //   case 2:
  //     tempStatus = '已完工'
  //     break
  //   case 3:
  //     tempStatus = '生產中'
  //     break
  //   case 4:
  //     tempStatus = '已發放'
  //     break
  //   case 5:
  //     tempStatus = '未發放'
  //     break
  //   case 6:
  //     tempStatus = '暫緩'
  //     break
  //   case 999:
  //     tempStatus = '結案'
  //     break
  // }
  // const textStatus = '狀態' + ' : ' + tempStatus
  // // const text7 = '狀態 : ' + value.status
  // return `
  //   <div
  //     class="gantt-tooltip"
  //     style="display: flex; flex-direction: column; gap: 8px;"
  //   >
  //     <div style="font-size: 1.2em;">${orderIds}</div>
  //     <div>${textStartDate}</div>
  //     <div>${textEndDate}</div>
  //     <div>${textMachineId}</div>
  //     <div>${textProcessId}</div>
  //     <div>${textStatus}</div>
  //   </div>
  // `
}

// bar 顯示的文字
export type TextCallback = (value: any, title: string) => string
export const defaultTextCallback: TextCallback = function (value, title) {
  return title
}

// 滑鼠移入資料框的偏移量
export type TooltipPositionCallback = (
  x: number,
  y: number
) => {
  x: number
  y: number
}
export const defaultTooltipPositionCallback: TooltipPositionCallback = function (x, y) {
  return {
    x: x > 1000 ? x - 150 : x - 100,
    y: y < 180 ? y + 30 : y - 230
  }
}
