<script setup lang="ts">
import { ref, computed, useSlots, nextTick, onMounted } from 'vue'
import { ElText } from 'element-plus'

import { CustomTooltip } from '@/components' // 系統組件
import { getUuid, hasOwnProperty, isEmpty } from '@/lib/lib_utils' // 工具
import debounce from '@/lib/lib_debounce'
import { version, props as textProps } from './CustomTextInfo'

const scopedId = getUuid(version)

const props = defineProps(textProps)

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty(slots, prop)
}

const isTruncated = ref(false)
const textTruncated = computed(() => {
  return props.truncated || isTruncated.value
})

const resize = async () => {
  await nextTick()
  const textWrapper = document.querySelector(`[class*="${scopedId}"]`) as HTMLElement
  if (isEmpty(textWrapper)) return

  const textContent = textWrapper.querySelector('.text-label') as HTMLElement
  if (isEmpty(textContent)) return

  isTruncated.value = (textWrapper.offsetWidth < textContent.offsetWidth)
}
const debounceResize = debounce(resize, 120)

onMounted(() => {
  debounceResize()
})
</script>

<template>
  <CustomTooltip
    placement="top"
    trigger="hover"
    :offset="6"
    :show-after="240"
    :disabled="!isTruncated"
  >
    <ElText
      v-element-size="debounceResize"
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
  // height: 100%;
  color: inherit;
  display: inline-block;

  .text {
    &-label {
      min-width: fit-content;
      white-space: nowrap;
    }
  }
}

</style>
