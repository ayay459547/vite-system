<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref } from 'vue'

import CustomTooltip from '@/components/feature/CustomTooltip/CustomTooltip.vue'

const props = defineProps({
  name: {
    type: String as PropType<string>,
    required: true
  }
})

const textRef = ref<HTMLSpanElement>()
const checkTooltipDisabled = computed(() => {
  if (!textRef.value) return true
  // scrollWidth > clientWidth : Menu寬度不夠顯示所全部文字
  // console.log(props.name, textRef.value.clientWidth, textRef.value.scrollWidth)
  return textRef.value.scrollWidth <= textRef.value.clientWidth
})

</script>

<template>
  <CustomTooltip
    :show-after="400"
    popper-class="cursor-events-none"
    :disabled="checkTooltipDisabled"
  >
    <span class="item-title" ref="textRef"> {{ props.name }} </span>
    <template #content>
      <span class="item-title">{{ props.name }}</span>
    </template>
  </CustomTooltip>
</template>

<style lang="scss" scoped>
.item {
  &-title {
    width: 100%;
    display: inline-block;
    font-size: 1.25em;
    transform: translateX(0);
    transition-duration: 0.3s;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &-icon {
    width: 30px;
    height: 30px;
    @extend %flex-center;
  }
  &-empty {
    height: 30px;
  }
}
</style>
