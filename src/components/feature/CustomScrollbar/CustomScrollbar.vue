<script setup lang="ts">
import type { PropType, Ref } from 'vue'
import { useSlots, ref } from 'vue'
import { ElScrollbar } from 'element-plus'
import { hasOwnProperty } from '@/lib/lib_utils'
import type { CSSProperties } from 'vue'

export type AriaOrientation = 'horizontal' | 'vertical'
export type OnScrollParams = { scrollLeft: number, scrollTop: number }

export type HandleScroll = () => void
export type ScrollTo = (options: ScrollToOptions | number, yCoord?: number) => void
export type SetScrollTop = (scrollTop: number) => void
export type SetScrollLeft = (scrollLeft: number) => void
export type Update = () => void
export type WrapRef = () => Ref<HTMLDivElement> | void

const props = defineProps({
  height: {
    type: [String, Number] as PropType<string | number>,
    required: false,
    description: '滾動條高度'
  },
  maxHeight: {
    type: [String, Number] as PropType<string | number>,
    required: false,
    description: '滾動條最大高度'
  },
  wrapStyle: {
    type: [Array, String] as PropType<CSSProperties | CSSProperties[] | string[]>,
    required: false,
    default: '',
    description: '容器自訂style'
  },
  wrapClass: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '容器自訂class'
  },
  viewStyle: {
    type: [Array, String] as PropType<CSSProperties | CSSProperties[] | string[]>,
    required: false,
    default: '',
    description: '視圖自訂style'
  },
  viewClass: {
    type: String as PropType<string>,
    required: false,
    default: '',
    description: '視圖自訂class'
  },
  noresize: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否不應容器變化'
  },
  tag: {
    type: String as PropType<string>,
    required: false,
    default: 'div',
    description: '視圖標籤'
  },
  always: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '滾動條是否總是顯示'
  },
  minSize: {
    type: Number as PropType<number>,
    required: false,
    default: 20,
    description: '滾動條最小尺寸'
  },
  id: {
    type: String as PropType<string>,
    required: false,
    description: '視圖id'
  },
  role: {
    type: String as PropType<string>,
    required: false,
    description: '視圖角色'
  },
  ariaLabel: {
    type: String as PropType<string>,
    required: false,
    description: '視圖 aria-label'
  },
  ariaOrientation: {
    type: String as PropType<AriaOrientation>,
    required: false,
    description: '視圖 aria-orientation'
  }
})

const emit = defineEmits(['scroll'])

const onScroll = ($event: OnScrollParams) => {
  const { scrollLeft, scrollTop } = $event

  emit('scroll', { scrollLeft, scrollTop })
}

// slot
const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return hasOwnProperty.call(slots, prop)
}

// exposes
const elScrollbarRef = ref()
const handleScroll: HandleScroll = () => {
  if (elScrollbarRef.value) {
    elScrollbarRef.value.handleScroll()
  }
}
const scrollTo: ScrollTo = (options, yCoord) => {
  if (elScrollbarRef.value) {
    elScrollbarRef.value.scrollTo(options, yCoord)
  }
}
const setScrollTop: SetScrollTop = (scrollTop) => {
  if (elScrollbarRef.value) {
    elScrollbarRef.value.setScrollTop(scrollTop)
  }
}
const setScrollLeft: SetScrollLeft = (scrollLeft) => {
  if (elScrollbarRef.value) {
    elScrollbarRef.value.setScrollLeft(scrollLeft)
  }
}
const update: Update = () => {
  if (elScrollbarRef.value) {
    elScrollbarRef.value.update()
  }
}
const wrapRef: WrapRef = () => {
  if (elScrollbarRef.value) {
    return elScrollbarRef.value.wrapRef
  }
}


defineExpose({
  handleScroll,
  scrollTo,
  setScrollTop,
  setScrollLeft,
  update,
  wrapRef
})

</script>

<template>
  <div class="scroll-bar">
    <ElScrollbar
      ref="elScrollbarRef"
      :height="props.height"
      :max-height="props.maxHeight"
      :wrap-style="props.wrapStyle"
      :wrap-class="props.wrapClass"
      :view-style="props.viewStyle"
      :view-class="props.viewClass"
      :noresize="props.noresize"
      :tag="props.tag"
      :always="props.always"
      :min-size="props.minSize"
      :id="props.id"
      :role="props.role"
      :aria-label="props.ariaLabel"
      :aria-orientation="props.ariaOrientation"
      @scroll="onScroll"
    >
      <template v-if="hasSlot('default')" #default>
        <slot></slot>
      </template>
    </ElScrollbar>
  </div>
</template>

<style lang="scss" scoped>
.scroll-bar {
  width: fit-content;
  height: fit-content;
  display: contents;
}
</style>
