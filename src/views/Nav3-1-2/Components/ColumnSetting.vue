<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, onBeforeMount } from 'vue'

import type { ColumnItem, SettingData } from '@/declare/columnSetting'
import { CustomButton, CustomPopover, CustomInput, CustomDraggable } from '@/components'
import { getColumnSetting, setColumnSetting, delColumnSetting } from '@/lib/lib_idb'
import { isEmpty } from '@/lib/lib_utils'

import type { PropsTableColumn } from './CustomTable.vue'

const props = defineProps({
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
    required: true,
    description: '寬度'
  }
})

const emit = defineEmits(['change'])

const columnList = ref<ColumnItem[]>([])

const getcolumnList = async () => {
  const getRes: SettingData = await getColumnSetting(props.settingKey)
  return getRes.columns
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
        isShow: true,
        key: column.key,
        label: column.label,
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

  const tempColumnList = await getcolumnList()
  columnList.value = tempColumnList
  updateSetting()
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
  getcolumnList,
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
    columns: JSON.parse(JSON.stringify(temp))
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

onBeforeMount(async () => {
  await checkColumnSetting()

  const tempColumnList = await getcolumnList()
  columnList.value = tempColumnList
})
</script>

<template>
  <div class="column-setting">
    <CustomPopover
      placement="bottom-start"
      :width="props.settingWidth"
      trigger="click"
      popper-style="padding: 4px;"
    >
      <template #reference>
        <CustomButton icon-name="list-check" class="i-mr-xs" :label="$t('columnSetting')" />
      </template>

      <CustomDraggable
        v-model="columnList"
        @start="drag = true"
        @end="onDragend"
        item-key="key"
        class="column-list"
        :handle="`.setting-move`"
      >
        <template #item="{ element }">
          <div v-if="!element.isOperations" class="column-item">
            <div class="flex-row i-ga-xs">
              <div>
                <CustomInput
                  v-model="element.isShow"
                  type="checkbox"
                  hidden-label
                  @change="updateSetting(true)"
                />
              </div>
              <div class="text">{{ element.label }}</div>
            </div>

            <CustomButton type="info" icon-name="bars" text class="setting-move" />
          </div>
        </template>

        <template #footer>
          <div class="column-reset">
            <CustomButton
              label="返回預設值"
              type="info"
              plain
              icon-name="repeat"
              @click="resetSetting"
            />
          </div>
        </template>
      </CustomDraggable>
    </CustomPopover>
  </div>
</template>

<style lang="scss" scoped>
.column {
  &-setting {
    width: fit-content;
    height: fit-content;
  }

  &-list {
    display: flex;
    flex-direction: column;
    max-height: 60vh;
    height: fit-content;
    overflow: auto;
  }
  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    transition-duration: 0.3s;
    padding-left: 16px;
    width: 100%;

    .text {
      width: 100%;
      height: 40px;
      line-height: 40px;
    }
    &:hover {
      background-color: #f5f7fa;
    }
  }

  &-reset {
    display: flex;
    justify-content: flex-end;
    padding: 8px 12px 4px;
  }
}
</style>
