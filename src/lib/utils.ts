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
  return (target as T)
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
    block: 'start',
    inline: 'nearest',
    ...options
  }
  const re = new RegExp('Element')

  if (re.test(Object.prototype.toString.call(el))) {
    el.scrollIntoView(setting)
  }
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
