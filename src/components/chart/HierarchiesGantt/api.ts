import type { Api, ApiRes, ViewParams } from '@/declare/ajax'
import { ajax } from '@/lib/lib_ajax'
import { swal } from '@/lib/lib_utils'
// import { fakeGanttData } from './fakeData'
import { isEmpty, hasOwnProperty, getUuid } from '@/lib/lib_utils'

export interface Params extends ViewParams {
  moId: string
  moiId: string
  moiIndex: string
  statusStr: string

  productId: string
  productName: string
  processId: string
  processName: string

  machineId: string
  machineName: string

  startDate: string
  endDate: string
}

export type ResponseData = {
  moId: string
  moiId: string
  moiIndex: string
  status: number
  statusStr: string

  productId: string
  productName: string
  processId: string
  processName: string

  machineId: string
  machineName: string

  startDate: string
  endDate: string

  bomVersion: string
  predeinedAmount: number

  orderIds: string
}

export type TableData = {
  moId: string
  moiId: string
  moiIndex: string
  status: number
  statusStr: string

  productId: string
  productName: string
  processId: string
  processName: string

  machineId: string
  machineName: string

  startDate: string
  endDate: string

  bomVersion: string
  predeinedAmount: number

  orderIds: string
}

// table
export const getData = async (params: any): Promise<ApiRes<TableData[]>> => {
  const {
    moId = '',
    moiId = '',
    moiIndex = '',
    status: _status = '',
    productId = '',
    productName = '',
    processId = '',
    processName = '',
    machineId = '',
    machineName = '',
    timeRange = []
  } = params

  const [startDate, endDate] = Array.isArray(timeRange) ? timeRange : ['', '']

  const resData = await ajax<Api<ResponseData[] | TableData[]>>(
    {
      url: '/ganttChart2/getGanttChartByParam',
      method: 'post',
      data: {
        moId,
        moiId,
        moiIndex,
        productId,
        statusStr: _status,
        productName,
        processId,
        processName,
        machineId,
        machineName,

        startDate,
        endDate
      } as Params
    },
    {
      isFakeData: true,
      fakeData: {
        data: [],//fakeGanttData,
        status: 'success'
      },
      delay: 300
    }
  )
  const { data, status, msg } = resData


  if (['success', true].includes(status)) {
    return { status: 'success', data, msg }
  } else {
    return { status: 'error', data: [], msg }
  }
}



export type yItem = {
  name: string
  orderFilters: {

  }
  order: Array<any>
}
export type yItemGroup = {
  name: string
  // color?
  children: []
}

export const createYItemGroup = (orders, groupType:string, itemType) =>  {
  const groups = {}

  orders.forEach(order => {
    const groupName = hasOwnProperty(order, groupType) ?  order[groupType] : null

    if(groupName) {
      if(!hasOwnProperty(groups, groupName)) groups[groupName] = []
      groups[groupName].push(order)
    }
  })

  return Object.entries(groups).map(([name, group]) => {
    const children = createYItems(group, itemType)
    children.forEach(child => {
      child.orderFilters.push(
        {
          type: groupType,
          value: name
        }
      )
    })

    return {
      name,
      type: 'group',
      children,
      isOpen: true
    }
  })



}
const createYItems = (orders, itemType ) => {
  const items = {}
  orders.forEach(order => {
    const itemName = hasOwnProperty(order, itemType) ?  order[itemType] : null

    if(itemName) {
      if(!hasOwnProperty(items, itemName)) items[itemName] = []
      items[itemName].push(order)
    }
  })

  return Object.keys(items).map(name => {
    return {
      name,
      type: 'item',
      isRushable: true,
      orders: items[name],
      orderFilters: [{
        type: itemType,
        value: name
      }]
    }
  })
  // return Object.entries(items).map(([name, item]) => {
  //   return {
  //     name,
  //     orders: [],
  //     orderFilters: [{
  //       type: itemType,
  //       value: name
  //     }]
  //   }
  // })

}

const filterType = [
 'machineId',
 'machineName',
 'processId',
 'processName',
 'productId',
 'productName'
//  'status',
//  'statusStr'
]

export const createFilterColumns = orders => {
  const getLabel = type => {
    switch (type) {
      case 'machineId' : return '機台編號'
      case 'machineName' : return '機台名稱'
      case 'processId' : return '製程編號'
      case 'processName' : return '製程名稱'
      case 'productId' : return '產品編號'
      case 'productName' : return '產品名稱'
    }
  }
  return filterType.map(type => {
    const set = new Set()
    orders.forEach(order => {
      if(hasOwnProperty(order, type)) {
        set.add(order[type])
      }
    })
    const options = Array.from(set).map(option => {
      return {label: option, value: option}
    })

    return {
      type,
      value: '',
      label: getLabel(type),
      options: options
    }
  })
}

export const getOrderByFilter = (orders, filters) => {
  return orders.filter(order => {
    return !filters.some(filter => {
      const target = filter.type
      // if(!hasOwnProperty(order, target )) return true
      if(order[target] !== filter.value) return true
      return false
    })
  })
}


// 抽單
export const removeOrderSelections = async (orders: TableData[]): Promise<string | boolean> => {
  const resData = await ajax<Api<any>>(
    {
      url: '/ParamSetting/removeOrderSelections',
      method: 'delete',
      data: orders.map((item: any) => {
        const { moiId, moiIndex, orderIds /*, OrdItem_indx*/ } = item
        const orderId_index = orderIds + moiIndex

        return {
          combinedNumber: moiId,
          item: {
            pk: {
              id: orderId_index,
              index: moiIndex
            }
          }
        }
      })
    },
    {
      isFakeData: true,
      fakeData: {
        data: null,
        status: 'success'
      },
      delay: 300
    }
  )
  const { status, msg } = resData

  if (status !== 'success') {
    swal({
      icon: 'error',
      title: '抽單失敗',
      text: msg ?? '請聯絡資訊人員',
      showCancelButton: false
    })
  }
  else {
    swal({
      icon: 'success',
      title: '抽單完成',
      showCancelButton: false
    })
  }

  return status
}





export type ProcessOrder = {
  processId: string,
  orderId: string
}
// export type Machine = { machine: string }
export type OrderRushableMachine = {
  orderId: string
  processId: string
  machines: Array<{ machineId: string }>
}
export const getRushableMachine = async (orders: Array<ProcessOrder>) => {
  const formatOrders = orders => {
    return orders.map(order => {
      const { orderIds = '', processId = '' } = order
      return {
        orderId: orderIds,
        processId
      }
    })
  }
  const resData = await ajax<Api<OrderRushableMachine[]>>(
    {
      url: 'api/insertRushOrder/getRushOrdersListByFilter',
      method: 'post',
      data: formatOrders(orders)
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


  if (status !== 'success') {
    swal({
      icon: 'error',
      title: '查詢可插單機台失敗',
      text: msg ?? '請聯絡資訊人員',
      showCancelButton: false
    })
    return []
  }
  else {
    // swal({
    //   icon: 'success',
    //   title: '抽單完成',
    //   showCancelButton: false
    // })
    return data
  }

}


// export type ProcessOrder = {
//   processId: string,
//   orderId: string
// }
// export type RushableMachine = {
//   machineId: string,
// }
// export type ProcessOrderRushableMachine = {
//   processId: string,
//   orderId: string
//   machines: Array<RushableMachine>
// }

// export const getRushableMachine = async (orders: Array<ProcessOrder>) : Promise<any> => {
//   const resData = await ajax<Api<any>>(
//     {
//       // url: '/api/insertRushOrder/importByExcelPreview',
//       url: '/api/insertRushOrder/updateRushOrderSettings',
//       method: 'post',
//       data: orders //formatRushOrderData(rushOrderData)
//     },
//     {
//       isFakeData: true,
//       // isFakeData: false,
//       fakeData: {
//         data: null,
//         status: 'success'
//       },
//       delay: 300
//     }
//   )

//   const { status, data } = resData

//   if (['success', true].includes(status)) {
//     return data
//   } else {
//     return []
//   }

// }