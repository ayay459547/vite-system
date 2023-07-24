<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, onBeforeMount } from 'vue'
import Draggable from 'vuedraggable'

import type { ColumnItem, SettingData } from '@/declare/columnSetting'
import type { PropsTableColumn } from './CustomTable.vue'
import { CustomButton, CustomPopover, CustomCheckbox } from '@/components'

import {
  getColumnSetting,
  setColumnSetting,
  delColumnSetting
} from '@/lib/lib_idb'

const props = defineProps({
  columns: {
    type: Object as PropType<PropsTableColumn[]>,
    default () {
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
        isOperations: column.isOperations
      }
    })
  }

  await setColumnSetting(props.settingKey, settingData)

  return props.settingKey
}

defineExpose({
  checkColumnSetting,
  getcolumnList
})


const drag = ref(false)

const updateSetting = async () => {
  const temp = columnList.value

  const settingData: SettingData = {
    version: props.version,
    settingKey: props.settingKey,
    columns: JSON.parse(JSON.stringify(temp))
  }
  await setColumnSetting(props.settingKey, settingData)

  emit('change')
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
      placement="bottom"
      :width="200"
      trigger="click"
      popper-style="padding: 4px;"
    >
      <template #reference>
        <CustomButton
          icon-name="list-check"
          class="i-mr-xs"
          :label="$t('columnSetting')"
        />
      </template>

      <Draggable
        v-model="columnList"
        group="people"
        @start="drag = true"
        @end="onDragend"
        item-key="key"
        class="column-list"
      >
        <template #item="{ element }">
          <div v-if="!element.isOperations" class="column-item">
            <CustomCheckbox
              v-model="element.isShow"
              @change="updateSetting"
            />
            <div class="text">{{ element.label }}</div>
          </div>
        </template>
      </Draggable>

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
  }
  &-item {
    display: flex;
    gap: 8px;
    background-color: #fff;
    transition-duration: 0.3s;
    padding-left: 16px;

    .text {
      width: 100%;
      height: 40px;
      line-height: 40px;
      cursor: all-scroll;
    }
    &:hover {
      background-color: #f5f7fa;
    }
  }
}
</style>