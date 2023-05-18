<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, onBeforeMount } from 'vue'

import { ElPopover, ElCheckbox } from 'element-plus'

import Draggable from 'vuedraggable'

import type { PropsTableColumn } from './CustomTable.vue'

import {
  getColumnSetting,
  setColumnSetting,
  delColumnSetting
} from '@/lib/idb'

export interface ColumnItem {
  isShow: boolean
  key: string
  label: string
}
export interface SettingData {
  version: string
  settingKey: string
  columns: ColumnItem[]
}

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

defineExpose({
  getcolumnList: async () => {
    const getRes: SettingData = await getColumnSetting(props.settingKey)
    return getRes.columns
  }
})

const drag = ref(false)

const columnList = ref<ColumnItem[]>([])

/**
 * 確認是否有設定過
 * 如果沒有給預設設定
 */
const init = async () => {
  const getRes = await getColumnSetting(props.settingKey)

  if ([null, undefined].includes(getRes)) {
    const settingData: SettingData = {
      version: props.version,
      settingKey: props.settingKey,
      columns: props.columns.map(column => {
        return {
          isShow: true,
          key: column.key,
          label: column.label
        }
      })
    }

    await setColumnSetting(props.settingKey, settingData)
  }
}

const updateSetting = async () => {
  const temp = columnList.value.map(column => column)

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
  await init()
  const getRes: SettingData = await getColumnSetting(props.settingKey)
  columnList.value = getRes.columns
})

</script>

<template>
  <div class="column-setting">
    <ElPopover
      placement="bottom"
      :width="200"
      trigger="click"
    >
      <template #reference>
        <CustomButton
          icon-name="list-check"
          class="i-mr-xs"
          label="欄位設定"
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
          <div class="column-item">
            <ElCheckbox
              v-model="element.isShow"
              size="large"
              @change="updateSetting"
            />
            <div class="text">{{ element.label }}</div>
          </div>
        </template>
      </Draggable>

    </ElPopover>
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