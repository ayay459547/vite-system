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
 *              不包含原型鏈上的屬性
 * @param {Object} obj 物件
 * @param {String} key 屬性
 * @returns {Boolean}
 */
export const hasOwnProperty = (obj: any, key: string): boolean => {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

/**
 * @author Caleb
 * @description 取的準確的資料類型
 * @param {*} value
 * @returns {String} 類型
 */
export const getType = (value: any): string => {
  const stringType = Object.prototype.toString.call(value)
  const regexp = /[\s]{1}([A-Z|a-z]*)(?=\])/
  const res = stringType.match(regexp)
  return res[1]
}

/**
 * @author Caleb
 * @description 判斷東西是否為空
 * @param {*} value
 * @returns {Boolean}
 */
export const isEmpty = (value: any): boolean => {
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
 * @author Caleb
 * @description 判斷東西是否有值
 * @param {*} value
 * @returns {Boolean}
 */
export const isSet = (value: any): boolean => {
  return !isEmpty(value)
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
  if (!isEmpty(text) && typeof text === 'string') {
    return `${text}-${uuidv4()}`
  }
  return uuidv4()
}

const mode = (import.meta as any).env.MODE

export type ConsoleType = keyof Console

/**
 * @author Caleb
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/console
 * @description 系統用顯示log
 * @param {*} value 任意值
 * @param {ConsoleType} consoleType log類型
 * @param {String} style 樣式
 * @returns {String} 系統mode
 */
export const systemLog = (value: any, consoleType?: ConsoleType, style?: string): string => {
  if (mode !== 'development') return mode

  /**
   * 基本
   * console.log()：最常用的，用來輸出訊息
   * console.error()：用來輸出錯誤訊息，通常在 console 中以紅色顯示
   * console.warn()：用來輸出警告訊息，通常以黃色顯示
   * console.info()：用來輸出一般資訊，與 console.log 類似
   *
   * 特殊
   * console.table()：以表格形式輸出數組或物件的內容
   * console.dir()：用來顯示物件的屬性
   * console.assert()：用來進行條件判斷，如果條件為 false，則輸出錯誤訊息
   * console.group() + console.groupEnd()：用來將輸出訊息分組顯示
   * console.clear()：清空 console
   *
   * Debug
   * console.trace()：用來知道函數呼叫鍊
   *
   * 效能
   * console.time() + console.timeLog() + console.timeEnd()：用來測量程式執行時間
   * console.count() + console.countReset()：用來計算
   */
  if (typeof consoleType === 'string' && hasOwnProperty(console, consoleType)) {
    if (typeof style === 'string' && style.length > 0) {
      console[(consoleType as any)]('%c%s', style, value)
    } else {
      console[(consoleType as any)](value)
    }
  } else {
    console.log(value)
  }

  return mode as string
}

/**
 * @author Caleb
 * @description 系統開發中提示用log
 * @param {String} title 主要提示
 * @param {Array} messages 訊息列表
 */
export const tipLog = (title: string = '', messages: any[] = [], consoleType?: ConsoleType, style?: string): string => {
  if (mode !== 'development') return mode

  const titleStyle = `
    font-size: 1.2em;
    color: #f89898;
  `
  const _style = (typeof style === 'string' && style.length > 0) ? style : ''

  console.groupCollapsed('%c%s', titleStyle, `開發中提示：${title}`)
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
 * @author Caleb
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
 * @author Caleb
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
 * @description 拷貝 array 或 object
 * @param {Object | Array} targetElement 需要被拷貝的對象
 * @param {Object | Array} origin 拷貝來源
 * @returns {Object} 拷貝完的物件
 */
export const deepClone = <T = any>(targetElement: any, origin: T): T => {
  const toStr = Object.prototype.toString

  // 檢驗 拷貝是否相同
  const [targetElementType, originType] = [
    toStr.call(targetElement),
    toStr.call(origin)
  ]
  if (targetElementType !== originType) {
    tipLog('無法執行 deepClone', [
      'targetElement 需要與 origin 為一樣的類型才能拷貝',
      `targetElement 的類型 => ${targetElementType}`,
      `origin 的類型 => ${originType}`
    ])
  }

  const target = targetElement ?? (Array.isArray(targetElement) ? [] : {})

  // 設定值
  function setFun(obj: Array<any> | Record<any, any>, key: string | number, value: any): void {
    obj[key] = value
  }

  // 防止遞歸陷入循環
  const seen = new WeakMap()

  // 拷貝資料
  const _deepClone = (_target: any, _origin: any) => {
    if (seen.has(_target)) {
      return seen.get(_target)
    }
    seen.set(_target, toStr.call(_target))

    for (const _prop in _origin) {
      if (hasOwnProperty(_origin, _prop)) {
        switch (toStr.call(_target[_prop])) {
          case '[object Array]':
          case '[object Object]':
            switch (toStr.call(_origin[_prop])) {
              case '[object Array]':
              case '[object Object]':
                _target[_prop] = new (_origin[_prop] as any).constructor()
                _deepClone(_target[_prop], _origin[_prop])
                break
              default:
                setFun(_target, _prop, _origin[_prop])
                break
            }
            break
          default:
            setFun(_target, _prop, _origin[_prop])
            break
        }
      }
    }
  }
  _deepClone(target, origin)

  return target as T
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
  el: Element = document.querySelector('#app'),
  options: ScrollIntoViewOptions = {}
): void => {
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
    console.log(e)
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
 * @description 點擊連結 下載檔案
 * @param {String} path 路徑
 */
export const downloadFile = (path: string, fileName: string): void => {
  const a = document.createElement('a')
  a.href = path
  a.setAttribute('target', '_blank')
  a.setAttribute('download', `${fileName}`)

  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

/**
 * @author Caleb
 * @description 取得 Proxy 中的數據
 * @param {Object} value 被代理的數據
 * @returns {*} 解開代理後的資料
 */
export const getProxyData = <T = any>(value: typeof Proxy | any): T => {
  return JSON.parse(JSON.stringify(value))
}

/**
 * @author Caleb
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
    return ciphertext

  } catch (e) {
    console.trace(e)
    return ''
  }
}

/**
 * @author Caleb
 * @see https://github.com/brix/crypto-js
 * @description 使用 AES 解密資料
 * @param {String} str 加密後的字串
 * @param {String} key 加密用的key
 * @returns {String} 回傳的值
 */
export const aesDecrypt = (str: string, key: string): string => {
  try {
    const decodeStr = decodeURIComponent(str)
    const bytes = cryptoJS.AES.decrypt(decodeStr, `${key}`)
    const originalText = bytes.toString(cryptoJS.enc.Utf8)
    return originalText

  } catch (e) {
    console.trace(e)
    return null
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
 * @description 等待時間:可配合 async await 使用
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
 * @description 替換特殊字元
 * @param {String} string 原始文字
 * @returns {String} 替換後文字
 */
export const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * @author Caleb
 * @description 列印
 * @param {Element} printElement 要列印的元素
 */
export const printElement = (printElement: Element) => {
  // 獲取每個元素的計算樣式，並生成 CSS 規則
  const styles = ''

  // 列印
  const iframe = document.createElement('iframe') as HTMLIFrameElement
  iframe.style.display = 'none'
  document.body.appendChild(iframe)

  const iframeDoc = iframe.contentWindow.document
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

  iframe.contentWindow.focus() // 確保 iframe 是焦點
  iframe.contentWindow.print()  // 調用 iframe 的打印方法

  document.body.removeChild(iframe)
}
