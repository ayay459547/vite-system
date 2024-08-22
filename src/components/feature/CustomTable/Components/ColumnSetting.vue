<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, inject, computed } from 'vue'

import type { UseHook } from '@/declare/hook'
import type { ColumnItem, SettingData } from '@/declare/columnSetting'
import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'
import { CustomButton, CustomIcon, CustomPopover, CustomInput, CustomDraggable } from '@/components'
import { getColumnSetting, setColumnSetting, delColumnSetting } from '@/lib/lib_idb'
import { isEmpty, getProxyData, hasOwnProperty } from '@/lib/lib_utils'

import type { PropsTableColumn } from '../CustomTableInfo'

const props = defineProps({
  i18nModule: {
    type: String as PropType<ScopeKey>,
    required: false,
    default: defaultModuleType,
    description: 'i18nModule'
  },
  columns: {
    type: Object as PropType<PropsTableColumn[]>,
    default() {
      return {}
    }
  },
  version: {
    type: String as PropType<string>,
    default: '1.0.0',
    description: `欄位設定 版本
      如果版本更換 會重置欄位設定`
  },
  settingKey: {
    type: String as PropType<string>,
    required: true,
    description: '欄位設定 在 indexedDB 上的 key'
  },
  settingWidth: {
    type: Number as PropType<number>,
    default: 150,
    description: '寬度'
  },
  settingHeight: {
    type: String as PropType<string>,
    required: false,
    default: '100%',
    description: '列表高度'
  }
})

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: props.i18nModule
})

const emit = defineEmits(['change', 'resize'])

const columnList = ref<ColumnItem[]>([])

const showColumnList = computed<Array<ColumnItem>>({
  get () {
    return columnList.value.filter(item => {
      return !(item?.isOperations ?? false)
    })
  },
  set (v: Array<ColumnItem>) {
    setColumnList(v)
  }
})

const getColumnList = async () => {
  try {
    const getRes: SettingData = await getColumnSetting(props.settingKey)
    return getRes?.columns ?? []
  } catch (e) {
    return []
  }
}
const setColumnList = (columns: Array<ColumnItem>) => {
  columnList.value = columns
}

/**
 * 當欄位變動時 設新的資料
 * @param props column 的 key
 * @param newValue 新的資料
 */
 const setColumnInfo = (props: string, newValue: Partial<ColumnItem>) => {
  let temp: ColumnItem = columnList.value.find(columnItem => {
    return columnItem.key === props
  })
  if (isEmpty(temp)) return

  for (let prop in newValue) {
    temp[prop] = newValue[prop]
  }
}

/**
 * Hash Table
 * 確認欄位是否有變更 label / i18nLabel
 */
const checkTableColumns = (oldColumns: Array<ColumnItem>) => {
  // 長度不一 表示key值有異動
  if (oldColumns.length !== props.columns.length) return true

  // 保存欄位資料
  const newColumnMap = {}
  const oldColumnMap = {}
  const empty: Partial<ColumnItem> = { key: '', label: '', i18nLabel: '' }
  const len = Math.max(oldColumns.length, props.columns.length)

  const settingDiff = (newColumn: Partial<ColumnItem>, oldColumn: Partial<ColumnItem>, propList: string[]) => {
    const isDiff = propList.some(prop => newColumn[prop] !== oldColumn[prop])
    if (isDiff) {
      setColumnInfo(newColumn.key, newColumn)
    }
  }

  for (let i = 0; i < len; i++) {
    const newColumn = props.columns[i]
    const { key: newKey } = newColumn ?? empty

    const oldColumn = oldColumns[i]
    const { key: oldKey } = oldColumn ?? empty

    /**
     * 舊/新 資料資料比對
     * 如果 label / i18nLabel 不同設定新的
     */
    if (!isEmpty(newColumn) && hasOwnProperty(oldColumnMap, newKey)) {
      // 比對+設定後 移除舊的資料
      settingDiff(newColumn, oldColumnMap[newKey], ['label', 'i18nLabel'])
      delete oldColumnMap[newKey]
    } else {
      // 保存新的資料
      newColumnMap[newKey] = newColumn
    }

    if (!isEmpty(oldColumn) && hasOwnProperty(newColumnMap, oldKey)) {
      // 比對+設定後 移除新的資料
      settingDiff(newColumnMap[oldKey], oldColumn, ['label', 'i18nLabel'])
      delete newColumnMap[oldKey]
    } else {
      // 保存舊的資料
      oldColumnMap[oldKey] = oldColumn
    }
  }

  // 如果有殘留的key 表示key值有異動
  return !isEmpty(newColumnMap) || !isEmpty(oldColumnMap)
}

/**
 * 確認是否有設定過
 * 如果沒有給預設設定
 *
 * 如果版本更換 / 如果欄位有變更 key
 * 重新給預設值
 */
const checkColumnSetting = async () => {
  const getRes = await getColumnSetting(props.settingKey)

  if ([null, undefined].includes(getRes)) {
    await setDefaultColumnSetting()

  } else {
    const { version = '', columns = [] } = getRes
    if (version !== props.version || checkTableColumns(columns)) {
      await delColumnSetting(props.settingKey)
      await setDefaultColumnSetting()
    }
  }
  return props.settingKey
}

/**
 * 在 indexedDB 紀錄欄位設定
 * 順序 + 寬度
 */
const setDefaultColumnSetting = async () => {
  const settingData: SettingData = {
    version: props.version,
    settingKey: props.settingKey,
    columns: props.columns.map(column => {
      // 只要顯示資料
      return {
        isShow: column?.isShow ?? true,
        order: column?.order ?? 'none',
        orderIndex: column?.orderIndex ?? -1,
        key: column.key,
        label: column.label,
        i18nLabel: column.i18nLabel,
        fixed: column?.fixed,
        width: column?.width ?? null,
        minWidth: column?.minWidth ?? null,
        isOperations: column.isOperations
      }
    })
  }

  await setColumnSetting(props.settingKey, settingData)

  return props.settingKey
}

/**
 * 依據 columns 的設定在 indexedDB
 * tempColumnList = 從 indexedDB 取設定
 */
const resetSetting = async () => {
  await setDefaultColumnSetting()

  const tempColumnList = await getColumnList()
  setColumnList(tempColumnList)
  updateSetting(true)
}

// 最適化所有欄位寬度
const resizeColumns = () => {
  emit('resize') // 通知Table調整寬度
}

/**
 * 當欄位寬度變動時 設新的寬度
 * @param props column 的 key
 * @param newWidth 新的寬度
 */
const setColumnWidth = (props: string, newWidth: number) => {
  setColumnInfo(props, { width: newWidth })
  updateSetting(false)
}

defineExpose({
  checkColumnSetting,
  getColumnList,
  setColumnList,
  resetSetting,
  setColumnWidth
})

const drag = ref(false)

/**
 * 更新 indexedDB 上的資料
 * 如果 emit change 會重新設定 columns 資料
 * @param isEmitChange 是否 emit change 事件
 */
const updateSetting = async (isEmitChange = true) => {
  const temp = columnList.value

  const settingData: SettingData = {
    version: props.version,
    settingKey: props.settingKey,
    columns: getProxyData(temp)
  }
  await setColumnSetting(props.settingKey, settingData)

  if (isEmitChange) {
    emit('change')
  }
}

const onDragend = () => {
  drag.value = false
  updateSetting(false)
}
</script>

<template>
  <div class="__column-setting">
    <CustomPopover
      placement="bottom-start"
      :width="props.settingWidth"
      trigger="click"
      popper-style="padding: 4px;"
    >
      <template #reference>
        <CustomButton
          icon-name="list-check"
          :label="i18nTranslate('columnSetting', defaultModuleType)"
        />
      </template>

      <div>
        <div
          :style="{
            maxHeight: props.settingHeight,
            overflow: 'auto'
          }"
        >
          <CustomDraggable
            v-model="showColumnList"
            @start="drag = true"
            @end="onDragend"
            item-key="key"
            class="__column-list"
            :handle="`.setting-move`"
            :style="{}"
          >
            <template #item="{ element }">
              <div v-if="!element.isOperations" class="__column-item setting-move">
                <div class="__column-item-left">
                  <div>
                    <CustomInput
                      v-model="element.isShow"
                      type="checkbox"
                      :validate-key="`ColumnSetting:${element.key}`"
                      hidden-label
                      :label="i18nTranslate(element?.i18nLabel ?? element.label)"
                      @change="updateSetting(true)"
                    />
                  </div>
                </div>

                <div class="__column-item-right">
                  <CustomIcon
                    x-type="tabler"
                    name="ArrowsUpDown"
                  />
                </div>
              </div>
            </template>
          </CustomDraggable>
        </div>

        <div class="__column-footer">
          <CustomButton
            :label="'調整全部欄寬' /*i18nTranslate('resize-header', defaultModuleType)*/"
            type="info"
            plain
            icon-name="arrows-left-right-to-line"
            @click="resizeColumns"
          />

          <CustomButton
            :label="i18nTranslate('reset', defaultModuleType)"
            type="info"
            plain
            icon-name="repeat"
            @click="resetSetting"
          />
        </div>
      </div>
    </CustomPopover>
  </div>
</template>

<style lang="scss" scoped>
.__column {
  &-setting {
    width: fit-content;
    height: fit-content;
  }

  &-list {
    display: flex;
    flex-direction: column;
    height: fit-content;
    overflow: auto;
  }
  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 16px;
    width: 100%;
    cursor: move;

    &-left {
      width: calc(100% - 48px);
      display: flex;
      gap: 8px;
      overflow: hidden;
    }
    &-right {
      width: 40px;
    }

    & {
      background-color: inherit;
      transition-duration: 0.3s;
    }

    &:hover {
      background-color: var(--el-color-primary-light-9);
    }
  }

  &-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 6px;
    padding: 4px;
  }
}
</style>
