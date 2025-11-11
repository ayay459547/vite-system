<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted, ref, customRef, computed } from 'vue'

import type { CustomTableTypes } from '@/components/table' // 系統組件: 表格
import CustomBadge from '@/components/feature/CustomBadge/CustomBadge.vue'

const props = defineProps({
  modelValue: {
    type: Array as PropType<CustomTableTypes['sorting'][]>,
    required: true
  },
  column: {
    type: Object as PropType<CustomTableTypes['tableColumn']>,
    required: true,
    description: '欄位的設定'
  },
  prop: {
    type: String as PropType<string>,
    required: true,
    description: '欄位的key'
  }
})

const emit = defineEmits(['update:model-value', 'change'])

const filterNoneColumnList = computed(() => {
  return props.modelValue.filter(item => item.order !== 'none')
})

const columnValue = customRef<CustomTableTypes['sorting'] & { index?: number | string }>((track, trigger) => {
  return {
    get: () => {
      track() // 追蹤數據改變
      const column = props.modelValue.find(item => item.key === props.prop)
      const serialNumber = filterNoneColumnList.value.findIndex(item => item.key === props.prop)

      return {
        ...column,
        index: serialNumber === -1 ? '~' : serialNumber + 1
      }
    },
    set: (value: CustomTableTypes['sorting'] & { index?: number | string }) => {
      const columnIndex = props.modelValue.findIndex(item => item.key === props.prop)
      const _temp = props.modelValue[columnIndex]

      const newValue = [...props.modelValue]
      newValue[columnIndex] = {..._temp, ...value}
      emit('update:model-value', newValue)
      trigger() // 通知 vue 重新解析
    }
  }
})

const isShow = ref(false)

const onSortClick = (type: string) => {
  let newOrder: CustomTableTypes['order'] = 'none'

  switch (type) {
    case 'ascending': // 如果已經是升冪排序 變成取消
      newOrder = columnValue.value.order === 'ascending' ? 'none' : 'ascending'
      break
    case 'descending': // 如果已經是降冪排序 變成取消
      newOrder = columnValue.value.order === 'descending' ? 'none' : 'descending'
      break
    case 'badge': // 點擊在排序順序時 取消排序
      newOrder = 'none'
      break
    default:
      if (columnValue.value.order === 'ascending') {
        newOrder = 'descending'
      } else if (columnValue.value.order === 'descending') {
        newOrder = 'none'
      } else if (columnValue.value.order === 'none') {
        newOrder = 'ascending'
      }
    break
  }

  columnValue.value = { key: props.prop, order: newOrder }
  emit('change')
}

const onAscClick = () => {
  onSortClick('ascending')
}
const onDescClick = () => {
  onSortClick('descending')
}

onMounted(() => {
  const { column } = props
  isShow.value = !(column?.isOperations ?? false)
})
</script>

<template>
  <div v-if="isShow" class="__sort-wrapper">
    <CustomBadge
      :value="columnValue.index"
      :hidden="columnValue.order === 'none'"
      @click="onSortClick('badge')"
      style="cursor: pointer;"
    >
      <div class="__sort-container">
        <div class="__sort-button" @click.stop="onAscClick">
          <i
            class="__sort-asc"
            :class="{ 'is-active': columnValue.order === 'ascending' }"
          ></i>
        </div>
        <div class="__sort-button" @click.stop="onDescClick">
          <i
            class="__sort-desc"
            :class="{ 'is-active': columnValue.order === 'descending' }"

          ></i>
        </div>
      </div>
    </CustomBadge>
  </div>
</template>

<style lang="scss" scoped>
.__sort {
  &-wrapper {
    padding: 8px 4px 0 0;
    display: inline-block;
    transform: translate(0, 2px);
  }
  &-container {
    width: 24px;
    display: flex;
    flex-direction: column;
    // gap: 2px;
    transform: translate(0, -3px);
  }
  &-button {
    width: 100%;
    padding: 1px;
    cursor: pointer;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    vertical-align: middle;
    overflow: initial;
    position: relative;
  }

  &-asc,
  &-desc {
    width: 0;
    height: 0;
    display: inline-block;
    padding-top: -2px;
    border: solid 6px transparent;
  }
  &-asc {
    border-bottom-color: var(--el-text-color-placeholder);
    &.is-active {
      border-bottom-color: var(--el-color-primary);
    }
  }
  &-desc {
    border-top-color: var(--el-text-color-placeholder);
    &.is-active {
      border-top-color: var(--el-color-primary);
    }
  }
}
</style>
