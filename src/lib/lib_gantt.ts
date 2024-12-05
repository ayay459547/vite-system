import { isEmpty, hasOwnProperty, getUuid } from '@/lib/lib_utils' // 工具
import { nextTick } from 'vue'
import dayjs from 'dayjs'
import { getGanttSetting, setGanttSetting } from '@/lib/lib_idb'
// import { isArray } from 'element-plus/es/utils'

export type YItem = YItemGroup | YItemItem | YItemStick
export interface YItemStick {
  name: string
  type: 'search' | 'edit'
  tab: string | null
  depth: 0
  // key: string // Uuid(type)
  children?: []
  orders: Array<any>
  displayRush: false
}
export interface YItemItem  {
  name: string
  tab: string | null
  type: 'item'
  key: string // Uuid(type)
  depth: number
  parent?: YItemGroup
  orders: Array<any>
  orderFilters: Array<any>
  isRushalble: boolean
  rushableCause: string
  rushableOrders: Array<string>
  displayRush: boolean
}
export interface YItemGroup  {
  name: string
  tab: string | null
  type: 'group'
  key: string // Uuid(type)
  depth: number
  parent?: YItemGroup
  // orders: Array<any>
  // orderFilters: Array<any>
  levelFilters: Array<any>
  children?: Array<YItem>
  isOpen: boolean
  isRushalble: false
  rushableCause: string
  rushableOrders: []
  displayRush: boolean
}
export interface GanttData {
  isLoading: boolean
  timeRange: [string, string]
  orders: Array<any>
  marks: Array<any>
  yItems: Array<YItem>
  filterColumns: Array<any>
  processRushableMachines: Map<string, Array<string>> // processId -> Rushable Machine List
  selectOrders: Array<any>
}
export interface YItems  {
  name: string
  tab: string | null
  type: 'group'
  key: string // Uuid(type)
  depth: number
  parent?: YItemGroup
  // orders: Array<any>
  // orderFilters: Array<any>
  preLevelFilters: Array<any>
  curLevelFilters: Array<any>
  nextLevelFilters: Array<any>
  //
  children?: Array<YItems>
  isOpen: boolean
  isRushalble: false
  rushableCause: string
  rushableOrders: []
  displayRush: boolean
}
export interface Order {
  key: string
  startTimeValue: number //second
  endTimeValue: number //second
  //draw Type
  isEdited: boolean
  isEditing: boolean
  isIndicate: boolean

  //
  orderIds: string
  moiIndex: number
  machineIds: string
  processId: string
  //
  markIndex: number
}

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
  label: String | null
  param: string
  values: Array<any>
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

// IndexDB
const lastVersion = '1.0.3'
export const getPageGanttSetting  = async (pageKey: string) => {
  try {
    const resData = await getGanttSetting(pageKey)
    const {
      orderMarks,
      timeMarks,
      levelFilters,
      orderPhases,
      timeRange,
      version
    } = resData

    if(version !== lastVersion) return null
    const orderMarksSetting = orderMarks.map(mark => {
      const  { name, isActive, color, orderFilters } = mark
      return {
        name,
        isActive,
        color,
        orderFilters: JSON.parse(orderFilters)
      }
    })
    const filtersSetting = levelFilters.map(filter => {
      const  { name, active, hierarchies, orderFilters } = filter
      return {
        name,
        active,
        hierarchies: JSON.parse(hierarchies),
        orderFilters: JSON.parse(orderFilters)
      }
    })
    const orderPhasesSetting = orderPhases.map(phase => {
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
    return null
  }
}
export const setPageGanttSetting  = async (pageKey: string, data) => {
  const { orderMarks, timeMarks, levelFilters, orderPhases, timeRange } = data
  const orderMarksSetting = orderMarks.map(mark => {
    const  { name, isActive, color, orderFilters } = mark
    return {
      name,
      isActive,
      color,
      orderFilters: JSON.stringify(orderFilters)
    }
  })
  const filtersSetting = levelFilters.map(filter => {
    const  { name, active, hierarchies, orderFilters } = filter
    return {
      name,
      active,
      // levelFilters: JSON.stringify(levelFilters),
      hierarchies: JSON.stringify(hierarchies),
      orderFilters: JSON.stringify(orderFilters)
    }
  })
  const orderPhasesSetting = orderPhases.map(phase => {
    const  { name, active, timeSteps, rangeParams }   = phase
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

//
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

// 建立預設欄位物件與群組
export const getDefaultLevelFiltersSetting = () => {
  const defaultRootsFilter = predefinedLevelFilterOptions.map(
    option => {
      const label = option.label
      const active = option.value === 'process'
      const levelFilters =  getPredefinedLevelFilter(option.value)
      return {
        label,
        name: label,
        active,
        levelFilters,
        //
        hierarchies: levelFilters.map(levelFilter => levelFilter.param),
        orderFilters: []
      }
    }
  )
  // console.log(defaultRootsFilter)

  return defaultRootsFilter
}
export const applyLevelFiltersSetting = levelFilters => {
  levelFilters.forEach(filter => filter.key = getUuid('filter'))
  return levelFilters
}

//ROOTITEM
export const createNewRootYItem = () => {
  const newRootYItem = {
    key: getUuid('root'),
    active: false,
    hierarchies: ['orderIds'],
    orderFilters: []
  }
  //name
  // newRootYItem.hierarchies = ['orderIds']
  // newRootYItem.orderFilters = []
  // console.log(newRootYItem)
  return newRootYItem

}

// 重設Orders的對應Marks
export const initOrdersMark = async (orders, marks) => {
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
// 建立預設Marks
export const createDefaultMarks = orders => {
  const marksSetting = [
    { i18nLabel: 'gantt-state-0', name: '未開工', type: 'select', value: 0, color: '#72A3C2' },
    // { name: '已結清', value: 1, color: '#FFD700' }, //Gold
    { i18nLabel: 'gantt-state-3', name: '生產中', type: 'select', value: 3, color: '#3094D2' },
    { i18nLabel: 'gantt-state-2', name: '已完工', type: 'select', value: 2, color: '#2CC509' }, //GreenYellow
    //i18nLabel: '',  { name: '已發放', value: 4, color: '#FFA500 '}, //Orange
    //i18nLabel: '',  { name: '未發放', value: 5, color: '#FA8072'}, //Salmon
    { i18nLabel: 'gantt-state-6', name: '暫緩',  type: 'select', value: 6, color: '#696969' }, //DimGray
    { i18nLabel: 'gantt-state-999', name: '結案', type: 'select', value: 999, color: '#702599' } //DodgerBlue

  ]

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

  initOrdersMark(orders, marks)
  return marks
}

export const getDefaultOrderMarksSetting = () => {
  const marksSetting = [
    { i18nLabel: 'gantt-state-0', name: '未開工', type: 'select', value: 0, color: '#72A3C2' },
    // { name: '已結清', value: 1, color: '#FFD700' }, //Gold
    { i18nLabel: 'gantt-state-3', name: '生產中', type: 'select', value: 3, color: '#3094D2' },
    { i18nLabel: 'gantt-state-2', name: '已完工', type: 'select', value: 2, color: '#2CC509' }, //GreenYellow
    //i18nLabel: '',  { name: '已發放', value: 4, color: '#FFA500 '}, //Orange
    //i18nLabel: '',  { name: '未發放', value: 5, color: '#FA8072'}, //Salmon
    { i18nLabel: 'gantt-state-6', name: '暫緩',  type: 'select', value: 6, color: '#696969' }, //DimGray
    { i18nLabel: 'gantt-state-999', name: '結案', type: 'select', value: 999, color: '#702599' } //DodgerBlue

  ]

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

export const applyOrderMarksSetting = (orders, marks) => {

  initOrdersMark(orders, marks)
  return marks
}

// 建立選擇框設定
export const createFilterColumns = (orders, dataParams) => {
  const columns = Object.values(dataParams) as any
  return columns.map(column => {
    const { param, label, i18nLabel, type, options } = column
    if(options) return { param, label, i18nLabel, type, options }

    const set = new Set()
    orders.forEach(order => {
      if(hasOwnProperty(order, param)) {
        set.add(order[param])
      }
    })

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

// 新建欄位物件
export const createNewYItem = (type, depth?) => {
  switch (type) {
    case 'item' :
      return {
        name: 'New Column',
        key: getUuid('item'),
        tab: '',
        type: 'item',
        depth: depth ?? 0,
        isRushable: false,
        rushableCause: '欄位無對應機台',
        orders: [],
        orderFilters: []
      }
    case 'group' :
      return  {
        name: 'New Group',
        key: getUuid('group'),
        tab: '',
        type: 'group',
        depth: depth ?? 0,
        isRushable: false,
        rushableCause: '群組無法執行插單',
        isOpen: false,
        sideOpen: true,
        children: [],
        levelFilters: []
      }
    case 'search' :
      return {
        name: '搜尋結果',
        key: getUuid('item'),
        type: 'item',
        depth: depth ?? 0,
        isRushable: false,
        rushableCause: '搜尋欄位無法插單',
        orders: [],
        orderFilters: []
      }
  }
}


export const setYItemDepth = (item, func) => {
  const next = func(item)
  if(!next) return
  if(item.type === 'group') {
    item.children.forEach(child => setYItemDepth(child, func))
  }
}

export const predefinedLevelFilterOptions = [
  { i18nLabel: 'manufacturing-order', label: '工單', value: 'order'},
  { i18nLabel: 'process', label: '製程', value: 'process'},
  { i18nLabel: 'machine', label: '機台', value: 'machine'}
]
export const getPredefinedLevelFilter = optionValue => {
  switch (optionValue) {
    case 'process' : {
      return [
        {
          label: '製程維度',
          tab: '製程',
          param: 'processId',
          values: []
        },
        {
          label: null,
          tab: '機台',
          param: 'machineId',
          values: []
        },
        {
          label: null,
          tab: '工單',
          param: 'orderIds',
          values: []
        }
      ]
    }
    case 'machine' : {
      return [
        {
          label: '機台維度',
          tab: '機台',
          param: 'machineId',
          values: []
        },
        {
          label: null,
          tab: '工單',
          param: 'orderIds',
          values: []
        }
      ]
    }
    case 'order': {
      return [
        {
          label: '工單維度',
          tab: '工單',
          param: 'orderIds',
          values: []
        }
      ]
    }
  }
}

export const getOrderKey = order => {
  const { orderIds, moiIndex } = order
  if(!orderIds || !moiIndex) return null
  return `${orderIds}_${moiIndex}`
}

// default HIERARCHIESFILTER
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
export const inYItemFilter = (yItem, yItemFilter) => {
  const { param, type, operator, value: filterValue } = yItemFilter
  if(yItem.param !== param) return true //Param不相同則無視

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
    case 'select-equal': return filterValue.includes(yItemValue)
    case 'select-notEqual': return !filterValue.includes(yItemValue)
    default: return true // Filter無效則不過濾
  }
}
export const applyYItemFilters = (yItems, yItemFilters) => {
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
}
const inPathFilter = (order, filter:Path) => {
  const { param, value: filterValue } = filter
  if(!hasOwnProperty(order, param)) return false
  const orderValue = order[param]
  return orderValue === filterValue
}
export const applyPathFilters = (orders, path:Array<Path>) => {
  if(path.length === 0) return orders.concat()
  const applyOrders  = orders.filter(order => {
    return !path.some(filter => !inPathFilter(order, filter))
  })
  return applyOrders
}
// OrderFilter
export interface OrderFilter {
  key?: string
  param: string
  type: 'string' | 'number' | 'time' | 'boolean' | ''
  operator:  string
  value: Array<any> | string | number | null
}
export const inOrderFilter = (order, orderFilter) => {
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
    case 'select-equal': return filterValue.includes(orderValue)
    case 'select-notEqual': return !filterValue.includes(orderValue)
    default: return true // Filter無效則不過濾
  }
}
export const applyOrderFilters = (orders, orderFilters:Array<OrderFilter>) => {
  if(orderFilters.length === 0) return orders.concat()
  const applyOrders = orders.filter(order => {
    return !orderFilters.some(filter => !inOrderFilter(order, filter))
  })

  return applyOrders
}

const getOrderFilterValueType = (orderFilter:OrderFilter) => {
  const { type, operator } = orderFilter
  const pattern = type + '-' + operator

  switch (pattern) {
    case 'string-like':
    case 'string-notLike': return 'String'
    case 'string-equal':
    case 'string-notEqual': return 'Array'
    case 'number-equal':
    case 'number-greatterThanOrEqualTo':
    case 'number-lessThanOrEqualTo': return 'Number'
    case 'time-after':
    case 'time-before': return 'String'
    case 'time-between': return 'TimeRange'
    case 'select-equal':
    case 'select-notEqual': return 'Array'
    default : return 'ERROR'
  }
}

// 建立新的OrderFilter, 預設為空
export const createEmptyOrderFilter = ():OrderFilter => {
  return  {
    key: getUuid('filter'),
    param: '',
    type: '',
    operator: '',
    value: null
  }
}


export const isOrderFilterValid = (orderFilter:OrderFilter): boolean => {
  const { param, value } = orderFilter
  if(param === '') return false
  if(value === null) return false
  const valueType = getOrderFilterValueType(orderFilter)
  switch (valueType) {
    case 'Array': return !isEmpty(value)
    case 'String': return value !== ''
    case 'Number':
    case 'TimeRange': return  value[0] !== '' && value[1] !== ''
    default: return false
  }
}
export const operatorOptions = {
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
  select: [
    { label: '=', value: 'equal' },
    { label: '!=', value: 'notEqual' }
  ]
}

// Type: Time
export const converTimeStringToValue = (timeString:string) : number => {
  if(!timeString) return null
  return dayjs(timeString).unix()
}
export const convertTimeValueToString = (timeValue:number) => {
  if(!timeValue) return null
  return dayjs.unix(timeValue).format('YYYY-MM-DD HH:mm')
}
export const getDataTimeRange = (data, rangeParams) => {
  const [ param1, param2 ] = rangeParams
  const time1 = data[param1]
  const time2 = data[param2]

  if(!time1 || !time2) return null
  if(time1 > time2) return null
  return [time1, time2]
}