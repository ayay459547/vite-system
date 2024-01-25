/* eslint-disable prefer-rest-params */

const keys = () => {
  if (!Object.keys) {
    Object.defineProperty(Object.prototype, 'keys', {
      value: function () {
        'use strict'
        const hasOwnProperty = Object.prototype.hasOwnProperty
        // eslint-disable-next-line no-prototype-builtins
        const hasDontEnumBug = !{ toString: null }.propertyIsEnumerable('toString')
        const dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ]
        const dontEnumsLength = dontEnums.length

        return function (obj: any) {
          if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
            throw new TypeError('Object.keys called on non-object')
          }

          const result = []
          let prop = null
          let i = null

          for (prop in obj) {
            if (hasOwnProperty.call(obj, prop)) {
              result.push(prop)
            }
          }

          if (hasDontEnumBug) {
            for (i = 0; i < dontEnumsLength; i++) {
              if (hasOwnProperty.call(obj, dontEnums[i])) {
                result.push(dontEnums[i])
              }
            }
          }
          return result
        }
      }
    })
  }
}

export default keys
