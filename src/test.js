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