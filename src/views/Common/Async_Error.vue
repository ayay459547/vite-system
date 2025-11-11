<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import { ElAlert, ElAutoResizer } from 'element-plus'

import type { Variant } from '@/lib/lib_hook' // 自訂Composition API
import { isEmpty } from '@/lib/lib_utils' // 工具

const props = defineProps({
  variant: {
    type: String as PropType<Variant>,
    default: 'rect'
  },
  error: {
    type: Object as PropType<Error>,
    required: false,
    default: () => {
      return {
        name: 'Error',
        message: 'Error'
      }
    }
  }
})

const bindStyle = computed(() => {
  let width = '99%'
  let height = 'fit-content'

  switch (props.variant) {
    case 'p':
    case 'text':
      height = '16px'
      break
    case 'h1':
      height = '20px'
      break
    case 'h3':
    case 'caption':
      height = '18px'
      break
    case 'button':
      width = '80px'
      height = '32px'
      break
    case 'empty':
      width = '0px'
      height = '0px'
      break
    case 'image':
    case 'circle':
    case 'rect':
      height = '99%'
      break
  }

  return { width, height }
})

const title = computed(() => {
  const defaultMsg = 'Error'
  const errorMsg = props.error?.message ?? (props?.error ?? defaultMsg)

  return (!isEmpty(errorMsg) ? errorMsg : defaultMsg) as string
})

</script>

<template>
  <div class="page-error" :style="bindStyle">
    <ElAutoResizer>
      <template #default="{ height, width }">
        <ElAlert
          :title="title"
          type="error"
          show-icon
          :closable="false"
          center
          :style="{
            width: `${width}px`,
            height: `${height}px`
          }"
        />
      </template>
    </ElAutoResizer>
  </div>
</template>

<style lang="scss" scoped>
.page-error {
  background-color: var(--i-color-system-page);
  overflow: hidden;
  margin: 2px;
  max-height: 1200px;
}
</style>
