<script setup lang="ts">
import type { Ref, PropType, WritableComputedRef } from 'vue'
import { ref, defineProps, defineEmits, computed, onMounted, onUnmounted } from 'vue'
import throttle from '@/lib/throttle'

const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    required: true
  },
  list: {
    type: Array as PropType<{
      key: string
      value?: any
    }[]>
  }
})

const emit = defineEmits(['update:modelValue'])

const tempValue: WritableComputedRef<string> = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

const onTabClick = (key: string) => {
  tempValue.value = key
}

const increaseScroll = () => {
  conRef.value.scrollBy({
    top: 0,
    left: -100,
    behavior: 'smooth'
  })
}
const decreaseScroll = () => {
  conRef.value.scrollBy({
    top: 0,
    left: 100,
    behavior: 'smooth'
  })
}

// tab 外觀計算
const wrapRef: Ref<HTMLElement | null> = ref(null)
const conRef: Ref<HTMLElement | null> = ref(null)
const listRef: Ref<HTMLElement | null> = ref(null)

const arrowIsShow = ref(false)

const wrapROcallback = throttle((entries) => {
  entries.forEach((entry) => {
    conWidth.value = entry.contentRect.width - 84

    const listRect = listRef.value.getBoundingClientRect()
    listWidth.value = listRect.width

    arrowIsShow.value = listWidth.value > conWidth.value
  })
}, 10)
const wrapRO = new ResizeObserver(wrapROcallback)

const conWidth = ref(0)

const listWidth = ref(0)
const listROcallback = throttle((entries) => {
  entries.forEach((entry) => {
    listWidth.value = entry.contentRect.width
    arrowIsShow.value = listWidth.value > conWidth.value
  })
}, 100)
const listRO = new ResizeObserver(listROcallback)
onMounted(() => {
  if (wrapRef.value !== null) {
    wrapRO.observe(wrapRef.value)
  }
  if (listRef.value !== null) {
    listRO.observe(listRef.value)
  }
})
onUnmounted(() => {
  wrapRO.disconnect()
  listRO.disconnect()
})

</script>

<template>
  <div ref="wrapRef" class="tabs-wrapper">
    <div class="tabs-left-arrow" :class="{'is-show': arrowIsShow}" @click="increaseScroll">
      <AdvantIcon name="chevron-left"/>
    </div>
    <div ref="conRef" class="tabs-container" :style="{ width: conWidth + 'px' }">
      <div ref="listRef" class="tabs-list">
        <div
          v-for="item in props.list"
          class="tabs-item"
          :key="item.key"
          @click="onTabClick(item.key)"
        >
          <slot :data="item.value">
            {{ item.key }}
          </slot>
        </div>
      </div>
    </div>
    <div class="tabs-right-arrow" :class="{'is-show': arrowIsShow}" @click="decreaseScroll">
      <AdvantIcon name="chevron-right"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.tabs {
  &-wrapper {
    width: 100%;
    height: 40px;
    display: flex;
    gap: 2px;
    justify-content: space-between;
    align-items: center;
  }
  &-left-arrow,
  &-right-arrow {
    width: 0;
    height: 100%;
    @extend %flex-center;
    background-color: #fff;
    cursor: pointer;
    overflow: hidden;
    transition-duration: 0.3s;
    &.is-show {
      width: 32px;
    }
    &:hover {
      background-color: #f7f7f7;
    }
  }
  &-container {
    width: 100%;
    height: inherit;
    flex: 1;
    overflow-x: scroll;
    display: flex;
    align-items: center;
  }
  &-list {
    display: flex;
    gap: 1px;
    height: 100%;
  }
  &-item {
    white-space:nowrap;
    @extend %flex-center;
    cursor: pointer;
    border-radius: 4px 4px 0 0;
    padding: 6px 12px;
    border: 1px solid #ececec;
    background-color: #fff;
    transition-duration: 0.3s;

    &:hover {
      background-color: #f7f7f7;
    }
  }
}
</style>