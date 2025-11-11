import { describe, it, expect } from 'vitest'
import { ref, reactive } from 'vue'
import { hasOwnProperty, isEmpty, deepClone } from '@/lib/lib_utils'

// 測試 hasOwnProperty
describe('hasOwnProperty TEST', () => {
  const object1 = {
    prop: 'exists'
  }
  it('object1.prop', () => {
    expect(hasOwnProperty(object1, 'prop')).toBe(true)
  })
  it('object1.toString', () => {
    expect(hasOwnProperty(object1, 'toString')).toBe(false)
  })
})

// 測試 isEmpty
describe('isEmpty Test', () => {
  it('Array 測試', () => {
    const list1 = []
    expect(isEmpty(list1)).toBe(true)

    const list2 = [1, 2, 3]
    expect(isEmpty(list2)).toBe(false)
  })

  it('Object 測試', () => {
    const object1 = {}
    expect(isEmpty(object1)).toBe(true)

    const object2 = { a: 123, b: 456, c: 789 }
    expect(isEmpty(object2)).toBe(false)
  })

  it('String 測試', () => {
    const string1 = ''
    expect(isEmpty(string1)).toBe(true)

    const string2 = '123456'
    expect(isEmpty(string2)).toBe(false)
  })

  it('Number 測試', () => {
    const number1 = 0
    expect(isEmpty(number1)).toBe(false)

    const number2 = 1
    expect(isEmpty(number2)).toBe(false)
  })
})

describe('deepClone Test', () => {
  it('Array 測試', () => {
    const indexList = []
    for(let i = 0 ; i < 5; i++) { indexList.push(i) }

    const a = indexList.map(index => {
      const obj = {
        key: `key_${index}`,
        value: index
      }
      return obj
    })

    const b = deepClone([], a)

    console.log('a, b', a, b)
    expect(a === b).toBe(false)

    const isLevelDeepClone = indexList.every(index => a[index] !== b[index])
    expect(isLevelDeepClone).toBe(true)

    a[1].value = 1000

    console.log('a[1], b[1]', a[1], b[1])
    expect(a[1] !== b[1]).toBe(true)
  })

  it ('Array 測試: ref', () => {
    const indexList = []
    for(let i = 0 ; i < 5; i++) { indexList.push(i) }

    const a = ref(indexList.map(index => {
      const obj = {
        key: `key_${index}`,
        value: index
      }
      return obj
    }))

    const b = deepClone([], a)

    console.log('a, b', a.value, b.value)
    expect(a.value === b.value).toBe(false)

    // const isLevelDeepClone = indexList.every(index => a.value[index] !== b.value[index])
    // expect(isLevelDeepClone).toBe(true)

    // a.value[1].value = 1000

    // console.log('a.value[1], b.value[1]', a.value[1], b.value[1])
    // expect(a.value[1] !== b.value[1]).toBe(true)
  })

  it ('Array 測試: reactive', () => {
    const indexList = []
    for(let i = 0 ; i < 5; i++) { indexList.push(i) }

    const testA = reactive({
      a: indexList.map(index => {
        const obj = {
          key: `key_${index}`,
          value: index
        }
        return obj
      })
    })
    const testB = {
      b: []
    }

    testB.b = deepClone([], testA.a)

    console.log('a, b', testA.a, testB.b)
    expect(testA.a === testB.b).toBe(false)

    const isLevelDeepClone = indexList.every(index => testA.a[index] !== testB.b[index])
    expect(isLevelDeepClone).toBe(true)

    testA.a[1].value = 1000

    console.log('testA.a[1], testB.b[1]', testA.a[1], testB.b[1])
    expect(testA.a[1] !== testB.b[1]).toBe(true)
  })
})
