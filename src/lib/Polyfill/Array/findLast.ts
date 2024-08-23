/* eslint-disable prefer-rest-params */

const findLast = () => {
  // @ts-ignore
  if (!Array.prototype.findLast) {
    Object.defineProperty(Array.prototype, 'findLast', {
      value: function (callback: (value: any, index: number, that: any) => boolean): any | undefined {
        if (this === null) {
          throw new TypeError('this is null or not defined')
        }

        const arr = Object(this)
        const len = arr.length >>> 0
        for (let i = len - 1; i >= 0; i--) {
          if (callback(arr[i], i, arr)) {
            return arr[i]
          }
        }
        return undefined
      }
    })
  }
}

export default findLast
