<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import type { TableColumnsItem } from '@/declare/columnSetting'

import { CustomButton } from '@/components'

const props = defineProps({
  index: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
    description: '項次'
  },
  column: {
    type: Object as PropType<TableColumnsItem>,
    required: false,
    default: () => {
      return {}
    },
    description: '欄位資料'
  },
  timeLineDateKey: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '當前使用 日期欄位的key'
  }
})

const isAcitve = computed(() => {
  return props.column.key === props.timeLineDateKey
})

const emit = defineEmits(['changeKey'])
const changeTimeLineDateKey = () => {
  emit('changeKey', props.column.key)
}

</script>

<template>
  <div class="draggable-item" :class="{ 'is-active': isAcitve }">
    <label>{{ `${props.index + 1}. ${props.column.label}` }}</label>

    <CustomButton
      v-if="props.column?.isTimeLineDate"
      :class="{ 'btn-is-active': isAcitve }"
      :icon-type="isAcitve ? 'fas' : 'far'"
      icon-name="star"
      icon-size="small"
      text
      size="small"
      @click="changeTimeLineDateKey"
    />
  </div>
</template>

<style lang="scss" scoped>
.draggable {
  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    width: 100%;
    height: 100%;
    padding: 8px;

    &.is-active {
      background-color: var(--el-color-warning-light-7);
    }
  }

  .btn-is-active {
    color: var(--i-color-orange);
  }
}
</style>
