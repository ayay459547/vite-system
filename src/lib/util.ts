import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

const baseUrl = (import.meta as any).env.VITE_API_BASE_URL

type AjaxResponse<T> = {
  data: T
  status: string
}
type AjaxOptions<T> = {
  getFakeData?: boolean
  fakeData?: T | null
  status?: 'success' | 'error'
}
/**
 * @author Caleb
 * @description 抓後端資料用
 * @param {Object} config 設定
 *              url: api網址
 *              method: get | post | put | delete
 *              data: 傳到後端資料
 * @param {Object} options
 *              getFakeData: 是否取的假資料
 *              fakeData: 如果是取假資料 返回的資料
 *              status: 資料返回狀態
 * @returns {Promise}
 */
export const ajax = <T, D>(config: AxiosRequestConfig<D>, options: AjaxOptions<T> = {}): Promise<AjaxResponse<T>> => {
  const tempOptions = {
    getFakeData: false,
    fakeData: null,
    status: 'success',
    ...options
  }
  const { getFakeData, fakeData, status } = tempOptions
  if (getFakeData) {
    return Promise.resolve({
      data: fakeData,
      status
    })
  }

  const instance = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    //   withCredentials: true
    headers: {
      'Content-Type': 'application/json'
    }
  })

  instance.interceptors.request.use(
    (config) => {
      return config
    },
    (err) => {
      console.log(err)
    }
  )

  instance.interceptors.response.use(
    (res) => {
      return res.data
    },
    (err) => {
      console.log(err)
    }
  )

  return instance(config)
}

/**
 * @author Caleb
 * @description 拷貝 array 或 object
 * @param {Object | Array} targetElement 需要被拷貝的對象
 * @param {Object | Array} origin 拷貝來源
 * @returns {Object} 拷貝完的物件
 */
export const deepClone = <T>(targetElement: any, origin: T): T => {
  const toStr = Object.prototype.toString
  const hasOwnProperty = Object.prototype.hasOwnProperty
  const target = targetElement

  function setFun (obj: Array<any> | Record<any, any>, key: string | number, value: any): void {
    obj[key] = value
  }

  for (const prop in origin) {
    if (hasOwnProperty.call(origin, prop)) {
      switch (toStr.call(target[prop])) {
        case '[object Array]':
        case '[object Object]':
          switch (toStr.call(origin[prop])) {
            case '[object Array]':
            case '[object Object]':
              target[prop] = origin[prop].constructor()
              deepClone(target[prop], origin[prop])
              break
            default:
              setFun(target, prop, origin[prop])
              break
          }
          break
        default:
          setFun(target, prop, origin[prop])
          break
      }
    }
  }
  return (target as T)
}

/**
 * @author Caleb
 * @description 取的 Columns 設定
 *              slot prop 預設是 key
 * @param {Ojbect} columns
 * @param {String} type 取得 columnSetting 中的類型
 * @param {String} resType 返回類型 Array | Object
 * @returns {Array | Ojbect}
 */
export const getColumns = (columns: Record<string, any>, type: string, resType: 'Array' | 'Object'): Array<any> | Record<string, any> => {
  let resColumns = null
  const hasOwnProperty = Object.prototype.hasOwnProperty

  const getColumnData = (column: Record<string, any>, type: string, key: string): Record<string, any> => {
    return {
      key,
      prop: key,
      slot: key,
      sortable: false,
      label: column?.label ?? '',
      ...column[type]
    }
  }

  if (resType === 'Array') {
    resColumns = []

    columns.$forEach((column: Record<string, any>, key: string) => {
      if(hasOwnProperty.call(column, type)) {
        const temp = getColumnData(column, type, key)
        resColumns.push(temp)
      }
    })

  } else if (resType === 'Object') {
    resColumns = {}

    columns.$forEach((column: Record<string, any>, key: string) => {
      if(hasOwnProperty.call(column, type)) {
        const temp = getColumnData(column, type, key)
        resColumns[key] = temp
      }
    })
  }
  return resColumns
}

/**
 * @author Caleb
 * @description 取的 Columns 所有key
 * @param {Ojbect} columns
 * @returns {Array}
 */
export const getColumnsKey = (columns: Record<string, any>): Array<string> => {
  return columns.$reduce((prev: Array<string>, curr: any, currKey: string) => {
      return [...prev, currKey]
  }, [])
}

/**
 * @author Caleb
 * @description 取的準確的資料類型
 * @param {*} any
 * @returns {String} 類型
 */
export const getType = (any: any): string => {
  const stringType = Object.prototype.toString.call(any)
  const regexp = /[\s]{1}([A-Z|a-z]*)(?=\])/
  const res = stringType.match(regexp)
  return res[1]
}

/**
 * @author Caleb
 * @description 移動到指定的Dom元素 預設跑到專案最上面
 * @param {Element} el Dom元素 <div>
 * @param {Object} options 選項
 *  behavior: auto, smooth
 *  block: start, center, end, nearest
 *  inline: start, center, end, nearest"
 */
export const scrollToEl = (el: Element = document.querySelector('#app'), options: ScrollIntoViewOptions = {}): void => {
  const setting: ScrollIntoViewOptions = {
    behavior: 'smooth',
    block: 'end',
    inline: 'nearest',
    ...options
  }
  const re = new RegExp('Element')

  if ( re.test(Object.prototype.toString.call(el)) ) {
    el.scrollIntoView(setting)
  }
}

/**
 * @author Caleb
 * @description 時間換 毫秒時間
 * @param {String} date
 * @param {String} time
 * @returns {Number}
 */
export const getDateMilliseconds = (date: string = '2020-01-01', time: string = '00:00:00'): number => {
  return Date.parse(date + 'T' + time)
}

/**
 * @author Caleb
 * @description 給毫秒時間 換 YYYY/MM/DD hh:mm:ss
 * @param {Date} value
 * @param {String} format
 * @returns {String}
 */
export const dateFormatter = (value: number, format: string): string => {
  const date = new Date(value)
  const [ year, month, day, hours, mintes, seconds ] = [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
    (date.getHours() + 1).toString().padStart(2, '0'),
    (date.getMinutes() + 1).toString().padStart(2, '0'),
    (date.getSeconds() + 1).toString().padStart(2, '0')
  ]

  switch (format) {
    case 'YYYY':
      return `${year}`
    case 'YYYY/MM':
      return `${year}-${month}`
    case 'YYYY/MM/DD':
      return `${year}-${month}-${day}`
    case 'YYYY/MM/DD hh':
      return `${year}-${month}-${day} ${hours}`
    case 'YYYY/MM/DD hh:mm':
      return `${year}-${month}-${day} ${hours}:${mintes}`
    case 'YYYY/MM/DD hh:mm:ss':
      return `${year}-${month}-${day} ${hours}:${mintes}:${seconds}`

    case 'hh:mm:ss':
      return `${hours}:${mintes}:${seconds}`
    case 'MM/DD hh:mm':
      return `${month}-${day} ${hours}:${mintes}`
    default:
      return `${year}-${month}-${day}`
  }
}
