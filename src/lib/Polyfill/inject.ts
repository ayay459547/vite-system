import injectFill from './Array/injectFill'
import injectIncludes from './Array/injectIncludes'

const injectFunction = {
  fill: () => {
    if (!Array.prototype.fill) {
      injectFill()
    }
  },
  includes: () => {
    if (!Array.prototype.includes) {
      injectIncludes()
    }
  }
}

for (const key in injectFunction) {
  injectFunction[key]()
}

export default injectFunction