type VeeRes = {
  res: boolean
  msg: string
}

export const veeNumber = (value: string): VeeRes => {
  const regexp = /^[\d|\s]*$/

  return {
    res: regexp.test(value),
    msg: '必需為數字'
  }
}

export const veeIdentityCard = (value: string): VeeRes => {
  const regexp = /^[A-Z]{1}[1-2]{1}[0-9]{8}$/

  return {
    res: regexp.test(value),
    msg: '需符合生分證格式'
  }
}

export const veePhone = (value: string): VeeRes => {
  const regexp = /^09\d{8}$/

  return {
    res: regexp.test(value),
    msg: '必需為手機格式'
  }
}

export const veePassword = (value: string): VeeRes => {
  const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

  return {
    res: regexp.test(value),
    msg: '必需包含大小寫及數字，且超過8碼'
  }
}

export default {
  number: veeNumber,
  identityCard: veeIdentityCard,
  phone: veePhone,
  password: veePassword
}