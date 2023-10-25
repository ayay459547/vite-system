import type { Composer, ComposerTranslation } from 'vue-i18n'
import { useI18n } from 'vue-i18n'
import { useSlots, customRef, reactive, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type { LangMap } from '@/i18n'
import { getI18nMessages } from '@/i18n'

import type { SweetAlertOptions } from 'sweetalert2'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid'
import type { ResizeObserverCallback } from '@/lib/lib_throttle'
import throttle from '@/lib/lib_throttle'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

import AES from 'crypto-js/aes'
import Utf8 from 'crypto-js/enc-utf8'

// 使用加上 .call
export const hasOwnProperty = Object.prototype.hasOwnProperty

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
        if (hasOwnProperty.call(value, key)) return true
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
        if (hasOwnProperty.call(value, key)) return false
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
 * @returns {String}
 */
export const getUuid = (): string => {
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
  return hasOwnProperty.call(slots, prop)
}

const mode = (import.meta as any).env.MODE

/**
 * @author Caleb
 * @description 系統開發中提示用log
 * @param {String} title 主要提示
 * @param {Array} messages 訊息列表
 */
export const tipLog = (title: string = '', messages: string[] = []): void => {
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
}

export type LogType = 'info' | 'warn' | 'error' | 'table' | 'trace'
/**
 * @author Caleb
 * @description 系統用顯示log 打包後不顯示
 * @param {*} value 任意值
 * @param {String} type log類型
 * @param {String} style 樣式
 * @returns {String} 系統mode
 */
export const systemLog = (value: any, type: LogType = 'info', style: string = ''): string => {
  if (mode === 'production') return 'production'

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
 * @description 拷貝 array 或 object
 * @param {Object | Array} targetElement 需要被拷貝的對象
 * @param {Object | Array} origin 拷貝來源
 * @returns {Object} 拷貝完的物件
 */
export const deepClone = (targetElement: any, origin: any): any => {
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
    if (hasOwnProperty.call(origin, prop)) {
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
  return target
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

export type PageI18n = Partial<Composer & {
  i18nTranslate: I18nTranslate,
  i18nTest: I18nTest
}>
/**
 * @author Caleb
 * @description 針對各頁面 設定翻譯 不影響其他地方
 * @param {Object} langMap 設定key 對應的語言顯示的資料
 * @returns {Object} 翻譯工具
 */
export const usePageI18n = (langMap: LangMap): PageI18n => {
  const pageI18n = useI18n({
    messages: getI18nMessages(langMap)
  }) as Partial<Composer>

  return {
    ...pageI18n,
    i18nTranslate: pageI18n.t,
    i18nTest: pageI18n.te
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
 * @description 下載靜態檔案 檔案放在 pubic/static 下
 * @param {String} fileName 檔案名
 */
export const downloadStaticFile = (fileName: string) => {
  const a = document.createElement('a')

  a.href = `/static/file/${fileName}`

  a.download = `${fileName}`
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
 * @param {*} value 資料
 * @param {String} key 加密用的key
 * @returns {String} 回傳的值
 */
export const aesEncrypt = (value: any, key: string): string => {
  const data = JSON.stringify(value)

  return AES.encrypt(data, key).toString()
}

/**
 * @author Caleb
 * @description 使用 AES 解密資料
 * @param {String} value 加密後的字串
 * @param {String} key 加密用的key
 * @returns {*} 回傳的值
 */
export const aesDecrypt = (value: string, key: string): any => {
  // 去掉換行
  const _value = value.replace(/n*$/g, '').replace(/\n/g, '')
  const _key = key.replace(/n*$/g, '').replace(/\n/g, '')

  const data = AES.decrypt(_value, _key).toString(Utf8)

  if (isEmpty(data)) return data
  return JSON.parse(data)
}

/**
 * @author Caleb
 * @description ref debounce
 * @param {*} value 資料
 * @returns {*}
 */
export function useDebouncedRef (value: any): Ref<any> {
  let timeout: any

  return customRef((track, trigger) => {
    return {
      get () {
        track()
        return value
      },
      set (newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, 200)
      }
    }
  })
}

/**
 * @author Caleb
 * @description 給 Dom元素 自動監聽大小變化
 *              需在 setup 中執行
 * @param {*} domRef Dom元素
 * @returns {Object} 大小
 */
export function useResize (domRef: Ref<Element>): {
  width: number
  height: number
} {
  const domSize = reactive({
    width: 0,
    height: 0
  })

  const ROcallback = throttle((entries: ResizeObserverEntry[]) => {
    entries.forEach((entry) => {
      domSize.width = entry.contentRect.width
      domSize.height = entry.contentRect.height
    })
  }, 100) as ResizeObserverCallback

  const RO = new ResizeObserver(ROcallback)

  onMounted(() => {
    if (!isEmpty(domRef.value)) {
      RO.observe(domRef.value)
    }
  })

  onUnmounted(() => {
    if (RO) {
      RO.disconnect()
    }
  })

  return domSize
}
