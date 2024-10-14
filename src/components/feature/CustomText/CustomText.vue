<script setup lang="ts">
import { ref, computed, useSlots, onMounted } from 'vue'
import { ElText } from 'element-plus'

import { CustomTooltip } from '@/components'
import { getUuid, isEmpty } from '@/lib/lib_utils'
import { version, props as textProps } from './CustomTextInfo'

const scopedId = getUuid(version)

const props = defineProps(textProps)

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}

const isTruncated = ref(false)
const textTruncated = computed(() => {
  return props.truncated || isTruncated.value
})

onMounted(() => {
  setTimeout(() => {
    const textWrapper = document.querySelector(`[class*="${scopedId}"]`)
    if (isEmpty(textWrapper)) return

    const textContent = textWrapper.querySelector('.text-label')
    if (isEmpty(textContent)) return

    isTruncated.value = (textWrapper.offsetWidth < textContent.offsetWidth)
  }, 560)
})

</script>

<template>
  <CustomTooltip
    placement="top-start"
    trigger="hover"
    :offset="6"
    :show-after="800"
    :disabled="!isTruncated"
  >
    <ElText
      :type="props.type"
      :size="props.size"
      :truncated="textTruncated"
      :line-clamp="props.lineClamp"
      :tag="props.tag"
      :class="scopedId"
    >
      <template v-if="props.label.length > 0 || hasSlot('default')" #default>
        <span class="text-label">
          <slot>{{ props.label }}</slot>
        </span>
      </template>
    </ElText>

    <template #content>
      <slot>{{ props.label }}</slot>
    </template>
  </CustomTooltip>
</template>

<style lang="scss" scoped>
[class*="__CustomText"] {
  width: 100%;
  height: 100%;
  color: inherit;

  .text {
    &-label {
      min-width: fit-content;
      white-space: nowrap;
    }
  }
}

</style>
