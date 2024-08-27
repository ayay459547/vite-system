<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, reactive, onBeforeMount, nextTick, useSlots, computed, inject } from 'vue'

import type { UseHook } from '@/declare/hook'
import { SimpleTable, CustomButton } from '@/components'
import { useSimpleTableSetting } from '@/lib/lib_columns'
import { swal, scrollToEl, hasOwnProperty, getUuid, isEmpty } from '@/lib/lib_utils'
import { defaultModuleType } from '@/i18n/i18n_setting'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

const getSlot = (slotKey: string, type: 'header' | 'column'): string => {
  switch (type) {
    case 'header':
      if (hasSlot(`header-${slotKey}`)) return `header-${slotKey}`
      // if (hasSlot('header-all')) return 'header-all'
      break
    case 'column':
      if (hasSlot(`column-${slotKey}`)) return `column-${slotKey}`
      if (hasSlot('column-all')) return 'column-all'
      break
  }
  return 'empty'
}
const getHeaderSlot = (slotKey: string): string => {
  return getSlot(slotKey, 'header')
}
const getColumnSlot = (slotKey: string): string => {
  return getSlot(slotKey, 'column')
}

const props = defineProps({
  modelValue: {
    type: Array as PropType<any[]>,
    default() {
      return []
    }
  },
  label: {
    type: String as PropType<string>,
    required: false,
    default: ''
  },
  min: {
    type: Number as PropType<number>,
    required: false,
    default: 0
  },
  max: {
    type: Number as PropType<number>,
    required: false,
    default: Infinity
  },
  columnSetting: {
    type: Object as PropType<Record<string, any>>,
    required: true,
    default() {
      return {}
    }
  },
  tableKey: {
    type: String as PropType<string>,
    required: false,
    default: 'table'
  },
  itemKey: {
    type: String as PropType<string>,
    required: false,
    default: 'key'
  },
  isDraggable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false
  },
  draggableGroup: {
    type: String as PropType<string>,
    required: false
  },
  isEdit: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
    description: '是否可編輯'
  },
  isCreate: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否可新增'
  },
  createPosition: {
    type: String as PropType<'center' | 'right' | 'left'>,
    required: false,
    default: 'center',
    description: `
      新增用按鈕的顯示位置
      種類: 'center' | 'right' | 'left'
    `
  },
  isRemove: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否可刪除'
  },
  isShowNo: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否顯示編號'
  },
  isCollapse: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: `
      是否允許摺疊FormList, 僅顯示標題與摺疊鍵
    `
  },
  move: {
    type: Function,
    required: false,
    default: null,
    description: '用於draggable的移動後回掉函式'
  },
  disabled: {
    type: Function,
    required: false,
    default: null,
    description: '用於定義draggable是否可移動'
  },
  setDisabled: {
    type: Function,
    required: false,
    default: () => { return false },
    description: `
      用於判斷FormList Item是否禁止操作
    `
  }
})

const emit = defineEmits(['add', 'remove', 'update:modelValue'])

//Expose
defineExpose({
  setCollapse: (method?: string) => {
    //展開或折疊FormList
    setCollapseList(method)
  }
})

const tempValue = computed({
  get: () => props.modelValue,
  set: (value: any[]) => {
    emit('update:modelValue', value)
  }
})

const tableColumns = ref()
const showTableColumns = ref()

const scopedId = getUuid('__form-list__')
const add = () => {
  if (tempValue.value.length >= props.max) {
    return swal({
      icon: 'warning',
      title: '無法新增',
      text: `資料列表不能超過 ${props.max} 筆資料`
    })
  }

  emit('add')

  nextTick(() => {
    const lastRowClass = props.isDraggable
      ? '.draggable.list-group-item:last-child'
      : '.form-table [class*="data-table-row"]:last-child'
    const newEl = document.querySelector(`.${scopedId} ${lastRowClass}`)
    if (newEl) scrollToEl(newEl, { block: 'center' })
  })
}
const remove = (rowIndex: number) => {
  if (tempValue.value.length < props.min + 1) {
    return swal({
      icon: 'warning',
      title: '無法刪除',
      text: `資料列表至少要有 ${props.min} 筆資料`
    })
  }

  emit('remove', rowIndex)
}

const beforeColumn = reactive({})
const afterColumn = reactive({})

const collapseList = ref(false)
const setCollapseList = (method?: string) => {
  switch (method) {
    case 'open': collapseList.value = false
      break
    case 'close': collapseList.value = true
      break
    default: collapseList.value = !collapseList.value
      break
  }
}

onBeforeMount(() => {
  if (props.isShowNo) {
    beforeColumn['row_index'] = { label: '#' }
    beforeColumn['row_index'][props.tableKey] = {
      width: 40,
      align: 'center'
    }
  }

  if (props.isRemove || props.isDraggable) {
    afterColumn['row_operations'] = { label: '操作' }
    afterColumn['row_operations'][props.tableKey] = {
      width: 90,
      align: 'center',
      isOperations: true
    }
  }

  // 依原來欄位設定跑 slot 迴圈
  const { tableColumns: _tableColumns } = useSimpleTableSetting(props.columnSetting, props.tableKey)
  tableColumns.value = _tableColumns

  // 顯示的欄位 + #序號 + 操作(delete)
  const { tableColumns: _showTableColumns } = useSimpleTableSetting(
    {
      ...beforeColumn,
      ...props.columnSetting,
      ...afterColumn
    },
    props.tableKey
  )

  showTableColumns.value = _showTableColumns
})

</script>

<template>
  <div class="__form-list__ form-container hover-card-info" :class="scopedId">
    <div
      v-if="hasSlot('title') || !isEmpty(props.label)"
      class="__form-list__ form-top"
    >
      <div  class="__form-list__ form-title">
        <slot name="title" :label="props.label">
          <span>{{ props.label }}</span>
        </slot>
      </div>

      <template v-if="props.isCollapse">
        <div class="__form-list__">
          <CustomButton
            v-if="collapseList"
            icon-name="caret-down"
            text
            plain
            @click="setCollapseList()"
          />
          <CustomButton
            v-else
            icon-name="minus"
            size="small"
            text
            plain
            @click="setCollapseList()"
          />
        </div>
      </template>
    </div>

    <div class="__form-list__ form-content" v-show="!collapseList">
      <div class="__form-list__ form-table">
        <SimpleTable
          v-model="tempValue"
          :item-key="props.itemKey"
          :is-draggable="isDraggable"
          :handle="`.form-item-move__${scopedId}`"
          :move="props.move"
          :disabled="props.disabled"
          :group="props.draggableGroup"
          :table-data="tempValue"
          :table-columns="showTableColumns"
        >
          <template #header-all="{ key, rowIndex, data, column: _column }">
            <slot name="header-all" :label="data" :row-index="rowIndex" :column="_column" :prop="key">
              <div v-show="_column.required" class="text-danger i-pr-xs">*</div>
              <div>{{ _column.label }}</div>
            </slot>
          </template>
          <template
            v-for="column in tableColumns"
            :key="column.prop"
            v-slot:[getHeaderSlot(column.slotKey)]="{ key, rowIndex, data, column: _column }"
          >
            <slot
              :name="getHeaderSlot(column.slotKey)"
              :label="data"
              :row-index="rowIndex"
              :column="_column"
              :prop="key"
            ></slot>
          </template>

          <template
            v-for="column in tableColumns"
            :key="column.prop"
            v-slot:[getColumnSlot(column.slotKey)]="{ key, row, rowIndex, data, column: _column }"
          >
            <slot
              :name="getColumnSlot(column.slotKey)"
              :data="data"
              :row="row"
              :row-index="rowIndex"
              :column="_column"
              :prop="key"
            ></slot>
          </template>

          <template #header-row_index="{ data }">
            <label>{{ data }}</label>
          </template>
          <template #column-row_index="{ rowIndex }">
            <span>{{ rowIndex + 1 }}</span>
          </template>
          <template #header-row_operations="scope">
            <slot name="column-operations" v-bind="scope">
              <span>{{ i18nTranslate('operationCommands') }}</span>
              <!-- <span>{{ scope.data }}</span> -->
            </slot>
          </template>
          <template #column-row_operations="scope">
            <KeepAlive>
              <div class="flex-row" v-if="props.setDisabled(scope.row)">
                <slot name="column-draggable" :scopedId="scopedId" v-bind="scope">
                  <CustomButton
                    v-if="props.isDraggable"
                    type="info"
                    icon-x-type="tabler"
                    icon-name="ArrowsUpDown"
                    text
                    disabled
                    :class="`form-item-disable__${scopedId}`"
                  />
                </slot>
                <slot name="column-remove" :scopedId="scopedId" v-bind="scope">
                  <CustomButton
                    v-if="props.isRemove"
                    type="danger"
                    icon-name="trash-can"
                    text
                    disabled
                    @click="remove(scope.rowIndex)"
                  />
                </slot>
              </div>
              <div class="flex-row" v-else>
                <slot name="column-draggable" :scopedId="scopedId" v-bind="scope">
                  <CustomButton
                    v-if="props.isDraggable"
                    type="info"
                    icon-x-type="tabler"
                    icon-name="ArrowsUpDown"
                    text
                    :disabled="!props.isEdit"
                    :class="`form-item-move__${scopedId}`"
                  />
                </slot>
                <slot name="column-remove" :scopedId="scopedId" v-bind="scope">
                  <CustomButton
                    v-if="props.isRemove"
                    type="danger"
                    icon-name="trash-can"
                    text
                    :disabled="!props.isEdit"
                    @click="remove(scope.rowIndex)"
                  />
                </slot>
              </div>
            </KeepAlive>
          </template>
        </SimpleTable>
      </div>

      <div :class="`__form-list__ form-create ${props.createPosition}`">
        <CustomButton
          v-if="props.isCreate && props.isEdit"
          type="primary"
          :label="i18nTranslate('create')"
          icon-name="plus"
          icon-move="rotate"
          :disabled="!props.isEdit"
          @click="add"
        />
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.__form-list__ {
  &.form {
    &-top {
      width: 100%;
      display: flex;
      // justify-content: space-between
    }

    &-title {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
    }

    &-container {
      width: 100%;
      height: 100%;

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 8px;
      transition-duration: 0.3s;
    }

    &-content{
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      gap: 8px;
    }

    &-table {
      width: 100%;
      height: 100%;
      flex: 1;
      overflow: hidden;
    }

    &-create {
      width: 100%;
      display: flex;

      &.center {
        justify-content: center;
      }
      &.left {
        justify-content: start;
      }
      &.right {
        justify-content: end;
      }
    }
  }
}
</style>
