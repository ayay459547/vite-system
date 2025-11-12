import { isRef, unref, isReactive, toRaw, isProxy } from 'vue'

import type { SweetAlertOptions } from 'sweetalert2'
import Swal from 'sweetalert2'

import type {
  NotificationOptions,
  NotificationHandle,
  MessageOptions,
  MessageHandler
} from 'element-plus'
import { ElNotification, ElMessage } from 'element-plus'

import cryptoJS from 'crypto-js'
import { v4 as uuidv4 } from 'uuid'

/**
 * @author Caleb
 * @description 判斷 Object 是否存在屬性
 *              不包含原型鏈(Prototype Chain)上的屬性
 * @param {Object} obj 物件
 * @param {String} key 屬性
 * @returns {Boolean}
 */
export const hasOwnProperty = (obj: any, key: string): boolean => {
  try {
    /**
     * 新版寫法
     * Object.hasOwn 替代 Object.prototype.hasOwnProperty
     *
     * 瀏覽器支援:
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn#browser_compatibility
     */
    if (Object.hasOwn) return Object.hasOwn(obj, key)

    /**
     * 原版寫法 瀏覽器支援較佳
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
     */
    return Object.prototype.hasOwnProperty.call(obj, key)
  } catch (e) {
    console.warn(e)
    return false
  }
}

/**
 * @author Caleb
 * @description 取的準確的資料類型(不建議使用, ts 無支援) ❗
 * @param {*} value
 * @returns {String} 類型
 */
export const getType = (value: any): string => {
  const stringType = Object.prototype.toString.call(value)
  const regexp = /[\s]{1}([A-Z|a-z]*)(?=\])/
  const res = stringType.match(regexp)
  return Array.isArray(res) ? res[1] : ''
}

/**
 * @author Caleb
 * @description 判斷東西是否為空
 *
 * @modifiedBy Caleb
 * @modifiedDate 2024-09-30
 * @modifiedDescription 加強isEmpty判斷
 *
 * @param {*} value
 * @returns {Boolean}
 */
export const isEmpty = (value: any): value is null | undefined => {
  const valueType = Object.prototype.toString.call(value)

  switch (valueType) {
    case '[object Array]':
    case '[object String]':
      return value.length === 0
    case '[object Object]':
      for (const key in value) {
        if (hasOwnProperty(value, key)) return false
      }
      return true
    case '[object Set]':
    case '[object Map]':
      return value.size === 0
    case '[object Undefined]':
    case '[object Null]':
      return true
    case '[object Number]':
    case '[object BigInt]':
    case '[object Boolean]':
    case '[object Symbol]':
    case '[object Date]':
    default:
      return false
  }
}

/**
 * @description 判斷東西是否為數字(包含字串數字)
 * @param {*} value
 * @returns {Boolean}
 */
export const isNumeric = (value: any): boolean => {
  return !isNaN(Number(value))
}

/**
 * @author Caleb
 * @description 取隨機生成 id
 * @param {String} text 前綴
 * @returns {String}
 */
export const getUuid = (text?: string): string => {
  const __uuid__ = uuidv4()
  return (typeof text === 'string' && text.length > 0) ? `${text}-${__uuid__}` : __uuid__
}

const mode = (import.meta as any).env.MODE

export type ConsoleType = keyof Console | string

/**
 * @author Caleb
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/console
 * @description 系統用顯示log 💬
 * @param {*} value 任意值
 * @param {ConsoleType} consoleType log類型
 * @param {String} style 樣式
 * @returns {String} 系統mode
 */
export const systemLog = (value: any, consoleType?: ConsoleType, style?: string): string => {
  if (mode !== 'development') return mode
  const logStyle = (typeof style === 'string' && style.length > 0 ? style : '')

  // 可使用 style
  const canUseStyleLogMap: Partial<Console> = {
    debug: console.debug,
    dirxml: console.dirxml, // 類似 dir，但針對 DOM 輸出
    error: console.error, // 輸出錯誤訊息，通常在 console 中以紅色顯示
    group: console.group, // 將輸出訊息分組顯示(開始)，展開
    groupCollapsed: console.groupCollapsed, // 將輸出訊息分組顯示(開始)，不展開
    info: console.info, // 輸出一般資訊，與 console.log 類似
    log: console.log, // 最常用的，輸出訊息
    trace: console.trace, // 輸出呼叫堆疊（呼叫鍊)，Debug 使用
    warn: console.warn // 輸出警告訊息，通常以黃色顯示
  }

  // 使用物件
  const objectLogMap: Partial<Console> = {
    assert: console.assert, // 進行條件判斷，如果條件為 false，則輸出錯誤訊息
    dir: console.dir, // 顯示物件的屬性
    table: console.table // 以表格形式輸出數組或物件的內容
  }

  // 使用字串
  const stringLogMap: Partial<Console> = {
    count: console.count, // 計算程式執行次數(開始)
    countReset: console.countReset, // 計算程式執行次數(結束)
    time: console.time, // 測量程式執行時間(開始)
    timeEnd: console.timeEnd, // 測量程式執行時間(結束)
    timeLog: console.timeLog,
    timeStamp: console.timeStamp
  }

  // 不傳參數
  const emptyLogMap: Partial<Console> = {
    groupEnd: console.groupEnd, // 將輸出訊息分組顯示(結束)
    clear: console.clear // 清空 console
  }

  if (hasOwnProperty(canUseStyleLogMap, consoleType)) {
    canUseStyleLogMap[consoleType]('%c%s', logStyle, value)

  } else if (hasOwnProperty(objectLogMap, consoleType)) {
    objectLogMap[consoleType](value)

  } else if (hasOwnProperty(stringLogMap, consoleType)) {
    stringLogMap[consoleType](`${value}`)

  } else if (hasOwnProperty(emptyLogMap, consoleType)) {
    emptyLogMap[consoleType]()

  } else {
    console.log(value)
  }
  return mode as string
}

/**
 * @author Caleb
 * @description 系統開發中提示用log 💡
 * @param {String} title 主要提示
 * @param {Array} messages 訊息列表
 */
export const tipLog = (title: string = '', messages: any[] = [], consoleType?: ConsoleType, style?: string): string => {
  if (mode !== 'development') return mode

  const titleStyle = 'color: #E6A23C'
  const _style = (typeof style === 'string' && style.length > 0) ? style : ''

  console.groupCollapsed('%c%s', titleStyle, `💡 開發中提示：${title}`)
  messages.forEach(message => systemLog(message, consoleType, _style))
  console.groupEnd()

  return mode as string
}

/**
 * @author Caleb
 * @see https://sweetalert2.github.io/
 * @description 互動式彈窗
 * @param {Object} options 自訂選項
 * @returns {Promise}
 */
export const swal = (options: SweetAlertOptions): Promise<any> => {
  const defaultOPtions = {
    // icon 類型
    // info, warning, success, error, question
    reverseButtons: true,

    confirmButtonText: 'OK',
    confirmButtonColor: '#409EFF',
    showConfirmButton: false,

    denyButtonText: 'No',
    denyButtonColor: '#E6A23C',
    showDenyButton: false,

    cancelButtonText: 'Cancel',
    cancelButtonColor: '#909399',
    showCancelButton: false,
    ...options
  }

  return Swal.fire({ ...defaultOPtions })
}

/**
 * @see https://element-plus.org/en-US/component/notification.html
 * @description 通知:卡片樣式-角落
 * @param options options 自訂選項
 * @returns {NotificationHandle}
 */
export const notification = (options: Partial<NotificationOptions>): NotificationHandle => {
  return ElNotification({
    // 預設值
    title: '',
    message: '',
    dangerouslyUseHTMLString: false,
    type: '', // 'success' | 'warning' | 'info' | 'error' | ''
    icon: undefined,
    customClass: '',
    duration: 4500,
    position: 'top-right', // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
    showClose: true,
    onClose: undefined,
    onClick: undefined,
    offset: 0,
    appendTo: undefined,
    zIndex: 0,
    // 設定值
    ...options
  })
}

/**
 * @see https://element-plus.org/en-US/component/message.html
 * @description 提示:懸浮文字-畫面中央
 * @param options options 自訂選項
 * @returns {MessageHandler}
 */
export const message = (options: MessageOptions): MessageHandler => {
  const defaultOPtions = {
    // 'success' | 'warning' | 'info' | 'error' | ''
    type: 'info',
    icon: '',
    message: '',
    showClose: true
  } as Partial<MessageOptions>

  return ElMessage({
    ...defaultOPtions,
    ...options
  })
}

/**
 * @author Caleb
 * @description 取得 Proxy 中的數據
 * @param {Object} value 被代理的數據
 * @returns {*} 解開代理後的資料
 */
export const getProxyData = <T = any>(value: typeof Proxy | any): T => {
  const rawValue = value
  try {
    return JSON.parse(JSON.stringify(rawValue))
  } catch (e) {
    console.warn('getProxyData 失敗：資料可能有循環參照，無法 JSON.stringify', e)
    return rawValue
  }
}

export type DeepCloneOptions = {
  version?: 'string'
  reactType: 'keep' | 'not' | 'new'
}

/**
 * @author Caleb
 * @description 拷貝 array 或 object
 * @param {Object | Array} targetElement 需要被拷貝的對象
 * @param {Object | Array} origin 拷貝來源
 * @returns {Object} 拷貝完的物件
 */
const deepClone_v1 = <T = any>(targetElement: any, origin: T): T => {
  // 檢驗 拷貝是否相同
  const toStr = Object.prototype.toString
  const [targetElementType, originType] = [toStr.call(targetElement), toStr.call(origin)]
  if (targetElementType !== originType) {
    tipLog('資料類型不同 deepClone', [
      '建議 targetElement 與 origin 是一樣的類型',
      `targetElement 的類型 => ${targetElementType}`,
      `origin 的類型 => ${originType}`
    ])
    console.trace({ targetElement, origin })
  }

  // 拷貝資料
  function __deepClone__ (obj: any, cache = new WeakMap()) {
    if (cache.has(obj)) return cache.get(obj)

    if (
      obj === null ||
      typeof obj !== 'object' ||
      typeof obj === 'function'
    ) {
      return obj
    }

    // 處理 Vue 的 ref/reactive/proxy
    if (isRef(obj)) {
      return __deepClone__(unref(obj), cache)
    }
    if (isReactive(obj) || isProxy(obj)) {
      obj = toRaw(obj)
    }

    // 建立對應型別的新容器
    const result = Array.isArray(obj) ? [] : new obj.constructor()

    // 防止無限 clone, 自己 clone 自己
    cache.set(obj, result)

    for (const key of Reflect.ownKeys(obj)) {
      const value = obj[key]
      result[key] = __deepClone__(value, cache)
    }
    return result
  }
  const target = __deepClone__(unref(origin))

  // 將結果寫入原本的 targetElement
  if (isRef(targetElement)) {
    targetElement.value = target
  } else if (Array.isArray(targetElement)) {
    targetElement.splice(0, targetElement.length, ...target)
  } else if (typeof targetElement === 'object' && targetElement !== null) {
    Object.assign(targetElement, target)
  }

  return target as T
}

/**
 * @author Howard
 * @description 拷貝 array 或 object
 * @param {Object | Array} targetElement 需要被拷貝的對象
 * @param {Object | Array} origin 拷貝來源
 * @param {Object} options 其他參數
 * @returns {Object} 拷貝完的物件
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deepClone_v2 = <T = any>(targetElement: any, origin: T, options?: DeepCloneOptions): T => {
  const getType = (element: any) => Object.prototype.toString.call(element)
  const targetElementType = getType(targetElement)
  const originType = getType(origin)

  if (targetElementType !== originType) {
    tipLog('無法執行 deepClone', [
      'targetElement 需要與 origin 為一樣的類型才能拷貝',
      `targetElement 的類型 => ${targetElementType}`,
      `origin 的類型 => ${originType}`
    ])
    console.trace({ targetElement, origin })
  }
  // 防止無窮遞迴 紀錄複製過的物件 取得複製後的新物件
  const addressMap = new WeakMap()

  // 建立新物件並複製舊物件的值
  const cloneObject = (_obj:any) => {
    if(addressMap.has(_obj)) return addressMap.get(_obj)
    const newObject = new (_obj).constructor()
    for (const prop in _obj) {
      if (!hasOwnProperty(_obj, prop)) return
      newObject[prop] = _deepClone(_obj[prop])
    }
    addressMap.set(_obj, newObject)
    return newObject
  }

  const _deepClone = (_origin: any) => {
    switch(getType(_origin)) {
      // 如果是 Array | Object 則建立回傳新的物件
      case '[object Array]': // cloneArray(_origin as Array<any>)
      case '[object Object]': return cloneObject(_origin) // cloneObject(_origin as Record<any, any>)
      default: return _origin
    }
  }

  const cloneElement = _deepClone(origin)
  switch (targetElementType) {
    case '[object Array]': {
      targetElement.splice(0)
      cloneElement.forEach(element => targetElement.push(element))
    }
    case '[object Object]': {
      Object.keys(targetElement).forEach(prop => delete targetElement[prop])
      Object.assign(targetElement, cloneElement)
    }
  }
  return targetElement as T
}

export const deepClone = <T = any>(targetElement: any, origin: T, options?: DeepCloneOptions): T => {
  if (!options) return deepClone_v1(targetElement, origin)
  return deepClone_v2(targetElement, origin, options)
}

/**
 * @author Caleb
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
 * @description 移動到指定的Dom元素 預設跑到專案最上面
 * @param {Element} el Dom元素 <div>
 * @param {Object} options 選項
 *  behavior: auto, smooth
 *  block: start, center, end, nearest
 *  inline: start, center, end, nearest'
 */
export const scrollToEl = (
  el: (Element | null) = document.querySelector('#app'),
  options: ScrollIntoViewOptions = {}
): void => {
  if (el === null) return

  const setting: ScrollIntoViewOptions = {
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest',
    ...options
  }
  const elType = Object.prototype.toString.call(el)
  const re = new RegExp('Element')

  try {
    if (re.test(elType)) {
      el.scrollIntoView(setting)
    } else {
      throw `無法執行 scrollToEl, ${el}: ${elType}`
    }
  } catch (e) {
    console.warn(e)
  }
}

/**
 * @author Caleb
 * @description 手動將資料 依照分頁資訊 做切割
 * @param {Number} page 當前頁碼
 * @param {Number} size 顯示筆數
 * @param {Array} data 資料
 * @returns {Array} 切完後的資料
 */
export const cutTableData = (page: number, size: number, data: any[]): any[] => {
  const start = (page - 1) * size
  const end = start + size

  if (size <= -1) return data.slice(start)
  return data.slice(start, end)
}

/**
 * @author Caleb
 * @coauthor Howard
 * @see https://github.com/brix/crypto-js
 * @description 使用 AES 加密資料
 * @param {String} str 要加密的字串
 * @param {String} key 加密用的key
 * @returns {String} 回傳的值
 */
export const aesEncrypt = (str: string, key: string): string => {
  try {
    const encodeStr = encodeURIComponent(str)
    const ciphertext = cryptoJS.AES.encrypt(encodeStr, `${key}`).toString()
    // console.log('EncodeStr', str, '=>', encodeStr, ciphertext)
    return ciphertext

  } catch (e) {
    console.trace(e)
    return ''
  }
}

/**
 * @author Caleb
 * @coauthor Howard
 * @see https://github.com/brix/crypto-js
 * @description 使用 AES 解密資料
 * @param {String} str 加密後的字串
 * @param {String} key 加密用的key
 * @returns {String} 回傳的值
 */
export const aesDecrypt = (str: string, key: string): string => {
  try {
    const bytes = cryptoJS.AES.decrypt(str, `${key}`)
    const encodeStr = bytes.toString(cryptoJS.enc.Utf8)
    const decodeStr = decodeURIComponent(encodeStr)
    // console.log('DecodeStr', str, '=>', bytes, encodeStr, decodeStr)
    return decodeStr

  } catch (e) {
    console.trace(e)
    return ''
  }
}

/**
 * @author Caleb
 * @description 複製文字
 * @param text 文字
 */
export const copyText = async (text: string): Promise<string> => {
  try {
    if (!isEmpty(navigator.clipboard)) {
      await navigator.clipboard.writeText(text)
    } else {
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', text)
      input.select()

      if (document.execCommand('copy')) {
        document.execCommand('copy')
      }
      document.body.removeChild(input)
    }

    ElNotification({
      type: 'success',
      title: 'Copy Success',
      message: text
    })

    return text
  } catch (e) {
    console.trace(e)

    ElNotification({
      type: 'warning',
      title: 'Copy Warning',
      message: text
    })
    return text
  }
}

/**
 * @author Caleb
 * @description 反轉陣列資料
 * @param {Array} list 陣列資料
 * @returns {Array} 反轉後 陣列資料
 */
export const reverse = (list: Array<any>): Array<any> => {
  if (list.length === 0) return []
  const temp = list.shift()
  return [...reverse(list), temp]
}

/**
 * @author Caleb
 * @description 等待時間:可配合 async await 使用 🕒
 * @param time 等待時間(毫秒)
 * @returns {Number} 等待時間
 */
export const awaitTime = (time: number): Promise<number> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(time)
    }, time)
  })
}

/**
 * @author Caleb
 * @description 透過點擊<a></a>下載檔案
 * @param {String} filePath 檔案路徑
 * @param {String} fileName 檔案名稱
 */
export const downloadFile = (filePath: string, fileName: string): void => {
  const a = document.createElement('a')
  a.href = filePath
  a.setAttribute('target', '_blank')
  a.setAttribute('download', `${fileName}`)

  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

/**
 * @author Caleb
 * @description 下載路徑轉換
 * 1. 路徑依據 BASE_URL
 * 2. url是 // 取代變成 /
 *
 * 如果
 * 1. VITE_API_SYSTEM_URL(vite.config.ts 中的 base) 是 '' 或 '/', BASE_URL = '/'
 * 2. filePath = /...
 * 結果
 * fetchPath = //... (無法取得檔案)
 *
 * @param {String} filePath 檔案路徑
 */
export const getPublicFileUrl = (filePath: string): string => {
  const baseUrl = `${window.location.origin}`
  const url = `${import.meta.env.BASE_URL}${filePath}`
  const fetchPath = new URL(url.replace(/\/\//g, '/'), baseUrl).href
  return fetchPath
}

/**
 * @author Caleb
 * @description 取得檔案路徑 /public/... 📂
 * @param {String} filePath 檔案路徑
 * @returns {Promise<any>} 檔案
 */
export const fetchPublicFileUrl = async (filePath: string): Promise<string> => {
  const fetchPath = getPublicFileUrl(filePath)

  try {
    const response = await fetch(fetchPath, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
    if (!response.ok) throw new Error(`HTTP Error status: ${response.status}`)

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    return url
  } catch (error) {
    message({
      type: 'error',
      message: `<div class="idb-message">
        <h2>Download File Error: ${filePath}</h2>
        <div>${error}</div>
      </div>`,
      dangerouslyUseHTMLString: true,
      duration: 10000
    })
    console.error(error)
  }
}

/**
 * @author Caleb
 * @description 取得JSON檔案 /public/... 📂
 * @param {String} filePath 檔案路徑
 * @returns {Promise<any>} 檔案
 */
export const fetchPublicJsonFile = async <T = any>(filePath: string): Promise<T> => {
  const fetchPath = getPublicFileUrl(filePath)

  try {
    const response = await fetch(fetchPath, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json;charset=utf8'
      }
    })
    if (!response.ok) throw new Error(`HTTP Error status: ${response.status}`)

    const data = await response.json()
    return data
  } catch (error) {
    message({
      type: 'error',
      message: `<div class="idb-message">
        <h2>Download File Error: ${filePath}</h2>
        <div>${error}</div>
      </div>`,
      dangerouslyUseHTMLString: true,
      duration: 10000
    })
    console.error(error)
  }
}

/**
 * @author Caleb
 * @description 取得假資料JSON /public/fakeData/...
 * @param filePath 假資料路徑
 * @returns {*} 假資料
 */
export const fetchFakeData = async<T = any>(filePath: string): Promise<T> => {
  const fakeData = await fetchPublicJsonFile(`/fakeData${filePath}`)
  if (typeof fakeData === 'string') return JSON.stringify(fakeData) as T
  return fakeData as T
}

/**
 * @description 系統重新整理
 * 目前沒有額外處理其他事
 */
export const webReload = () => {
  // 重新整理
  window.location.reload()

  // window.location.replace(window.location.href)
  // const href = window.location.pathname + '?cache=' + new Date().getTime()
  // window.location.href = href
  // window.location.assign(href)
}

/**
 * @deprecated 無法使用 🚫
 * @author Caleb
 * @description 列印
 * @param {Element} printElement 要列印的元素
 */
export const printElement = (printElement: Element) => {
  // 獲取每個元素的計算樣式，並生成 CSS 規則
  const styles = ''

  // 列印
  const iframe: any = document.createElement('iframe')
  iframe.style.display = 'none'
  document.body.appendChild(iframe)

  const iframeDoc: any = iframe.contentWindow?.document
  iframeDoc.open()

  iframeDoc.write(`<html>
    <head>
      <style>${styles}</style>
    </head>
    <body>
      ${printElement.innerHTML}
    </body>
  </html>`)

  iframeDoc.close()

  iframe.contentWindow?.focus() // 確保 iframe 是焦點
  iframe.contentWindow?.print()  // 調用 iframe 的打印方法

  document.body.removeChild(iframe)
}
