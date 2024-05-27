<script setup lang="ts">
import type { WritableComputedRef } from 'vue'
import { ref, computed, inject } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'

import type { UseHook } from '@/declare/hook'
import { getUuid } from '@/lib/lib_utils'

import type { Props, Option } from './CustomTabsInfo'
import { version, props as tabsProps } from './CustomTabsInfo'

const scopedName = '__i-tabs__'
const scopedId = getUuid(scopedName)

const props = defineProps(tabsProps)

const emit = defineEmits(['update:modelValue', 'change', 'remove'])

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
  <div :class="`CustomTabs_${version} ${scopedId} ${scopedName}`" class="tabs-wrapper">
    <ElTabs
      ref="elTabsRef"
      v-model="tempValue"
      :type="props.type"
      :closable="props.closable"
      :addable="props.addable"
      :editable="props.editable"
      :tab-position="props.tabPosition"
      :stretch="props.stretch"
      :class="scopedName"
      class="tabs-container"
    >
      <ElTabPane
        v-for="item in props.options"
        :key="`__${item.value}__`"
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
:deep(.__i-tabs__) {
  &.el-tabs {
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
}

.__i-tabs__.tabs {
  &-wrapper {
    width: 100%;
    height: 100%;
  }
  &-container {
    width: 100%;
    height: 100%;
  }
}
</style>
