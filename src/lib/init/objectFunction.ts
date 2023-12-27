/* eslint-disable no-prototype-builtins */
/* 讓 object 有類似 array 的方法 */

const objectFunction = {
  $forEach (callback: Function, thisArg: any) {
    thisArg = thisArg || window

    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        callback.call(thisArg, this[key], key, this)
      }
    }

    return this
  },
  $map (callback: Function, thisArg: any) {
    thisArg = thisArg || window

    const resObj = new (this as any).constructor()
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        resObj[key] = callback.call(thisArg, this[key], key, this)
      }
    }
    return resObj
  },
  $filter (callback: Function, thisArg: any) {
    thisArg = thisArg || window

    const resObj = new (this as any).constructor()
    for (const key in this) {
      if (this.hasOwnProperty(key) && callback.call(thisArg, this[key], key, this)) {
        resObj[key] = this[key]
      }
    }
    return resObj
  },
  // $some (callback: Function, thisArg: any) {
  //   thisArg = thisArg || window
  //   for (const key in this) {
  //     if (this.hasOwnProperty(key) && callback.call(thisArg, this[key], key, this)) {
  //       return true
  //     }
  //   }
  //   return false
  // },
  // $every (callback: Function, thisArg: any) {
  //   thisArg = thisArg || window
  //   for (const key in this) {
  //     if (this.hasOwnProperty(key) && !callback.call(thisArg, this[key], key, this)) {
  //       return false
  //     }
  //   }
  //   return true
  // },
  $reduce (callback: Function, temp: any, thisArg: any) {
    thisArg = thisArg || window
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        temp = callback.call(thisArg, temp, this[key], key)
      }
    }
    return temp
  }
}

const injectObjectFunction = () => {
  for (const key in objectFunction) {
    if (!Object.prototype[key]) {
      Object.defineProperty(Object.prototype, key, {
        get () {
          return objectFunction[key]
        }
      })
    }
  }
}

injectObjectFunction()

export default objectFunction
