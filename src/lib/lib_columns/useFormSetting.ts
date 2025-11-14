import { reactive, shallowReactive } from 'vue'

import { defaultModuleType } from '@/declare/declare_i18n'
import type {
  // ColumnItem, // 欄位屬性
  InputRefItem, // 輸入框
  FormOptions, // 可用選項
  FormSetting,
  Conditions, // 進階搜尋
  FormIDBSetting
} from '@/types/types_columnSetting'

import {
  // getColumnSetting, // 表格欄位
  getFilterSetting,
  setFilterSetting,
  delFilterSetting
} from '@/lib/lib_idb'
import { isEmpty, hasOwnProperty, message, getProxyData } from '@/lib/lib_utils' // 工具
import { object_forEach, object_filter, object_reduce } from '@/lib/lib_object'
import { getColumnData, checkColumns } from './columnsHookUtils'

/**
 * @author Caleb
 * @description 取得多欄輸入框用的參數
 *              使用 Columns 設定
 *              輸入框資料 預設是 key
 * @param {Ojbect} columns
 * @param {String} type 取得 columnSetting 中的類型
 * @returns {Ojbect}
 */
export const useFormSetting = <T>(
  columns: Record<string, any>,
  type: string,
  options?: FormOptions
): FormSetting<T> => {
  const {
    version = '',
    settingKey = '',
    i18nModule = defaultModuleType
  } = options ?? {}

  // 欄位屬性
  const resColumns: Record<string, any> = {}
  // 預設欄位資料
  const __defaultValue__: Record<string, any> = {}

  // 一般搜尋
  const resForms = reactive<Record<string, any>>({}) // 輸入框資料
  const resActiveForms = reactive<Record<string, boolean>>({}) // 是否啟用
  // 進階搜尋
  const resActiveConditions = reactive<Record<string, boolean>>({}) // 是否啟用
  const resConditions = reactive<Record<string, Conditions>>({}) // 多條件

  // ref
  const refMap = shallowReactive<Record<string, any>>({})

  object_forEach(columns, (column: Record<string, any>, key: string) => {
    if (hasOwnProperty(column, type)) {
      const columnInfo = getColumnData({ i18nModule, ...column }, { type, key }, refMap)
      __defaultValue__[key] = columnInfo?.default ?? null
      resColumns[key] = columnInfo

      resForms[key] = __defaultValue__[key]
      resActiveForms[key] = true
      resActiveConditions[key] = false
      resConditions[key] = [] // 沒有雙向綁定 不會即時更新在畫面上
    }
  })

  // 資料 reset
  const resetForms = (defaultValue?: any) => {
    object_forEach(resForms, (value: any, key: string) => {
      if (typeof defaultValue === 'object' && hasOwnProperty(defaultValue, key)) {
        resForms[key] = defaultValue[key] ?? __defaultValue__[key]
      } else {
        resForms[key] = __defaultValue__[key]
      }
      resActiveForms[key] = true
      resActiveConditions[key] = false
      resConditions[key] = []
    })
  }

  // 驗證 reset
  const resetValidate = () => {
    object_forEach(refMap, (input: InputRefItem) => {
      if (typeof input?.resetValidate !== 'function') return
      input.resetValidate()
    })
  }

  checkColumns(resColumns, columns, type)

  // 更新過濾條件
  const updateIDB = async () => {
    if (isEmpty(settingKey) || isEmpty(version)) return
    const filterInfo: FormIDBSetting<T> = getProxyData({
      version,
      settingKey,
      forms: resForms,
      activeForms: resActiveForms,
      activeConditions: resActiveConditions,
      conditions: resConditions
    })
    // console.log('記錄使用者過濾條件 updateIDB => ', filterInfo)
    const res = await setFilterSetting(settingKey, filterInfo)
    return res
    // console.log('取消功能 記錄使用者過濾條件 updateIDB => ', filterInfo)
  }
  // 取消功能 記錄使用者過濾條件
  const useIDBForms = async () => {
    if (isEmpty(settingKey) || isEmpty(version)) return

    const filterInfo = await getFilterSetting(settingKey) as FormIDBSetting<T | any>
    if (isEmpty(filterInfo)) {
      updateIDB()
    } else {
      const {
        version: idb_version,
        // settingKey,
        forms: idb_forms,
        activeForms: idb_activeForms,
        activeConditions: idb_activeConditions,
        conditions: idb_conditions
      } = filterInfo

      if (idb_version !== version) {
        await delFilterSetting(settingKey)
        updateIDB()
      }

      object_forEach(resForms, (value: any, key: string) => {
        if (hasOwnProperty(idb_forms, key)) {
          resForms[key] = idb_forms[key] ?? null
        }
        if (hasOwnProperty(idb_activeForms, key)) {
          resActiveForms[key] = idb_activeForms[key] ?? true
        }
        if (hasOwnProperty(idb_activeConditions, key)) {
          resActiveConditions[key] = idb_activeConditions[key] ?? false
        }
        if (hasOwnProperty(idb_conditions, key)) {
          resConditions[key] = idb_conditions[key] ?? []
        }
      })
    }
  }
  setTimeout(() => {
    useIDBForms()
  }, 0)

  return {
    refMap,
    defaultValue: __defaultValue__ as T,
    columns: resColumns,
    forms: resForms as T,
    activeForms: resActiveForms, // 是否啟用Input
    activeConditions: resActiveConditions,
    conditions: resConditions,
    resetForms, // 重置所有過濾條件
    resetValidate,
    // 資料, 驗證 reset
    reset: (defaultValue?: any) => {
      resetForms(defaultValue)
      resetValidate()
    },
    getActiveForms: (isShowEmpty: boolean = false) => {
      return object_filter(resForms, (value: any, key: string) => {
        if (isShowEmpty) return resActiveForms[key]
        return resActiveForms[key] && !isEmpty(value)
      })
    },
    // 驗證
    validate: async (): Promise<any[]> => {
      const validateList: any[] = []
      const validateInput: any[] = []

      const successList: any[] = []
      const errorList: any[] = []

      object_forEach(refMap, (input: InputRefItem) => {
        if (typeof input?.getDom !== 'function') return
        // 只用有顯示的 input 才會被驗證
        const el = input.getDom()
        const { key, value, getDom } = input
        if (!isEmpty(el)) {
          validateList.push(input.validate())
          validateInput.push({ key, value, input, el, getDom })
        }
      })

      await Promise.all(validateList).then(resList => {
        resList.forEach((resItem, resIndex) => {
          const { errors, valid } = resItem
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
        message({
          type: 'error',
          message: errors,
          duration: 10000
        })
        throw new Error(errors)
      })

      return new Promise((resolve, reject) => {
        if (errorList.length > 0) {
          reject(errorList)
        } else {
          resolve(successList)
        }
      })
    },
    // 取得多條件搜尋的資訊
    getConditionFilter: () => {
      return object_reduce(resConditions, (res: Conditions, value: any, key: string) => {
        if (
          resActiveForms[key] && // 啟用搜尋
          resActiveConditions[key] && // 啟用多條件搜尋
          !isEmpty(value)
        ) {
          res.push(...value)
        }
        return res
      }, [])
    },
    setConditionFilter: (key: string, newConditions: Conditions) => {
      resConditions[key] = [...newConditions]
    },
    updateIDB
  }
}
