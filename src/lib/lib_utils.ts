import { useSlots } from 'vue'

import type { Composer, ComposerTranslation } from 'vue-i18n'
import { useI18n } from 'vue-i18n'
import type { SweetAlertOptions } from 'sweetalert2'
import Swal from 'sweetalert2'

import type {
  NotificationOptions,
  NotificationOptionsTyped,
  NotificationHandle,
  MessageOptions,
  MessageHandler
} from 'element-plus'
import { ElNotification, ElMessage } from 'element-plus'

// import AES from 'crypto-js/aes'
// import Utf8 from 'crypto-js/enc-utf8'
import cryptoJS from 'crypto-js'
import { v4 as uuidv4 } from 'uuid'

import type { LangMap } from '@/i18n'
import { getI18nMessages } from '@/i18n'

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
 * @description 判斷東西是否有值
 * @param {*} value
 * @returns {Boolean}
 */
export const isSet = (value: any): boolean => {
  if ([null, undefined].includes(value)) return false
  const type = getType(value)

  switch (type) {
    case 'Array':
    case 'String':
      if (value.length > 0) return true
      return false
    case 'Object':
      for (const key in value) {
        if (hasOwnProperty(value, key)) return true
      }
      return false
    case 'Number':
      if (!isNaN(parseInt(value))) return true
      return false
    default:
      return true
  }
}

/**
 * @author Caleb
 * @description 判斷東西是否為空
 * @param {*} value
 * @returns {Boolean}
 */
export const isEmpty = (value: any): boolean => {
  if ([null, undefined].includes(value)) return true
  const type = getType(value)

  switch (type) {
    case 'Array':
    case 'String':
      if (value.length > 0) return false
      return true
    case 'Object':
      for (const key in value) {
        if (hasOwnProperty(value, key)) return false
      }
      return true
    case 'Number':
      if (!isNaN(parseInt(value))) return false
      return true
    default:
      return false
  }
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

/**
 * @author Caleb
 * @description 判斷 slot 是否存在
 * @param {String} prop slot 名稱
 * @returns {Boolean}
 */
export const hasSlot = (prop: string): boolean => {
  const slots = useSlots()
  return hasOwnProperty(slots, prop)
}

const mode = (import.meta as any).env.MODE

/**
 * @author Caleb
 * @description 系統開發中提示用log
 * @param {String} title 主要提示
 * @param {Array} messages 訊息列表
 */
export const tipLog = (title: string = '', messages: string[] = []): string => {
  if (mode !== 'development') return mode

  const style = `
    font-size: 1.2em;
    color: #f89898;
  `
  console.groupCollapsed('%c%s', style, `開發中提示：${title}`)
  messages.forEach(message => {
    console.log('%c%s', style, message)
  })
  console.groupEnd()

  return mode as string
}

export type LogType = 'info' | 'warn' | 'error' | 'table' | 'trace'
/**
 * @author Caleb
 * @description 系統用顯示log
 * @param {*} value 任意值
 * @param {String} type log類型
 * @param {String} style 樣式
 * @returns {String} 系統mode
 */
export const systemLog = (value: any, type: LogType = 'info', style: string = ''): string => {
  if (mode !== 'development') return mode

  switch (type) {
    case 'info':
      console.info('%c%s', style, value)
      break
    case 'warn':
      console.warn('%c%s', style, value)
      break
    case 'error':
      console.error('%c%s', style, value)
      break
    case 'table':
      console.table(value)
      break
    case 'trace': // 知道誰呼叫此函數
      console.trace('%c%s', style, value)
      break
    default:
      console.log('%c%s', style, value)
      break
  }

  return mode as string
}

/**
 * @author Caleb
 * @description 數字取四捨五入到第n位
 * @param {Number} num 要四捨五入的數字
 * @param {Number} n 取小數點到第n位
 * @returns {Number}
 */
export const round = (num: number, n: number = 2): number => {
  return +(Math.round((num + `e+${n}`) as unknown as number)  + `e-${n}`)
}

/**
 * @author Caleb
 * @description 數字取無條件捨去到第n位
 * @param {Number} num 要無條件捨去的數字
 * @param {Number} n 取小數點到第n位
 * @returns {Number}
 */
export const floor = (num: number, n: number = 2): number => {
  return +(Math.floor((num + `e+${n}`) as unknown as number)  + `e-${n}`)
}

/**
 * @author Caleb
 * @description 數字取無條件進位到第n位
 * @param {Number} num 要無條件進位的數字
 * @param {Number} n 取小數點到第n位
 * @returns {Number}
 */
export const ceil = (num: number, n: number = 2): number => {
  return +(Math.ceil((num + `e+${n}`) as unknown as number)  + `e-${n}`)
}

/**
 * @author Caleb
 * @description Swal 互動式彈窗
 * @param {Object} options 自訂選項
 * @returns {Promise}
 */
export const swal = (options: SweetAlertOptions<any, any>): Promise<any> => {
  const defaultOPtions = {
    // icon 類型
    // info, warning, success, error, question
    reverseButtons: true,
    confirmButtonText: '確認',
    confirmButtonColor: '#409eff',
    showCancelButton: true,
    cancelButtonText: '取消',
    ...options
  }

  return Swal.fire({ ...defaultOPtions })
}

/**
 * @author Caleb
 * @description https://element-plus.org/en-US/component/notification.html
 * @param options options 自訂選項
 * @returns {NotificationHandle}
 */
export const notification = (options: Partial<NotificationOptions>): NotificationHandle => {
  const defaultOPtions = {
    // 'success' | 'warning' | 'info' | 'error' | ''
    type: '',
    icon: '',
    title: '',
    message: ''
  } as Partial<NotificationOptionsTyped>

  return ElNotification({
    ...defaultOPtions,
    ...options
  })
}

/**
 * @author Caleb
 * @description https://element-plus.org/en-US/component/message.html
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

  const targetElementType = toStr.call(targetElement)
  const originType = toStr.call(origin)
  if (targetElementType !== originType) {
    tipLog('無法執行 deepClone', [
      'targetElement 需要與 origin 為一樣的類型才能拷貝',
      `targetElement 的類型 => ${targetElementType}`,
      `origin 的類型 => ${originType}`
    ])
  }

  const target = targetElement

  function setFun (
    obj: Array<any> | Record<any, any>,
    key: string | number,
    value: any
  ): void {
    obj[key] = value
  }

  for (const prop in origin) {
    if (hasOwnProperty(origin, prop)) {
      switch (toStr.call(target[prop])) {
        case '[object Array]':
        case '[object Object]':
          switch (toStr.call(origin[prop])) {
            case '[object Array]':
            case '[object Object]':
              target[prop] = new (origin[prop] as any).constructor()
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
  return target as T
}

/**
 * @author Caleb
 * @description 移動到指定的Dom元素 預設跑到專案最上面
 * @param {Element} el Dom元素 <div>
 * @param {Object} options 選項
 *  behavior: auto, smooth
 *  block: start, center, end, nearest
 *  inline: start, center, end, nearest'
 */
export const scrollToEl = (el: Element = document.querySelector('#app'), options: ScrollIntoViewOptions = {}): void => {
  const setting: ScrollIntoViewOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
    ...options
  }
  const re = new RegExp('Element')

  if (re.test(Object.prototype.toString.call(el))) {
    el.scrollIntoView(setting)
  } else {
    tipLog('無法執行 scrollToEl', [
      '請給 html 的 dom 物件',
      `傳入參數: ${el} => ${getType(el)}`
    ])
  }
}

export type I18nTranslate = ComposerTranslation
export type I18nTest = (key: string) => boolean

export type LocalI18n = Partial<Composer & {
  i18nTranslate: I18nTranslate,
  i18nTest: I18nTest
}>
/**
 * @author Caleb
 * @description 針對區域 設定翻譯 不影響其他地方
 * @param {Object} langMap 設定key 對應的語言顯示的資料
 * @returns {Object} 翻譯工具
 */
export const useLocalI18n = (langMap: LangMap): LocalI18n => {
  const localI18n = useI18n({
    useScope: 'local',
    messages: getI18nMessages(langMap)
  }) as Partial<Composer>

  return {
    ...localI18n,
    i18nTranslate: localI18n.t,
    i18nTest: localI18n.te
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

  return data.slice(start, end)
}

/**
 * @author Caleb
 * @description 點擊連結 下載檔案
 * @param {String} path 路徑
 */
export const downloadFile = (path: string, fileName: string): void => {
  const a = document.createElement('a')

  a.href = `${path}`
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
 * @description 使用 AES 加密資料
 * @param {String} str 要加密的字串
 * @param {String} key 加密用的key
 * @returns {String} 回傳的值
 */
export const aesEncrypt = (str: string, key: string): string => {
  // const encJson = cryptoJS.AES.encrypt(str, key).toString()
  // const encData = cryptoJS.enc.Base64.stringify(cryptoJS.enc.Utf8.parse(encJson))
  // return encData

  const utf8data = cryptoJS.enc.Utf8.parse(str)
  const encData = cryptoJS.AES.encrypt(utf8data, `__${key}__`)
  return encData
}

/**
 * @author Caleb
 * @description 使用 AES 解密資料
 * @param {String} str 加密後的字串
 * @param {String} key 加密用的key
 * @returns {String} 回傳的值
 */
export const aesDecrypt = (str: string, key: string): string => {
  try {
    // const decData = cryptoJS.enc.Base64.parse(str).toString(cryptoJS.enc.Utf8)
    // const decJson = cryptoJS.AES.decrypt(decData, key).toString(cryptoJS.enc.Utf8)
    // return decJson

    const decrypted = cryptoJS.AES.decrypt(str, `__${key}__`)
    const decryptedData = cryptoJS.enc.Utf8.stringify(decrypted)
    return decryptedData

  } catch (error) {
    console.log(error)

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
      title: '複製文字成功',
      message: text
    })

    return text
  } catch (err) {

    ElNotification({
      type: 'error',
      title: '複製文字失敗',
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
