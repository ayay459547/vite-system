<script setup lang="ts">
import type { PropType } from 'vue'
import { shallowRef, inject, onMounted } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { CustomDraggable, CustomButton, CustomScrollbar } from '@/components/feature' // 系統組件

import { getProxyData } from '@/lib/lib_utils' // 工具
import type { ScopeKey } from '@/types/types_i18n'
import { defaultModuleType } from '@/declare/declare_i18n'

const props = defineProps({
  i18nModule: {
    type: String as PropType<ScopeKey>,
    default: defaultModuleType
  },
  groupColumns: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  dateColumns: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  otherColumns: {
    type: Array as PropType<any[]>,
    default: () => []
  }
})

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: props.i18nModule
})

const emit = defineEmits(['reset', 'submit'])

const groupValue = shallowRef([]) // 群組欄位 X軸

const dateValue = shallowRef([]) // 日期線欄位 Y軸

const otherValue = shallowRef([]) // 其他欄位 none

const init = async () => {
  groupValue.value = props.groupColumns
  dateValue.value = props.dateColumns
  otherValue.value = props.otherColumns
}

const reset = () => {
  emit('reset')
}
const submit = async () => {
  const columnValue = getProxyData({
    groupValue: groupValue.value,
    dateValue: dateValue.value,
    otherValue: otherValue.value
  })
  emit('submit', columnValue)
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="setting-wrapper">
    <div class="setting-container">
      <!-- 群組欄位 -->
      <div class="setting-list group">
        <label>{{ i18nTranslate('column-group', defaultModuleType) }}</label>
        <CustomScrollbar always class='setting-draggable'>
          <CustomDraggable
            v-model="groupValue"
            :group="{ name: 'columns', pull: true, put: true }"
            stripe
            :style="{ height: '100%' }"
          >
            <template #item="{ element, index }">
              <slot name="DraggableItem" :element="element" :index="index"></slot>
            </template>
          </CustomDraggable>
        </CustomScrollbar>
      </div>

      <!-- 日期線欄位 -->
      <div class="setting-list date">
        <label>{{ i18nTranslate('column-dateLine', defaultModuleType) }}</label>
        <CustomScrollbar always class='setting-draggable'>
          <CustomDraggable
            v-model="dateValue"
            :group="{ name: 'columns', pull: true, put: true }"
            stripe
            :style="{ height: '100%' }"
          >
            <template #item="{ element, index }">
              <slot name="DraggableItem" :element="element" :index="index"></slot>
            </template>
          </CustomDraggable>
        </CustomScrollbar>
      </div>

      <!-- 未使用欄位 -->
      <div class="setting-list other">
        <label>{{ i18nTranslate('column-unuse', defaultModuleType) }}</label>
        <CustomScrollbar always class='setting-draggable'>
          <CustomDraggable
            v-model="otherValue"
            :group="{ name: 'columns', pull: true, put: true }"
            stripe
            :style="{ height: '100%' }"
          >
            <template #item="{ element, index }">
              <slot name="DraggableItem" :element="element" :index="index"></slot>
            </template>
          </CustomDraggable>
        </CustomScrollbar>
      </div>
    </div>

    <div class="setting-footer">
      <CustomButton
        :label="i18nTranslate('reset', defaultModuleType)"
        type="info"
        plain
        icon-name="repeat"
        @click="reset"
      />

      <CustomButton
        :label="i18nTranslate('submit', defaultModuleType)"
        type="primary"
        plain
        icon-name="check"
        icon-move="scale"
        @click="submit"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setting {
  &-wrapper {
    width: 100%;
    height: calc(100vh - 240px);
    padding-right: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: space-between;
    justify-content: space-between;
  }

  &-container {
    width: 100%;
    height: calc(100% - 40px);
    display: flex;
    flex-wrap: wrap;
  }
  &-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--i-color-system-page);
    border: 1px solid var(--el-color-info-light-7) {
      radius: 6px;
    };
    gap: 8px;
    padding: 8px;

    :deep(.el-scrollbar__view) {
      width: 100%;
      height: 100%;
    }

    &.group,
    &.date {
      width: 50%;
      height: 50%;
    }

    &.other {
      width: 100%;
      height: 50%;
    }
  }
  &-draggable {
    flex: 1;
    // border: 1px solid green;
  }

  &-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
