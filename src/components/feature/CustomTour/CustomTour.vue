<script setup lang="ts">
import { useSlots, computed, inject } from 'vue'
import { ElTour, ElTourStep } from 'element-plus'

import type { UseHook } from '@/declare/hook'
import { getUuid, hasOwnProperty, isEmpty } from '@/lib/lib_utils'

import type { Props, Emits } from './CustomTourInfo'
import { version, props as tourProps } from './CustomTourInfo'

const scopedId = getUuid(version)

const props = defineProps(tourProps)

const emit = defineEmits([
  'update:modelValue',
  'update:current',
  'close',
  'finish',
  'change',
  'step-close'
])

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: props.i18nModule
})
const getText = (text: string, i18nText: string) => {
  console.log({
    text,
    i18nText,
    isEmpty: isEmpty(i18nText),
    res: i18nTranslate(i18nText)
  })
  if (isEmpty(i18nText)) return text ?? ''
  return i18nTranslate(i18nText)
}

const openValue = computed({
  get: () => props.modelValue,
  set: (value: Props.ModelValue) => {
    emit('update:modelValue', value)
  }
})
const currentValue = computed({
  get: () => props.current,
  set: (value: Props.Current) => {
    emit('update:current', value)
  }
})

const onClose: Emits.Close = (current: number) => {
  emit('close', current)
}
const onFinish: Emits.Finish = () => {
  emit('finish')
}
const onChange: Emits.Change = (current: number) => {
  emit('change', current)
}
const onStepClose: Emits.StepClose = () => {
  emit('step-close')
}

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

</script>

<template>
  <ElTour
    v-model="openValue"
    v-model:current="currentValue"
    :z-index="props.zIndex"
    :show-arrow="props.showArrow"
    :placement="props.placement"
    :target-area-clickable="targetAreaClickable"
    :class="scopedId"
    @close="onClose"
    @finish="onFinish"
    @change="onChange"
  >
    <ElTourStep
      v-for="(step, stepIndex) in props.steps"
      :key="`${stepIndex}-${scopedId}`"
      :target="step.target"
      :title="step.title"
      :description="step.description"
      v-bind="step"
      @close="onStepClose"
    >
      <template #header>
        <slot name="header-steps" v-bind="step">
          <span>{{ getText(step.title, step.i18nTitle) }}</span>
        </slot>
      </template>
      <template #default>
        <slot name="steps" v-bind="step">
          <span>{{ getText(step.description, step.i18nDescription) }}</span>
        </slot>
      </template>
    </ElTourStep>

    <template v-if="hasSlot('indicators')" #indicators="{ current, total }">
      <slot :current="current" :total="total" name="indicators">
        <!-- <span>{{ current + 1 }} / {{ total }}</span> -->
      </slot>
    </template>
  </ElTour>
</template>

<style lang="scss" scoped>
:global(.el-tour__mask),
:global(.el-tour__content) {
  z-index: var(--i-z-index-tour) !important;
}
:global(.el-tour-buttons) {
  display: flex;
  gap: 12px;
}
</style>
