<script setup lang="ts">
import {
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  nextTick,
  useSlots,
  computed,
  inject
} from 'vue'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import { SimpleTable, CustomButton } from '@/components' // 系統組件
import { useSimpleTableSetting } from '@/lib/lib_columns'
import { scrollToEl, hasOwnProperty, getUuid, isEmpty } from '@/lib/lib_utils' // 工具

import type { Emits, Expose } from './FormListInfo'
import { version, props as formListProps } from './FormListInfo'

const scopedId = getUuid(version)

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

const props = defineProps(formListProps)

const emit = defineEmits([
  'mounted',
  'add',
  'remove',
  'update:model-value',
  'expand-change'
])

const useHook = inject('useHook') as UseHook 
const { i18nTranslate } = useHook({
  i18nModule: props.i18nModule
})

const tempValue = computed({
  get: () => props.modelValue,
  set: (value: any[]) => {
    emit('update:model-value', value)
  }
})

const tableColumns = ref()
const showTableColumns = ref()

const add: Emits.Add = () => {
  if (tempValue.value.length >= props.max) return

  emit('add')

  nextTick(() => {
    // 多層嵌套可取得最後一個
    const newEls = document.querySelectorAll(`div[class*="${scopedId}"] .draggable.list-group-item:last-child`)
    if (isEmpty(newEls)) return

    const newEl = newEls[newEls.length - 1]
    if (isEmpty(newEl)) return

    scrollToEl(newEl, { block: 'center' })
  })
}
const remove: Emits.Remove = (rowIndex: number) => {
  if (tempValue.value.length < props.min + 1) return

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

// 展開或折疊 FormList
const setCollapse: Expose.SetCollapse = (method?: string) => {
  setCollapseList(method)
}

const SimpleTableRef = ref()
const toggleRowExpansion: Expose.ToggleRowExpansion = (row: any, expanded?: boolean) => {
  return SimpleTableRef.value?.toggleRowExpansion(row, expanded)
}

defineExpose({
  setCollapse,
  toggleRowExpansion
})

onBeforeMount(() => {
  if (props.isShowNo) {
    beforeColumn['row_index'] = { label: '#' }
    beforeColumn['row_index'][props.tableKey] = {
      width: 40,
      align: 'center'
    }
  }

  if (props.isRemove || props.isDraggable) {
    afterColumn['row_operations'] = {
      label: '操作',
      i18nLabel: 'operationCommands'
    }
    afterColumn['row_operations'][props.tableKey] = {
      width: 90,
      align: 'center',
      // fixed: 'right',
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

onMounted(() => {
  emit('mounted')
})

// SimpleTable
const onExpandChange: Emits.ExpandChange = (row: any, expanded: boolean, rowIndex: number, rowKey: any) => {
  emit('expand-change', row, expanded, rowIndex, rowKey)
}

</script>

<template>
  <div
    class="__form-list__ form-container hover-card-info"
    :class="[scopedId, collapseList ? 'is-collapse' : 'is-expand']"
  >
    <div
      v-if="hasSlot('title') || !isEmpty(props.label)"
      class="__form-list__ form-top"
    >
      <div class="__form-list__ form-title">
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
          ref="SimpleTableRef"
          v-model="tempValue"
          :item-key="props.itemKey"
          :is-draggable="isDraggable"
          :handle="`.__form-item-move__`"
          :move="props.move"
          :disabled="props.disabled"
          :group="props.draggableGroup ?? `${scopedId}`"
          :table-data="tempValue"
          :table-columns="showTableColumns"
          @expand-change="onExpandChange"
        >
          <template v-if="hasSlot('row-expand')" #row-expand="{ rowKey, row, rowIndex, expanded }">
            <slot
              name="row-expand"
              :row-key="rowKey"
              :row="row"
              :row-index="rowIndex"
              :expanded="expanded"
            ></slot>
          </template>
          <template #header-all="{ key, rowIndex, data, column: _column }">
            <slot name="header-all" :label="data" :row-index="rowIndex" :column="_column" :prop="key">
              <div v-show="_column.required" class="text-danger i-pr-xs">*</div>
              <div>{{ i18nTranslate(_column?.i18nLabel ?? _column.label) }}</div>
            </slot>
          </template>
          <template
            v-for="column in (tableColumns as Array<any>)"
            :key="`header-form-list-${column.prop}-${scopedId}`"
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
            v-for="column in (tableColumns as Array<any>)"
            :key="`column-form-list-${column.prop}-${scopedId}`"
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
                    class="__form-item-disable__"
                  />
                </slot>
                <slot name="column-remove" :scopedId="scopedId" v-bind="scope">
                  <CustomButton
                    v-if="props.isRemove && props.isEdit"
                    type="danger"
                    icon-name="trash-can"
                    text
                    :disabled="tempValue.length < props.min + 1"
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
                    class="__form-item-move__"
                  />
                </slot>
                <slot name="column-remove" :scopedId="scopedId" v-bind="scope">
                  <CustomButton
                    v-if="props.isRemove && props.isEdit"
                    type="danger"
                    icon-name="trash-can"
                    text
                    :disabled="tempValue.length < props.min + 1"
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
          :label="i18nTranslate('add')"
          icon-name="plus"
          icon-move="rotate"
          :disabled="tempValue.length >= props.max"
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
      align-items: center;
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

      &.is-collapse {
        background-color: var(--el-disabled-bg-color);
      }
      // &.is-expand {}
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
