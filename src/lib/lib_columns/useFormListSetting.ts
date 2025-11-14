import type { Ref } from 'vue'
import { shallowReactive, ref } from 'vue'

import type {
  // ColumnItem, // 欄位屬性
  InputRefItem, // 輸入框
  FormListSetting
} from '@/types/types_columnSetting'

import { getUuid, isEmpty, hasOwnProperty, message } from '@/lib/lib_utils' // 工具
import { object_forEach } from '@/lib/lib_object'
import { getColumnData, checkColumns } from './columnsHookUtils'

/**
 * @author Caleb
 * @description 取得多欄多列輸入框用的參數
 *              使用 Columns 設定
 *              輸入框資料 預設是 key
 * @param {Ojbect} columns
 * @param {String} type 取得 columnSetting 中的類型
 * @param {Array} initData 初始化資料
 * @returns {Ojbect}
 */
export const useFormListSetting = <T>(
  columns: Record<string, any>,
  type: string,
  initData: Array<any> = []
): FormListSetting<T> => {
  // 欄位屬性
  const resColumns: Record<string, any> = {}
  // 預設欄位資料
  const __defaultValue__: Record<string, any> = {}

  // ref
  const refMap = shallowReactive<Record<string, any>>({})

  object_forEach(columns, (column: Record<string, any>, key: string) => {
    if (hasOwnProperty(column, type)) {
      const columnInfo = getColumnData(column, { type, key }, refMap)
      resColumns[key] = columnInfo
      __defaultValue__[key] = columnInfo?.default ?? null
    }
  })

  // 列表資料
  const formList = ref<Array<T>>([])
  const __initData__ = initData.map(item => {
    const rowKey = getUuid()
    return {
      id: rowKey,
      key: rowKey,
      ...item,
      __key__: rowKey
    }
  })
  formList.value.push(...__initData__)

  // 移除不存在的 input ref
  const delRemoveInput = () => {
    // event loop 確保最後執行
    setTimeout(() => {
      object_forEach(refMap, (input: InputRefItem, mapKey: string) => {
        if (typeof input?.getDom !== 'function') return
        const el = input.getDom()
        if (isEmpty(el)) { delete refMap[mapKey] }
      })
    }, 0)
  }

  checkColumns(resColumns, columns, type)
  return {
    refMap,
    defaultValue: __defaultValue__ as T,
    columns: resColumns as Record<string, any>,
    forms: formList as Ref<Array<T>>,
    reset: () => {
      formList.value.splice(0)
      formList.value.push(...__initData__)
    },
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

      return new Promise<any[]>((resolve, reject) => {
        if (errorList.length > 0) {
          reject(errorList)
        } else {
          resolve(successList)
        }
      })
    },
    add: (value?: any): any => {
      const rowKey = getUuid()
      const newData = {
        id: rowKey,
        key: rowKey,
        ...__defaultValue__,
        ...value,
        __key__: rowKey
      } as any

      formList.value.push(newData)
      return newData
    },
    remove: (rowIndex: number): any | undefined => {
      const removeData = formList.value.splice(rowIndex, 1)
      delRemoveInput()
      return Array.isArray(removeData) ? removeData[0] : null
    },
    clear: () => {
      formList.value.splice(0)
      delRemoveInput()
    }
  }
}
