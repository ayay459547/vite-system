import type { ComponentPublicInstance } from 'vue'
import type { Expose } from '@/declare/formInput'
import type { ValidateType } from './validate'
import { reactive } from 'vue'

export interface FormColumns {
  columns: Record<string, any>
  forms: Record<string, any>
  reset: () => void
  validate: () => Promise<Array<any>>
}

export interface RefItem extends Element, ComponentPublicInstance, Expose {}
export interface FormColumnsItem {
  ref: (el: RefItem) => void
  key: string
  validateKey: string
  clearable: boolean
  default: any
  validate: ValidateType[] | ValidateType
  required: boolean
  resizable: boolean
  showOverflowTooltip: boolean
  label: string
}
/**
 * @author Caleb
 * @description 使用 Columns 設定
 *              輸入框資料 預設是 key
 * @param {Ojbect} columns
 * @param {String} type 取得 columnSetting 中的類型
 * @returns {Ojbect}
 */
export const getFormColumns = (columns: Record<string, any>, type: string): FormColumns => {
  const resColumns = {}
  const formMap = reactive<Record<string, any>>({})
  const refMap = reactive<Record<string, any>>({})

  const hasOwnProperty = Object.prototype.hasOwnProperty

  const getColumnData = (column: Record<string, any>, type: string, key: string): Record<string, any> => {
    return {
      ref: (el: RefItem) => {
        if (el) {
          refMap[key] = el
        }
      },
      key,
      validateKey: key,
      clearable: true,
      default: '',
      validate: [],
      required: false,
      resizable: true,
      showOverflowTooltip: false,
      label: column?.label ?? '',
      ...column[type]
    }
  }

  columns.$forEach((column: Record<string, any>, key: string) => {
    if(hasOwnProperty.call(column, type)) {
      const temp = getColumnData(column, type, key)
      resColumns[key] = temp

      formMap[key] = temp.default
    }
  })

  return {
    columns: resColumns,
    forms: formMap,
    reset: () => {
      formMap.$forEach((value: any, key: string) => {
        formMap[key] = resColumns[key].default
        refMap[key].handleReset()
      })
    },
    validate: async () => {
      const validateList = []
      const validateInput = []

      const successList = []
      const errorList = []

      refMap.$forEach((input: RefItem) => {
        const { key, value, validate } = input
        validateList.push(validate())
        validateInput.push({ key, value })
      })

      await Promise.all(validateList).then(resList => {
        resList.forEach((resItme, resIndex) => {
          const { errors, valid } = resItme
          const validateRes = {
            ...validateInput[resIndex],
              errors,
              valid
          }

          if (valid) {
            successList.push(validateRes)
          } else {
            errorList.push(validateRes)
          }
        })
      }).catch(errors => {
        throw new Error(errors)
      })

      return new Promise((resolve, reject) => {
        if (errorList.length > 0) {
          reject(errorList)
        } else {
          resolve(successList)
        }
      })
    }
  }

}

export interface TableColumns {
  key: string
  prop: string
  slot: boolean
  sortable: boolean
  label: string
}
/**
 * @author Caleb
 * @description 取的 Columns 設定 Table用的資料
 *              slot prop 預設是 key
 * @param {Ojbect} columns
 * @param {String} type 取得 columnSetting 中的類型
 * @returns {Array}
 */
export const getTableColumns = (columns: Record<string, any>, type: string): Record<string, any> => {
  const hasOwnProperty = Object.prototype.hasOwnProperty

  const getColumnData = (column: Record<string, any>, type: string, key: string): Record<string, any> => {
    return {
      key,
      prop: key,
      slot: key,
      sortable: false,
      label: column?.label ?? '',
      ...column[type]
    }
  }

  const resColumns = []

  columns.$forEach((column: Record<string, any>, key: string) => {
    if(hasOwnProperty.call(column, type)) {
      const temp = getColumnData(column, type, key)
      resColumns.push(temp)
    }
  })

  return resColumns
}

/**
 * @author Caleb
 * @description 取的 Columns 所有key
 * @param {Ojbect} columns
 * @returns {Array}
 */
export const getColumnsKey = (columns: Record<string, any>): Array<string> => {
  return columns.$reduce((prev: Array<string>, curr: any, currKey: string) => {
      return [...prev, currKey]
  }, [])
}
