const values = () => {
  if (!Object.values) {
    Object.defineProperty(Object.prototype, 'values', {
      value: function (obj: any) {
        obj = Object(obj)
        const keys = Object.keys(obj)
        const length = keys.length
        const values = []
        for (let i = 0; i < length; i++) {
          values[i] = obj[keys[i]]
        }
        return values
      }
    })
  }
}

export default values
