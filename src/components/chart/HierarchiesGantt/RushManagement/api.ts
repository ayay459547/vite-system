import type { Api, ApiRes, ViewParams } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import type { Options } from '@/components' // 系統組件
import { getOrderKey } from '@/lib/lib_gantt'

export interface RushOrder {
  erpNo: string
  machine_Id: string
  sequence: string
  process_Id: string
  LAST_UPDATE_TIMESTAMP: string
  updateBy: string
  cust_id: string
  route_Id: string
  route_orderIndex: number
  expectStartTime: string
}

export interface RushOrderItem {
  orderKey: string
  machineId: string
  processId: string
  orderIds: string
  sequence: string

}

// export const getMachineRushOrders = async (machineId:string): Promise<ApiRes<RushOrderItem[]>> => {
//   const resData = await ajax<Api<RushOrder[]>>(
//     {
//       url: '/api/ipaspTable/retrieveIpaspTableFromView',
//       method: 'post',
//       data: {
//         machine_Id: machineId,
//         sortingMap: {
//           machine_Id: 'Asc',
//           sequence: 'Asc'
//         },
//         webfuno: 'auto_114',
//         designatedview: 'iPASPWebView_auto_114_machine_setting'
//       }
//     },
//     {
//       isFakeData: false,
//       fakeData: {
//         data: [],
//         status: 'success'
//       },
//       delay: 300
//     }
//   )

//   const { data, status, msg } = resData

//   const formateRushOrderItem = (data:RushOrder[]) : RushOrderItem[] => {
//     return data.map((order:RushOrder) => {
//       return {
//         type: 'old',
//         machineId: order.machine_Id,
//         processId: order.process_Id,
//         orderIds: order.erpNo,
//         sequence: order.sequence,
//         routeId: order.route_Id,
//         moiIndex: order.route_orderIndex

//       }
//     })
//   }

//   if (['success', true].includes(status)) {
//     return { status: 'success', data: formateRushOrderItem(data), msg }
//   } else {
//     return { status: 'error', data: [], msg }
//   }
// }

export const getRushOrders = async (): Promise<ApiRes<RushOrderItem[]>> => {
  const resData = await ajax<Api<RushOrder[]>>(
    {
      url: '/api/ipaspTable/retrieveIpaspTableFromView',
      method: 'post',
      data: {
        sortingMap: {
          machine_Id: 'Asc',
          sequence: 'Asc'
        },
        webfuno: 'auto_114',
        designatedview: 'iPASPWebView_auto_114_machine_setting'
      }
    },
    {
      isFakeData: false,
      fakeData: {
        data: [],
        status: 'success'
      },
      delay: 300
    }
  )

  const { data, status, msg } = resData

  const formateRushOrderItem = (data:RushOrder[]) : RushOrderItem[] => {
    return data.map((order:RushOrder) => {
      const orderItem = {
        type: 'old',
        machineId: order.machine_Id,
        processId: order.process_Id,
        orderIds: order.erpNo,
        sequence: order.sequence,
        routeId: order.route_Id,
        routeOrderIndex: order.route_orderIndex,
        moiIndex: order.route_orderIndex,
        expectStartTime: order.expectStartTime ?? null,
        orderKey: null
      }
      orderItem.orderKey = getOrderKey(orderItem)
      return orderItem
    })
  }

  if (['success', true].includes(status)) {
    return { status: 'success', data: formateRushOrderItem(data), msg }
  } else {
    return { status: 'error', data: [], msg }
  }
}



// /**
//  * 取得製程列表
//  * @param {String} machineId 機台
//  * @param {String} processId 製程
//  * @param {String} lotNo 訂單
//  * @returns {Array} options
//  */
// export const getProcessList = async (
//   machineId: string,
//   processId: string,
//   lotNo: string,
//   disabledList: string[]
// ): Promise<ApiRes<Options>> => {
//   const resData = await ajax<Api<string[]>>(
//     {
//       url: '/api/insertRushOrder/getRushOrderRelatedProcessListByFilter',
//       method: 'post',
//       data: {
//         machineId,
//         processId,
//         lotNo,
//         size: 30
//       }
//     },
//     {
//       isFakeData: false,
//       fakeData: {
//         data: ['T100', 'Q100', 'E300'],
//         status: 'success'
//       },
//       delay: 300
//     }
//   )

//   const { data, status, msg } = resData
//   if (['success', true].includes(status)) {
//     return {
//       status: 'success',
//       data: data.map(processId => {
//         return {
//           label: processId,
//           value: processId,
//           disabled: disabledList.includes(`${processId}_${lotNo}`)
//         }
//       }),
//       msg
//     }
//   } else {
//     return { status: 'error', data: [], msg }
//   }
// }

// /**
//  * 取得訂單列表
//  * @param {String} processId 製程
//  * @param {String} lotNo 訂單
//  * @returns {Array} options
//  */
// export const getErpNoList = async (
//   processId: string,
//   lotNo: string,
//   disabledList: string[]
// ): Promise<ApiRes<Options>> => {
//   const resData = await ajax<Api<string[]>>(
//     {
//       url: '/api/insertRushOrder/getRushOrderListByFilter',
//       method: 'post',
//       data: {
//         processId,
//         lotNo,
//         size: 30
//       }
//     },
//     {
//       isFakeData: false,
//       fakeData: {
//         data: ['PF0712401021', 'PF2772311001', 'PF2772312001'],
//         status: 'success'
//       },
//       delay: 300
//     }
//   )

//   const { data, status, msg } = resData

//   if (['success', true].includes(status)) {
//     return {
//       status: 'success',
//       data: data.map(lotNo => {
//         return {
//           label: lotNo,
//           value: lotNo,
//           disabled: disabledList.includes(`${processId}_${lotNo}`)
//         }
//       }),
//       msg
//     }
//   } else {
//     return { status: 'error', data: [], msg }
//   }
// }

// /**
//  * 取得機台列表 (機台對應製程)
//  * @param {String} processId 製程
//  * @param {String} machineId 機台
//  * @param {Array} selectedMachineList 已選擇的機台
//  * @returns {Array} options
//  */
// export const getMachineList = async (
//   processId: string,
//   machineId: string,
//   selectedMachineList?: string[]
// ): Promise<ApiRes<Options>> => {
//   const resData = await ajax<Api<string[]>>(
//     {
//       url: '/ma/machine/getCanBeAssigndMachineList',
//       method: 'post',
//       data: {
//         processId,
//         machineId,
//         /**
//          * 0: 不是 Dummy 機台
//          * 1: 是 Dummy 機台
//          * 無: 都有
//          */
//         isDummy: 0,
//         size: 30
//       }
//     },
//     {
//       isFakeData: false,
//       fakeData: {
//         data: [],
//         status: 'success'
//       },
//       delay: 300
//     }
//   )

//   const { data, status, msg } = resData

//   if (['success', true].includes(status)) {
//     return {
//       status: 'success',
//       data: data.map(machineId => {
//         const isDisabled = Array.isArray(selectedMachineList)
//           ? selectedMachineList.includes(machineId)
//           : false

//         return {
//           label: machineId,
//           value: machineId,
//           disabled: isDisabled
//         }
//       }),
//       msg
//     }
//   } else {
//     return { status: 'error', data: [], msg }
//   }
// }

// export interface Params extends ViewParams {
//   erpNo?: string
//   machine_Id?: string
//   sequence?: string
//   process_Id?: string
//   LAST_UPDATE_TIMESTAMP?: string
//   updateBy?: string
//   cust_id?: string
// }

// export interface RushOrder {
//   erpNo: string
//   machine_Id: string
//   sequence: string
//   process_Id: string
//   LAST_UPDATE_TIMESTAMP: string
//   updateBy: string
//   cust_id: string
// }

// /**
//  * 取得插單列表
//  * @param machine 機台
//  * @param lotNo 訂單
//  * @returns {Array} 機台下插單列表
//  */
// export const getRushOrderList = async (
//   machine: string,
//   lotNo?: ''
// ): Promise<ApiRes<RushOrder[]>> => {
//   const resData = await ajax<Api<RushOrder[]>>(
//     {
//       url: '/api/ipaspTable/retrieveIpaspTableFromView',
//       method: 'post',
//       data: {
//         erpNo: lotNo,
//         machine_Id: machine,
//         // sequence: '',
//         // process_Id: '',
//         // LAST_UPDATE_TIMESTAMP: '',
//         // updateBy: '',
//         // cust_id: '',
//         sortingMap: {
//           machine_Id: 'Asc',
//           sequence: 'Asc'
//         },
//         webfuno: 'auto_114',
//         designatedview: 'iPASPWebView_auto_114_machine_setting'
//       } as Params
//     },
//     {
//       isFakeData: false,
//       fakeData: {
//         data: [],
//         status: 'success'
//       },
//       delay: 300
//     }
//   )

//   const { data, status, msg } = resData

//   if (['success', true].includes(status)) {
//     return { status: 'success', data, msg }
//   } else {
//     return { status: 'error', data: [], msg }
//   }
// }

export type RushOrders = Array<{
  sequence: number
  erpNo: string
  orderIds?: string
  // custId?: string
  processId: string
  memo?: string
  // updateBy: string
}>
export type RushOrderData = Array<{
  machineId: string
  rushOrders: RushOrders
  // updateBy: string
}>

/**
 * 網頁插單
 * @param {Array} rushOrderData 插單資料
 * @returns {String} success | error
 */
export const rushOrderFromWeb = async (rushOrderData: any /*RushOrderData*/): Promise<ApiRes> => {
  // console.log('reportData => ', rushOrderData)
  const formatRushOrderData = rushOrderData => {
    // const cloneData = deepClone([], rushOrderData)
    return rushOrderData.map(machineItem => {
        return {
          machineId: machineItem.machineId,
          rushOrders: machineItem.rushOrders.
          filter(rushOrder => rushOrder.type !== 'remove').
          map((rushOrder, index) => {
            return {
              sequence: index + 1,
              erpNo: rushOrder.orderIds,
              processId: rushOrder.processId,
              memo: '',
              updateBy: 'aat'
            }
          })
        }

    })

  }


  // console.log(formatRushOrderData(rushOrderData))

  const resData = await ajax<Api<any>>(
    {
      // url: '/api/insertRushOrder/importByExcelPreview',
      url: '/api/insertRushOrder/saveRushOrderSettings',
      method: 'post',
      data: formatRushOrderData(rushOrderData)
    },
    {
      isFakeData: false,
      // isFakeData: false,
      fakeData: {
        data: null,
        status: 'success'
      },
      delay: 300
    }
  )

  const { status, msg = '請聯絡資訊人員' } = resData

  if (['success', true].includes(status)) {
    return { status: 'success', msg }
  } else {
    return { status: 'error', msg }
  }
}


/**
 * 網頁插單
 * @param {Array} rushOrderData 插單資料
 * @returns {String} success | error
 */


export const updateRushOrder = async (rushOrderData: any, userName: string /*RushOrderData*/): Promise<ApiRes> => {
  // console.log('reportData => ', rushOrderData)
  const updateBy = userName
  const formatRushOrderData = rushOrderData => {
    // const cloneData = deepClone([], rushOrderData)
    const rushOrders = rushOrderData.flatMap(machineItem => {
      const machineRushOrders = machineItem.rushOrders.reduce((rushOrdersSetting, order) => {
        const {
          type,
          orderIds,
          machineId,
          processId,
          expectStartTimeString
        } = order
        const { orders, nextSequence } = rushOrdersSetting

        switch (type) {
          // 目標: 機台原本就已設定的插單，
          // 效果: 更改expectStartTime或sequence
          case 'old': {
            orders.push({
              erpNo: orderIds,
              processId,
              fromMachine: machineId,
              toMachine: machineId,
              expectStartTime: expectStartTimeString,
              sequence: nextSequence,
              updateBy
            })
            return { orders, nextSequence: nextSequence + 1 }
          }
          // 目標: 機台原本就已設定的插單，且工單沒有再插單給其他機台
          // 效果: 移除機台上的插單設定
          case 'remove': {
            orders.push({
              erpNo: orderIds,
              processId,
              fromMachine: machineId,
              // toMachine 不輸入toMachine視為刪除
              updateBy
            })
            return { orders, nextSequence }
          }
          // 目標: 機台原本沒設定的插單，無論工單原本有沒有插單給其他機台
          // 效果: 新增機台的插單設定
          case 'new': {
            orders.push({
              erpNo: orderIds,
              processId,
              fromMachine: order?.data.machineId, //工單原本在排程中被分配(或被插單)的機台
              toMachine: machineId,
              expectStartTime: expectStartTimeString,
              sequence: nextSequence,
              updateBy
            })
            return { orders, nextSequence: nextSequence + 1 }
          }
        }

        return rushOrdersSetting
      },
      {
        orders: [],
        nextSequence: 1
      }) //.filter(order => order.type !== 'old')

      return machineRushOrders.orders
    })

    return rushOrders

    // return rushOrderData.map(machineItem => {
    //     return {
    //       machineId: machineItem.machineId,
    //       rushOrders: machineItem.rushOrders.map((rushOrder, index) => {
    //         return {
    //           sequence: index + 1,
    //           erpNo: rushOrder.orderIds,
    //           processId: rushOrder.processId,
    //           memo: '',
    //           updateBy: 'aat'
    //         }
    //       })
    //     }

    // })

  }

  // console.log(formatRushOrderData(rushOrderData))

  console.log(formatRushOrderData(rushOrderData)  )
  const resData = await ajax<Api<any>>(
    {
      // url: '/api/insertRushOrder/importByExcelPreview',
      url: '/api/insertRushOrder/updateRushOrderSettings',
      method: 'post',
      data: formatRushOrderData(rushOrderData)
    },
    {
      // isFakeData: true,
      isFakeData: false,
      fakeData: {
        data: null,
        status: 'success'
      },
      delay: 300
    }
  )
  const { status, msg = '請聯絡資訊人員' } = resData

  if (['success', true].includes(status)) {
    return { status: 'success', msg }
  } else {
    return { status: 'error', msg }
  }
}


export type ProcessOrder = {
  processId: string,
  orderId: string
}
export type RushableMachine = {
  machineId: string,
}
export type ProcessOrderRushableMachine = {
  processId: string,
  orderId: string
  machines: Array<RushableMachine>
}

export const getRushableMachine = async (orders: Array<ProcessOrder>) : Promise<any> => {
  const resData = await ajax<Api<any>>(
    {
      url: '/api/insertRushOrder/getRushOrdersListByFilter',
      method: 'post',
      data: orders //formatRushOrderData(rushOrderData)
    },
    {
      isFakeData: true,
      // isFakeData: false,
      fakeData: {
        data: null,
        status: 'success'
      },
      delay: 300
    }
  )

  const { status, data } = resData

  if (['success', true].includes(status)) {
    return data
  } else {
    return []
  }

}