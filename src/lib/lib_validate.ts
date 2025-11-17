import { isEmpty } from './lib_utils'

export type VeeRes = {
  test: boolean
  label: string
  i18nLabel: string
}

export type ValidateType = 'number' | 'identityCard' | 'phone' | 'password' | ''

export const checkSumForId = (str: string, isOldARC: boolean) => {
  const letterMap: Record<string, number> = {
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
    G: 16,
    H: 17,
    I: 34,
    J: 18,
    K: 19,
    L: 20,
    M: 21,
    N: 22,
    O: 35,
    P: 23,
    Q: 24,
    R: 25,
    S: 26,
    T: 27,
    U: 28,
    V: 29,
    W: 32,
    X: 30,
    Y: 31,
    Z: 33
  }

  // 區域碼數值
  const areaValue = letterMap[str[0]]
  // 性別碼數值
  const genderValue = letterMap[str[1]]

  if (isEmpty(areaValue)) return false
  if (isOldARC && isEmpty(genderValue)) return false

  const n1 = Math.floor(areaValue / 10)
  const n2 = areaValue % 10
  const n3 = genderValue % 10
  const digits = str.slice(isOldARC ? 2 : 1).split('').map((d: string) => Number(d))

  if (digits.some(digit => isNaN(digit))) return false

  const weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1]
  const values = isOldARC ? [n1, n2, n3, ...digits] : [n1, n3, ...digits]
  const sum = values.reduce((acc, v, i) => acc + v * weights[i], 0)
  return sum % 10 === 0
}

/**
 * 確認是否統一編號
 * @param {string} str 待驗證字串
 * @returns {boolean} 是否是統一編號
 */
export const checkUBNId = (str: string): boolean => {
  if (isEmpty(str)) return false
  const validateStr = str.trim()
  if (!/^\d{8}/.test(validateStr)) return false

  const weights = [1, 2, 1, 2, 1, 2, 4, 1]

  let nSum = 0
  for (let i = 0; i < validateStr.length; i++) {
    const product = Number(validateStr[i]) * weights[i]
    nSum += Math.floor(product / 10) + (product % 10)
  }
  return nSum % 10 === 0 || ((nSum + 1) % 10 === 0 && validateStr[6] === '7')
}

const validateFun = {
  number: (value: string): VeeRes => {
    const regexp = /^(-?\d+|\d+)(\.?(\d+))*$/

    return {
      test: regexp.test(value),
      label: '必需為數字',
      i18nLabel: 'validate-number'
    }
  },
  identityCard: (value: string): VeeRes => {
    const regexp = /^[A-Z]{1}[1-2]{1}[0-9]{8}$/

    return {
      test: regexp.test(value),
      label: '需符合生分證格式',
      i18nLabel: 'validate-identityCard'
    }
  },
  phone: (value: string): VeeRes => {
    const regexp = /^09\d{8}$/

    return {
      test: regexp.test(value),
      label: '必需為手機格式',
      i18nLabel: 'validate-phone'
    }
  },
  password: (value: string): VeeRes => {
    const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

    return {
      test: regexp.test(value),
      label: '必需包含大小寫及數字，且超過8碼',
      i18nLabel: 'validate-password'
    }
  }
}

/**
 * @author Caleb
 * @description 驗證資料
 * @param {ValidateType} validate 待驗證類型
 * @param {String} veeValue 需驗證資料
 * @returns {Boolean}
 */
export const validateValue = (
  validate: ValidateType[] | ValidateType,
  veeValue: string
): boolean => {
  // 多個驗證格式
  if (Array.isArray(validate)) {
    return validate.every(type => {
      const { test } = validateFun[type](veeValue)
      return test
    })
    // 單一驗證格式
  } else {
    const { test } = validateFun[validate](veeValue)
    return test
  }
}

export default validateFun
