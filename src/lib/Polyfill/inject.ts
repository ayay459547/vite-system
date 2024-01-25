import fill from './Array/fill'
import includes from './Array/includes'
import map from './Array/map'

import entries from './Object/entries'
import keys from './Object/keys'
import values from './Object/values'

const injectList = [
  // Array
  fill,
  includes,
  map,
  // Object
  entries,
  keys,
  values
]

injectList.forEach(injectItem => {
  if (typeof injectItem === 'function') {
    injectItem()
  }
})
