<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import { ElAlert, ElAutoResizer } from 'element-plus'

type Variant = 'p' | 'text'
  | 'h1' | 'h3' | 'caption'
  |'button' | 'image'
  | 'circle' | 'rect'

const props = defineProps({
  variant: {
    type: String as PropType<Variant>,
    default: 'rect'
  }
})

const bindStyle = computed(() => {
  let width = '100%'
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
    case 'image':
    case 'circle':
    case 'rect':
      height = '100%'
      break
  }

  return { width, height }
})

</script>

<template>
  <div class="page-error" :style="bindStyle">
    <ElAutoResizer>
      <template #default="{ height, width }">
        <ElAlert
          title="Error"
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
}
</style>
