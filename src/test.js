const reverse = (data) => {
  if (data.length === 0) return []
  const temp = data.shift()
  return [...reverse(data), temp]
}

console.log(reverse([1, 2, 3]))

class Person {
  constructor (name, age) {
    this.name = name
    this.age = age
  }
}

const p1 = new Person('小名', 16)
const p2 = new Person('小其', 26)
console.log(p1.name)
console.log(Object.prototype.toString.call(p2))

const baseRoutes = [
  {
    path: '',
    redirect: { name: 'home' }
  },
  {
    name: 'home',
    meta: {
      title: '首頁'
    },
    path: '/home'
  },
  {
    name: 'login',
    meta: {
      title: '登入'
    },
    path: '/login'
  },
  {
    name: 'noPermissions',
    meta: {
      title: '無此權限'
    },
    path: '/noPermissions'
  },
  {
    name: 'page404',
    meta: {
      title: '404'
    },
    path: '/page404'
  },
  {
    path: '/:pathMatch(.*)',
    redirect: { name: 'page404' }
  }
]

const baseRoutesName = baseRoutes.reduce((res, curr) => {
  const routeName = curr.name
  if (routeName) {
    res.push(routeName)
  }
  return res
}, [])

console.log(baseRoutesName)

const temp = { value: '' }
const testProxy = new Proxy(temp, {
  get (obj, prop) {
    if (prop === 'value') return obj[prop]
    return 'input.value'
  },
  set (obj, prop, value) {
    obj.value = value.trim()
  }
})

testProxy.value = ' 789'
console.log(testProxy.value)