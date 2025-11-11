import { describe, it, expect } from 'vitest'

describe('Vitest TEST', () => {
  it('test', () => {
    const test = () => {
      console.log('test 1')
      return true
    }

    expect(test()).toBe(true)
  })
})
