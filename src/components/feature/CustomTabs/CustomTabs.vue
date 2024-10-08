<script setup lang="ts">
import type { WritableComputedRef } from 'vue'
import { ref, computed, inject } from 'vue'
import type { TabsPaneContext, TabPaneName } from 'element-plus'
import { ElTabs, ElTabPane } from 'element-plus'

import type { UseHook } from '@/declare/hook'
import { getUuid } from '@/lib/lib_utils'

import type { Option } from '@/components'
import type { Props } from './CustomTabsInfo'
import { version, props as tabsProps } from './CustomTabsInfo'

const scopedId = getUuid(version)

const props = defineProps(tabsProps)

const emit = defineEmits([
  'update:modelValue',
  'tab-click',
  'tab-change',
  'tab-remove',
  'tab-add',
  'edit'
])
const onTabClick = (pane: TabsPaneContext, ev: Event) => {
  emit('tab-click', pane, ev)
}
const onTabChange =	(name: TabPaneName) => {
  emit('tab-change', name)
}
const onTabRemove =	(name: TabPaneName) => {
  emit('tab-remove', name)
}
const onTabAdd = () => {
  emit('tab-add')
}
const onEdit = (paneName: TabPaneName | undefined, action: 'remove' | 'add') => {
  emit('edit', paneName, action)
}

const useHook: UseHook = inject('useHook')
const { i18nTranslate, i18nTest } = useHook({
  i18nModule: props.i18nModule
})

const getTranslateLabel = (option: Option) => {
  const label = i18nTest(option.i18nLabel) ? i18nTranslate(option.i18nLabel) : option.label
  return label
}

const tempValue: WritableComputedRef<Props.ModelValue> = computed({
  get: () => props.modelValue,
  set: (value: Props.ModelValue) => emit('update:modelValue', value)
})

const elTabsRef = ref()

</script>

<template>
  <div class="tabs-wrapper" :class="scopedId">
    <ElTabs
      ref="elTabsRef"
      v-model="tempValue"
      :type="props.type"
      :closable="props.closable"
      :addable="props.addable"
      :editable="props.editable"
      :tab-position="props.tabPosition"
      :stretch="props.stretch"
      @tab-click="onTabClick"
      @tab-change="onTabChange"
      @tab-remove="onTabRemove"
      @tab-add="onTabAdd"
      @edit="onEdit"
    >
      <ElTabPane
        v-for="item in props.options"
        :key="`${item.value}-${scopedId}`"
        :name="item.value"
        :label="item.label"
        :disabled="item?.disabled ?? false"
      >
        <template #label>
          <slot
            name="label"
            :is-selected="tempValue === item.value"
            :value="item.value"
            :label="item.label"
            :data="item.data"
            :disabled="item?.disabled"
          >
            <span>{{ getTranslateLabel(item) }}</span>
          </slot>
        </template>
        <template #default>
          <slot
            :is-selected="tempValue === item.value"
            :value="item.value"
            :label="item.label"
            :data="item?.data"
            :disabled="item?.disabled"
          ></slot>
        </template>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<style lang="scss" scoped>
div[class*="__CustomTabs"] :deep(.el-tabs) {
  .el-tabs__header {
    margin: 0 0 8px;
  }
  .el-tabs__content {
    width: 100%;
    height: calc(100% - 40px);
    overflow: visible;

    .el-tab-pane {
      width: 100%;
      height: 100%;
    }
  }
}

div[class*="__CustomTabs"].tabs {
  &-wrapper {
    width: 100%;
    height: fit-content;
  }
}
</style>
