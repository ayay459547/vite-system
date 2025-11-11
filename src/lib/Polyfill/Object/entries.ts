const entries = () => {
  if (!Object.entries) {
    Object.defineProperty(Object.prototype, 'entries', {
      value: function (obj: any) {
        obj = Object(obj)
        const keys = Object.keys(obj)
        const length = keys.length
        const rst = []
        for (let i = 0; i < length; i++) {
          rst[i] = [keys[i], obj[keys[i]]]
        }
        return rst
      }
    })
  }
}

export default entries
