import injectFill from './Array/injectFill'
import injectIncludes from './Array/injectIncludes'

const injectFunction = {
  fill: injectFill,
  includes: injectIncludes
}

for (const key in injectFunction) {
  if (!Array.prototype[key]) {
    injectFunction[key]()
  }
}

export default injectFunction