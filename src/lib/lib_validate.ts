export type VeeRes = {
  test: boolean
  msg: string
}

export type ValidateType = 'number' | 'identityCard' | 'phone' | 'password' | ''

const validateFun = {
  number: (value: string): VeeRes => {
    const regexp = /^(-?\d+|\d+)(\.?(\d+))*$/

    return {
      test: regexp.test(value),
      msg: '必需為數字'
    }
  },
  identityCard: (value: string): VeeRes => {
    const regexp = /^[A-Z]{1}[1-2]{1}[0-9]{8}$/

    return {
      test: regexp.test(value),
      msg: '需符合生分證格式'
    }
  },
  phone: (value: string): VeeRes => {
    const regexp = /^09\d{8}$/

    return {
      test: regexp.test(value),
      msg: '必需為手機格式'
    }
  },
  password: (value: string): VeeRes => {
    const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

    return {
      test: regexp.test(value),
      msg: '必需包含大小寫及數字，且超過8碼'
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
