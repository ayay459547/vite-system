/* eslint-disable prefer-rest-params */

const injectFill = () => {
  Object.defineProperty(Array.prototype, 'fill', {
    value: function (value: any) {

      // 步驟 1 - 2。
       if (this === null) {
        throw new TypeError('this is null or not defined')
      }

      const O = Object(this)

      // 步驟 3 - 5。
      const len = O.length >>> 0

      // 步驟 6 - 7。
      const start = arguments[1]
      const relativeStart = start >> 0

      // 步驟 8。
      let k = relativeStart < 0 ?
        Math.max(len + relativeStart, 0) :
        Math.min(relativeStart, len)

      // 步驟 9 - 10。
      const end = arguments[2]
      const relativeEnd = end === undefined ?
        len : end >> 0

      // 步驟 11。
      const final = relativeEnd < 0 ?
        Math.max(len + relativeEnd, 0) :
        Math.min(relativeEnd, len)

      // 步驟 12。
      while (k < final) {
        O[k] = value
        k++
      }

      // 步驟 13。
      return O
    }
  })
}

export default injectFill