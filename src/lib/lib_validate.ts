export type VeeRes = {
  test: boolean
  label: string
  i18nLabel: string
}

export type ValidateType = 'number' | 'identityCard' | 'phone' | 'password' | ''

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
