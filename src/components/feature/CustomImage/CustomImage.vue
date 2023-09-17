<script setup lang="ts">
import type { PropType } from 'vue'
import { useSlots } from 'vue'
import { ElImage } from 'element-plus'

export type Fit = '' | 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'

const props = defineProps({
  src: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '圖片網址'
  },
  fit: {
    type: String as PropType<Fit>,
    required: false,
    default: '',
    description: '圖片如何適應容器 css object-fit'
  },
  alt: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '原生屬性 alt'
  },
  referrerpolicy: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '原生屬性 referrerpolicy'
  },
  zoomRate: {
    type: Number as PropType<number>,
    required: false,
    description: '瀏覽圖片縮放比'
  },
  initialIndex: {
    type: Number as PropType<number>,
    default: 0
  },
  previewSrcList: {
    type: Array as PropType<string[]>,
    required: false,
    default () {
      return []
    },
    description: '圖片預覽列表'
  },
  hideOnClickModal: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否可點及遮罩關閉預覽'
  },
  previewTeleported: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: 'image-viewer 是否插入至 body 元素上'
  }
})

const emit = defineEmits([
  'load', 'error', 'switch', 'close', 'show'
])
const onEvent = {
  load: (e: Event): void => emit('load', e),
  error: (e: Error): void => emit('error', e),
  switch: (e: number): void => emit('switch', e),
  close: (): void => emit('close'),
  show: (): void => emit('show')
}

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return Object.prototype.hasOwnProperty.call(slots, prop)
}

</script>

<template>
  <div class="image">
    <ElImage
      style="width: 100%; height: 100%;"
      :src="props.src"
      :alt="props.alt"
      :referrerpolicy="props.referrerpolicy"
      :zoom-rate="props.zoomRate"
      :initial-index="props.initialIndex"
      :preview-src-list="props.previewSrcList"
      :hide-on-click-modal="props.hideOnClickModal"
      :preview-teleported="props.previewTeleported"
      v-on="onEvent"
    >
      <template v-if="hasSlot('placeholder')" #placeholder>
        <slot name="placeholder"></slot>
      </template>
      <template v-if="hasSlot('error')" #error>
        <slot name="error"></slot>
      </template>
      <template v-if="hasSlot('viewer')" #viewer>
        <slot name="viewer"></slot>
      </template>
    </ElImage>
  </div>
</template>

<style lang="scss" scoped>
.image {
  width: 100%;
  height: 100%;
}

</style>
