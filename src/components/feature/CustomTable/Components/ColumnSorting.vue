<script setup lang="ts">
import { onMounted, ref, customRef, computed } from 'vue'
import type { PropType } from 'vue'
import { CustomBadge } from '@/components'
import type { Sorting, Order } from '@/components'

const props = defineProps({
  modelValue: {
    type: Array as PropType<Sorting[]>,
    required: true
  },
  column: {
    type: Object as PropType<any>,
    required: true,
    description: '欄位的設定'
  },
  prop: {
    type: String as PropType<string>,
    required: true,
    description: '欄位的key'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const filterNoneColumnList = computed(() => {
  return props.modelValue.filter(item => item.order !== 'none')
})

const columnValue = customRef<Sorting & { index?: number }>((track, trigger) => {
  return {
    get () {
      track() // 追蹤數據改變
      const column = props.modelValue.find(item => item.key === props.prop)
      const serialNumber = filterNoneColumnList.value.findIndex(item => item.key === props.prop)

      return {
        ...column,
        index: serialNumber
      }
    },
    set (value: Sorting & { index?: number }) {
      const columnIndex = props.modelValue.findIndex(item => item.key === props.prop)
      const _temp = props.modelValue[columnIndex]

      const newValue = [...props.modelValue]
      newValue[columnIndex] = {
        ..._temp,
        ...value
      }
      emit('update:modelValue', newValue)
      trigger() // 通知 vue 重新解析
    }
  }
})

const isShow = ref(false)

const onSortClick = (type: string) => {
  let newOrder: Order = 'none'

  switch (type) {
    case 'asc':
      if (columnValue.value.order === 'ascending') {
        newOrder = 'none'
      } else {
        newOrder = 'ascending'
      }
      break
    case 'desc':
      if (columnValue.value.order === 'descending') {
        newOrder = 'none'
      } else {
        newOrder = 'descending'
      }
      break
    case '':
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

  columnValue.value = {
    key: props.prop,
    order: newOrder
  }
  emit('change')
}

const onAscClick = () => {
  onSortClick('asc')
}
const onDescClick = () => {
  onSortClick('desc')
}

// 'ascending' | 'descending'
onMounted(() => {
  const { column } = props

  isShow.value = !(column?.isOperations ?? false)
})

</script>

<template>
  <div v-if="isShow" class="sort-wrapper" @click="onSortClick('')">
    <CustomBadge :value="(columnValue.index + 1)" :hidden="columnValue.order === 'none'">
      <div class="sort-container">
        <i
          class="sort-asc"
          :class="{ 'is-active': columnValue.order === 'ascending' }"
          @click.stop="onAscClick"
        ></i>
        <i
          class="sort-desc"
          :class="{ 'is-active': columnValue.order === 'descending' }"
          @click.stop="onDescClick"
        ></i>
      </div>
    </CustomBadge>
  </div>
</template>

<style lang="scss" scoped>
.sort {
  &-wrapper {
    padding: 8px 4px 0 0;
    display: inline-block;
    cursor: pointer;
    transform: translate(0, 2px);
  }
  &-container {
    width: 24px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    vertical-align: middle;
    overflow: initial;
    position: relative;
    gap: 2px;
    transform: translate(0, -2px);
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
    border-bottom-color: #a8abb2;
    &.is-active {
      border-bottom-color: #409eff;
    }
  }
  &-desc {
    border-top-color: #a8abb2;
    &.is-active {
      border-top-color: #409eff;
    }
  }
}

</style>
