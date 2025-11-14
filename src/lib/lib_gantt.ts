import { isEmpty, hasOwnProperty, getUuid } from '@/lib/lib_utils' // 工具
import { nextTick } from 'vue'
import type { Options } from '@/components'
import dayjs from 'dayjs'
import { getGanttSetting, setGanttSetting } from '@/lib/lib_idb'
// import { isArray } from 'element-plus/es/utils'

export interface GanttSetting {
  key: string
  version: string
  orderMarks: Array<OrderMark>
  timeMarks: Array<TimeMark>
  levelFilters: Array<LevelFilter>
  orderPhases: Array<OrderPhase>
  timeRange: TimeRange
}
export interface LevelFilter {
  label: string | null
  param: string
  values: Array<any>
}
export interface MarkSetting {
  name: string
  i18nLabel: string
  type: string
  value: any
  color: string
}
export interface OrderMark {
  name: string
  isActive: boolean
  color: string
}


export interface TimeMark {
  label: string
  timeString: string // 2024-10-09 00:00",
  display: boolean
  displayHeader: boolean
  color: string
}
export interface OrderPhase {
  isDefault: boolean
  active: boolean
  name: string
  rangeParams: [string, string]
  timeSteps: Array<Step>
}
export interface Step {
  active: boolean
  rangeParams: [string, string]
  color: string
}
export interface TimeRange {
  type: 'select' | 'count'
  timeUnit: number
  timeUnitCount: number
  timeRange: [string, string]
}

export interface HierarchiesFilter {
  name: string
  active?: boolean
  hierarchies: Array<string>
  orderFilters: Array<OrderFilter>
}

export type ParamType = 'string' | 'number' | 'boolean' | 'set' | 'select' | 'time' | 'timeset' |''



// IndexDB
const lastVersion = '1.0.8'
export const getPageGanttSetting = async (pageKey: string) => {
  try {
    const resData: any = await getGanttSetting(pageKey)
    const {
      orderMarks,
      timeMarks,
      levelFilters,
      orderPhases,
      timeRange,
      version
    } = resData

    if(version !== lastVersion) return null
    const orderMarksSetting = orderMarks.map((mark: any) => {
      const  { name, isActive, color, orderFilters } = mark
      return {
        name,
        isActive,
        color,
        orderFilters: JSON.parse(orderFilters)
      }
    })
    const filtersSetting = levelFilters.map((filter: any) => {
      const  { name, active, hierarchies, orderFilters } = filter
      return {
        name,
        active,
        hierarchies: JSON.parse(hierarchies),
        orderFilters: JSON.parse(orderFilters)
      }
    })
    const orderPhasesSetting = orderPhases.map((phase: any) => {
      const  { name, active, rangeParams, timeSteps } = phase
      return {
        name,
        active,
        rangeParams: JSON.parse(rangeParams),
        timeSteps: JSON.parse(timeSteps)
      }
    })
    const timeRangeSetting = {
      type: timeRange.type,
      timeUnit: timeRange.timeUnit,
      timeUnitCount: timeRange.timeUnitCount,
      timeRange: JSON.parse(timeRange.timeRange)
    }

    return {
      orderMarks: orderMarksSetting,
      timeMarks,
      levelFilters: filtersSetting,
      orderPhases: orderPhasesSetting,
      timeRange: timeRangeSetting
    }
  } catch (e) {
    console.log(e)
    return null
  }
}
export const setPageGanttSetting = async (pageKey: string, data: any) => {
  const { orderMarks, timeMarks, levelFilters, orderPhases, timeRange } = data
  const orderMarksSetting = orderMarks.map((mark: any) => {
    const  { name, isActive, color, orderFilters } = mark
    return {
      name,
      isActive,
      color,
      orderFilters: JSON.stringify(orderFilters)
    }
  })
  const filtersSetting = levelFilters.map((filter: any) => {
    const  { name, active, hierarchies, orderFilters } = filter
    return {
      name,
      active,
      // levelFilters: JSON.stringify(levelFilters),
      hierarchies: JSON.stringify(hierarchies),
      orderFilters: JSON.stringify(orderFilters)
    }
  })
  const orderPhasesSetting = orderPhases.map((phase: any) => {
    const  { name, active, timeSteps, rangeParams } = phase
    return {
      name,
      active,
      rangeParams: JSON.stringify(rangeParams),
      timeSteps: JSON.stringify(timeSteps)
    }
  })

  const timeRangeSetting = {
    type: timeRange.type ?? 'count',
    timeUnit: timeRange.timeUnit ?? 2,
    timeUnitCount: timeRange.timeUnitCount ?? 4,
    timeRange: JSON.stringify(timeRange.timeRange ?? ['', ''])
  }

  const ganttSetting = {
    key: pageKey,
    version: lastVersion,
    orderMarks: orderMarksSetting,
    timeMarks,
    levelFilters: filtersSetting,
    orderPhases: orderPhasesSetting,
    timeRange: timeRangeSetting
  }

  await setGanttSetting(pageKey, ganttSetting)
}

/**
 * @description 建立預設欄位物件與群組
 */
export const createDefaultLevelFiltersSetting = setting => {
  const defaultRootsFilter = setting.map(
    option => {
      const label = option.label
      const active = option.active
      const levelFilters = option.levelFilters
      const i18nLabel = option.i18nLabel
      return {
        label,
        i18nLabel,
        name: label,
        active,
        levelFilters,
        key: getUuid('filter'),
        //
        hierarchies: levelFilters.map(levelFilter => levelFilter.param),
        orderFilters: []
      }
    }
  )

  return defaultRootsFilter
}

export const applyLevelFiltersSetting = (levelFilters: any[]) => {
  levelFilters.forEach(filter => filter.key = getUuid('filter'))
  return levelFilters
}

/**
 * @description ROOTITEM
 */
export const createNewRootYItem = () => {
  const newRootYItem = {
    key: getUuid('root'),
    active: false,
    hierarchies: ['orderIds'],
    orderFilters: []
  }
  // name
  // newRootYItem.hierarchies = ['orderIds']
  // newRootYItem.orderFilters = []
  // console.log(newRootYItem)
  return newRootYItem

}

/**
 * @description 重設Orders的對應Marks
 */
export const initOrdersMark = async (orders: any[], marks: any[]) => {
  await nextTick()
  // Reset Order.marks
  orders.forEach(order => order.marks.splice(0))
  // Set Order.marks
  marks.forEach(mark => {
    const { orderFilters } = mark

    if(orderFilters.length === 0) return []
    const matchOrders = applyOrderFilters(orders, mark.orderFilters)
    matchOrders.forEach(order => { order.marks.push(mark)})
  })
}

/**
 * @description 建立預設Marks
 */
export const createDefaultOrderMarks = marksSetting => {
  const marks = marksSetting.map(mark => {
    return {
      label: mark.name,
      i18nLabel: mark.i18nLabel,
      name: mark.name,
      isActive: true,
      key: getUuid('mark'),
      orderFilters: [
        {
          param: 'status',
          type: mark.type,
          operator: 'equal',
          value: [mark.value]
        }
      ],
      color: mark.color
    }
  })

  return marks
}

export const applyOrderMarksSetting = (orders: any[], marks: any[]) => {
  initOrdersMark(orders, marks)
  return marks
}

/**
 * @description 建立選擇框設定
 */
export const createFilterColumns = (orders: any[], dataParams: any) => {
  const columns = Object.values(dataParams) as any[]
  return columns.map(column => {
    const { param, label, i18nLabel, type, options } = column
    if(options) return { param, label, i18nLabel, type, options }

    const set = new Set()
    switch(type) {
      case 'set': {
        orders.forEach(order => {
          if(hasOwnProperty(order, param)) {
            const valueList = order[param]
            valueList.forEach(value => { set.add(value)})
          }
        })
        break
      }
      default: {
        orders.forEach(order => {
          if(hasOwnProperty(order, param)) {
            set.add(order[param])
          }
        })
      }
    }


    const setArray = Array.from(set)

    switch(type) {
      case 'number': setArray.sort((a, b) => Number(a) - Number(b)); break
      default: setArray.sort(); break
    }
    const valueOptions = setArray.map(option => {
      return {label: option, value: option}
    })

    return { param, label, i18nLabel, type, options: valueOptions }

  })
  //   if(!hasOwnProperty(column, 'options')) {
  //     const { param, type } = column
  //     const set = new Set()
  //     orders.forEach(order => {
  //       if(hasOwnProperty(order, param)) {
  //         set.add(order[param])
  //       }
  //     })

  //     const setArray = Array.from(set)
  //     if(param !== 'status') {
  //       switch(type) {
  //         case 'number': setArray.sort((a, b) => Number(a) - Number(b)); break
  //         default: setArray.sort(); break
  //       }
  //     }

  //     column.options = setArray.map(option => {
  //       return {label: option, value: option}
  //     })

  //   }
  // })
  // console.log(columns)
  // return columns
}



/**
 * @description default HIERARCHIESFILTER
 */
export const defaultHierarchiesFilters: Array<HierarchiesFilter> = [
  {
    name: '工單維度',
    active: true,
    hierarchies: ['orderIds'],
    orderFilters: []
  },
  {
    name: '製程維度',
    active: false,
    hierarchies: ['processId', 'orderIds'],
    orderFilters: []
  },
  {
    name: '機台維度',
    active: false,
    hierarchies: ['processId', 'machineId', 'orderIds'],
    orderFilters: []
  }
]

export interface RootYItem {
  name: string
  key: string // Uuid(root)
  // type: 'root'
  // children: Array<any>
  //
  hierarchies: Array<string>
  path: Array<Path>
  orderFilters: Array<OrderFilter>
}
export const inYItemFilter = (yItem: any, yItemFilter: any) => {
  const { param, type, operator, value: filterValue } = yItemFilter
  // console.log(yItem, yItemFilter)
  if(yItem.param !== param) return true // Param不相同則無視

  const yItemValue = yItem.value
  const pattern = type + '-' + operator


  switch (pattern) {
    case 'string-like': return yItemValue.includes(filterValue)
    case 'string-notLike': return !yItemValue.includes(filterValue)
    case 'string-equal': return filterValue.includes(yItemValue)
    case 'string-notEqual': return !filterValue.includes(yItemValue)
    case 'number-equal': return yItemValue === filterValue
    case 'number-greatterThanOrEqualTo':  return yItemValue >= filterValue
    case 'number-lessThanOrEqualTo': return yItemValue <= filterValue
    case 'time-after': return yItemValue > dayjs(filterValue).unix()
    case 'time-before': return yItemValue < dayjs(filterValue).unix()
    case 'time-between': {
      if(yItemValue < dayjs(filterValue[0]).unix()) return false
      if(yItemValue > dayjs(filterValue[1]).unix()) return false
      return true
    }
    case 'timeset-after': {
      const filterTime = dayjs(filterValue).unix()
      return !yItemValue.some(time => {
        const start = time[0]
        return start <= filterTime
      })
    }
    case 'timeset-before': {
      const filterTime = dayjs(filterValue).unix()
      return !yItemValue.some(time => {
        const end = time[1]
        return end >= filterTime
      })
    }
    case 'timeset-include': {
      const filterTime = dayjs(filterValue).unix()
      return yItemValue.some(time => {
        const start = time[0]
        const end = time[1]
        return start <= filterTime && end >= filterTime
      })
    }
    case 'select-equal': return filterValue.includes(yItemValue)
    case 'select-notEqual': return !filterValue.includes(yItemValue)
    default: return true // Filter無效則不過濾
  }
}
export const applyYItemFilters = (yItems: any[], yItemFilters: any[]) => {
  if(yItemFilters.length === 0) return yItems.concat()
  const applyYItems = yItems.filter(yItem => {
    return !yItemFilters.some(filter => !inYItemFilter(yItem, filter))
  })

  return applyYItems
}

// Path
export interface Path {
  param: string
  value: string | number | boolean
  type: ParamType
}
const inPathFilter = (order: any, filter: Path) => {
  const { param, value: filterValue, type } = filter
  if(!hasOwnProperty(order, param)) return false
  const orderValue = order[param]

  switch (type) {
    case 'set': return orderValue.includes(filterValue)
    default: return orderValue === filterValue
  }
}
export const applyPathFilters = (orders: any[], path:Array<Path>) => {
  if(path.length === 0) return orders.concat()
  const applyOrders = orders.filter(order => {
    return !path.some(filter => !inPathFilter(order, filter))
  })
  return applyOrders
}
// OrderFilter
export interface OrderFilter {
  key?: string
  param: string
  type: ParamType
  operator:  string
  value: Array<any> | string | number | null
}
export const inOrderFilter = (order: any, orderFilter: any) => {
  const { param, type, operator, value: filterValue } = orderFilter
  if(!hasOwnProperty(order, param)) return false
  const orderValue = order[param]
  const pattern = type + '-' + operator

  switch (pattern) {
    case 'string-like': return orderValue.includes(filterValue)
    case 'string-notLike': return !orderValue.includes(filterValue)
    case 'string-equal': return filterValue.includes(orderValue)
    case 'string-notEqual': return !filterValue.includes(orderValue)
    case 'number-equal': return orderValue === filterValue
    case 'number-greatterThanOrEqualTo':  return orderValue >= filterValue
    case 'number-lessThanOrEqualTo': return orderValue <= filterValue
    case 'time-after': return orderValue > dayjs(filterValue).unix()
    case 'time-before': return orderValue < dayjs(filterValue).unix()
    case 'time-between': {
      if(orderValue < dayjs(filterValue[0]).unix()) return false
      if(orderValue > dayjs(filterValue[1]).unix()) return false
      return true
    }
    case 'timeset-after': {
      const filterTime = dayjs(filterValue).unix()
      return !orderValue.some(time => {
        const start = time[0]
        return start <= filterTime
      })
    }
    case 'timeset-before': {
      const filterTime = dayjs(filterValue).unix()
      return !orderValue.some(time => {
        const end = time[1]
        return end >= filterTime
      })
    }
    case 'timeset-include': {
      const filterTime = dayjs(filterValue).unix()
      return orderValue.some(time => {
        const start = time[0]
        const end = time[1]
        return start <= filterTime && end >= filterTime
      })
    }
    case 'select-equal': return filterValue.includes(orderValue)
    case 'select-notEqual': return !filterValue.includes(orderValue)
    case 'set-include': return orderValue.some(value => filterValue.includes(value))
    case 'set-exclude': return !orderValue.some(value => filterValue.includes(value))
    default: return true // Filter無效則不過濾
  }
}
export const applyOrderFilters = (orders: any[], orderFilters:Array<OrderFilter>) => {
  if(orderFilters.length === 0) return orders.concat()
  const applyOrders = orders.filter(order => {
    return !orderFilters.some(filter => !inOrderFilter(order, filter))
  })

  return applyOrders
}

export type OrderFilterValue = 'String' | 'Array' | 'Number' | 'TimeRange' | 'ERROR'
const getOrderFilterValueType = (orderFilter:OrderFilter): OrderFilterValue => {
  const { type, operator } = orderFilter
  const pattern = type + '-' + operator

  switch (pattern) {
    // String
    case 'string-like':
    case 'string-notLike': return 'String'
    case 'string-equal':
    case 'string-notEqual': return 'Array'
    // Number
    case 'number-equal':
    case 'number-greatterThanOrEqualTo':
    case 'number-lessThanOrEqualTo': return 'Number'
    // Time
    case 'time-after':
    case 'time-before': return 'String'
    case 'time-between': return 'TimeRange'
    // Timeset
    case 'timeset-after':
    case 'timeset-before':
    case 'timeset-include': return 'String'
    // Select
    case 'select-equal':
    case 'select-notEqual': return 'Array'
    // Set
    case 'set-include':
    case 'set-exclude': return 'Array'
    default : return 'ERROR'
  }
}

/**
 * @description 建立新的OrderFilter, 預設為空
 */
export const createEmptyOrderFilter = (): OrderFilter => {
  return  {
    key: getUuid('filter'),
    param: '',
    type: '',
    operator: '',
    value: null
  }
}

export const isOrderFilterValid = (orderFilter: OrderFilter): boolean => {
  const { param, value } = orderFilter
  if(param === '') return false
  if(value === null) return false
  const valueType = getOrderFilterValueType(orderFilter)
  switch (valueType) {
    case 'Array': return !isEmpty(value)
    case 'Number':
    case 'String': return value !== ''
    case 'TimeRange': return Array.isArray(value) && value[0] !== '' && value[1] !== ''
    default: return false
  }
}
export const operatorOptions: Record<string, Options> = {
  number: [
    { label: '>=', value: 'greatterThanOrEqualTo' },
    { label: '<=', value: 'lessThanOrEqualTo' },
    { label: '=', value: 'equal' }
  ],
  string: [
    { label: 'like', value: 'like' },
    { label: 'not like', value: 'notLike' },
    { label: '=', value: 'equal' },
    { label: '!=', value: 'notEqual' }
  ],
  time: [
    { label: 'After', value: 'after' },
    { label: 'Before', value: 'before' },
    { label: 'Between', value: 'between' }
  ],
  timeset: [
    { label: 'After', value: 'after' },
    { label: 'Before', value: 'before' },
    { label: 'Include', value: 'include' }
  ],
  select: [
    { label: '=', value: 'equal' },
    { label: '!=', value: 'notEqual' }
  ],
  set: [
    { label: 'Include', value: 'include' },
    { label: 'Exclude', value: 'exclude' }
  ]
}

/**
 * @description Type: Time
 */

export type TimeSet = Array<{ start: string, end: string}>
export const converTimeSetToValue = (timeSet: TimeSet) => {
  return timeSet.map(time => {
    const { start, end } = time
    return [
      converTimeStringToValue(start),
      converTimeStringToValue(end)
    ]
  })
}
export const converTimeStringToValue = (timeString: string): number | null => {
  if(!timeString) return null
  return dayjs(timeString).unix()
}
export const convertTimeValueToString = (timeValue: number) => {
  if(!timeValue) return null
  return dayjs.unix(timeValue).format('YYYY-MM-DD HH:mm')
}
export const getDataTimeRange = (data: any, rangeParams: any) => {
  const [ param1, param2 ] = rangeParams
  const time1 = data[param1]
  const time2 = data[param2]

  if(!time1 || !time2) return null
  if(time1 > time2) return null
  return [time1, time2]
}

export const getOrderKey = (order: any) => {
  const { orderIds, moiIndex } = order
  if(!orderIds || !moiIndex) return null
  return `${orderIds}_${moiIndex}`
}
