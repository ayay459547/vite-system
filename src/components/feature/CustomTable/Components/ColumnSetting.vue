<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, inject, computed } from 'vue'

import type { UseHook } from '@/declare/hook.ts'
import type { ColumnItem, SettingData } from '@/declare/columnSetting.ts'
import type { ScopeKey } from '@/i18n/i18n_setting'
import { defaultModuleType } from '@/i18n/i18n_setting'
import { CustomButton, CustomIcon, CustomPopover, CustomInput, CustomDraggable } from '@/components'
import { getColumnSetting, setColumnSetting, delColumnSetting } from '@/lib/lib_idb'
import { isEmpty, getProxyData } from '@/lib/lib_utils'

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
 * 確認是否有設定過
 * 如果沒有給預設設定
 *
 * 如果版本更換
 * 重新給預設值
 */
const checkColumnSetting = async () => {
  const getRes = await getColumnSetting(props.settingKey)

  if ([null, undefined].includes(getRes)) {
    await setDefaultColumnSetting()
  } else if (getRes.version !== props.version) {
    await delColumnSetting(props.settingKey)
    await setDefaultColumnSetting()
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
 * 依據 columns 的設定 重設
 */
const resetSetting = async () => {
  await setDefaultColumnSetting()

  const tempColumnList = await getColumnList()
  setColumnList(tempColumnList)
  updateSetting()
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
  const temp = columnList.value.find(columnItem => {
    return columnItem.key === props
  })

  if (isEmpty(temp)) return

  temp.width = newWidth
  // 改寬度不用重新設定 columns 資料
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
  updateSetting()
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
                    name="right-left"
                    style="transform: rotateZ(90deg)"
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
      width: 48px;
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
