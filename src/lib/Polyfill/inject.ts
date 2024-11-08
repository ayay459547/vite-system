// import fill from './Array/fill'
import findLast from './Array/includes'
// import includes from './Array/includes'
// import map from './Array/map'

// import keys from './Object/keys'
// import values from './Object/values'
// import entries from './Object/entries'

const injectList = [
  // fill,
  findLast
  // includes,
  // map,

  // keys,
  // values,
  // entries
]

injectList.forEach(injectItem => {
  if (typeof injectItem === 'function') {
    injectItem()
  }
})
