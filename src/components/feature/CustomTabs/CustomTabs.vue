<script setup lang="ts">
import type { Ref, PropType, WritableComputedRef } from 'vue'
import { ref, computed, onMounted, onUnmounted, watch, effectScope } from 'vue'

import type { ResizeObserverCallback } from '@/lib/lib_throttle'
import throttle from '@/lib/lib_throttle'
import debounce from '@/lib/lib_debounce'

import { CustomIcon } from '@/components'
import { scrollToEl, getUuid } from '@/lib/lib_utils'

export type ListItem = {
  key: string | number
  label: string
  value?: any
}
export type ListType = Array<ListItem>
export type ModelValue = string | number | null
export type TabPosition = 'left' | 'right'

const props = defineProps({
  modelValue: {
    type: [String, Number, null] as PropType<ModelValue>,
    required: true,
    description: 'v-model'
  },
  list: {
    type: Array as PropType<ListType>,
    required: true,
    description: 'tabs 列表'
  },
  remove: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否可刪除'
  },
  background: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '加上背景色'
  },
  move: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: `
      如果 tabs 可能過多會用到
      值發生變化時自動 移動到對應的值`
  },
  tabPosition: {
    type: String as PropType<TabPosition>,
    default: 'left',
    description: `位置
      left: flex-start (左邊)
      right: flex-end (右邊)
    `
  }
})

const emit = defineEmits([
  'update:modelValue',
  'change',
  'remove'
])

const tempValue: WritableComputedRef<ModelValue> = computed({
  get: () => props.modelValue,
  set: (value: ModelValue) => emit('update:modelValue', value)
})

const scopedId = `__tabs__${getUuid()}`
const scrollToCurrentTab = (currentTab: string) => {
  if (!props.move) return

  const el = document.querySelector(`.${scopedId} .__tab_${currentTab}`)
  if (el) {
    setTimeout(() => {
      scrollToEl(el, {
        inline: 'start'
      })
    }, 200)
  }
}
const debounceScrollToCurrentTab = debounce(scrollToCurrentTab, 200)

const onTabClick = (key: string | number, label: string, value: any) => {
  tempValue.value = key

  const changeProps: ListItem = { key, label, value }
  emit('change', changeProps)
}
const removeTab = (key: string | number, label: string, value: any) => {
  const removeProps: ListItem = { key, label, value }
  emit('remove', removeProps)
}

const increaseScroll = () => {
  conRef.value.scrollBy({
    top: 0,
    left: -500,
    behavior: 'smooth'
  })
}
const decreaseScroll = () => {
  conRef.value.scrollBy({
    top: 0,
    left: 500,
    behavior: 'smooth'
  })
}

// tab 外觀計算
const wrapRef: Ref<HTMLElement | null> = ref(null)
const conRef: Ref<HTMLElement | null> = ref(null)
const listRef: Ref<HTMLElement | null> = ref(null)

const arrowIsShow = ref(false)

const wrapROcallback = throttle((entries: ResizeObserverEntry[]) => {
  entries.forEach((entry) => {
    conWidth.value = entry.contentRect.width - 84

    if (listRef.value !== null) {
      const listRect = listRef.value.getBoundingClientRect()
      listWidth.value = listRect.width

      arrowIsShow.value = listWidth.value > conWidth.value
    }
  })
}, 100) as ResizeObserverCallback
const wrapRO = new ResizeObserver(wrapROcallback)

const conWidth = ref(0)

const listWidth = ref(0)
const listROcallback = throttle((entries: ResizeObserverEntry[]) => {
  entries.forEach((entry) => {
    const oddListWidth = listWidth.value
    listWidth.value = entry.contentRect.width

    arrowIsShow.value = listWidth.value > conWidth.value

    if (listWidth.value > oddListWidth) {
      debounceScrollToCurrentTab(tempValue.value)
    }
  })
}, 100) as ResizeObserverCallback
const listRO = new ResizeObserver(listROcallback)

const scope = effectScope()

onMounted(() => {
  // 有掛載才開啟監聽
  scope.run(() => {
    if (props.move) {
      watch(tempValue, (newValue) => {
        debounceScrollToCurrentTab(newValue)
      })
    }
  })

  if (wrapRef.value !== null) {
    wrapRO.observe(wrapRef.value)
  }
  if (listRef.value !== null) {
    listRO.observe(listRef.value)
  }
  debounceScrollToCurrentTab(tempValue.value)
})
onUnmounted(() => {
  scope.stop()

  if (wrapRO) {
    wrapRO.disconnect()
  }
  if (listRO) {
    listRO.disconnect()
  }
})

</script>

<template>
  <div
    ref="wrapRef"
    class="tabs-wrapper"
    :class="[
      { 'is-background': props.background },
      `${scopedId}`
    ]">
    <div class="tabs-left-arrow" :class="{'is-show': arrowIsShow}" @click="increaseScroll">
      <CustomIcon name="chevron-left"/>
    </div>
    <div
      ref="conRef"
      :class="[
        'tabs-container',
        {
          left: props.tabPosition === 'left',
          right: props.tabPosition === 'right'
        }
      ]"
      :style="{ width: conWidth + 'px' }"
    >
      <div ref="listRef" class="tabs-list" :class="{ 'is-background': props.background }">
        <div
          v-for="element in props.list"
          class="tabs-item"
          :class="[
            {
              'is-active': props.modelValue === element.key,
              'is-background': props.background
            },
            `__tab_${element.key}`
          ]"
          :key="element.key"
          @click="onTabClick(element.key, element.label, element.value)"
        >
          <slot :key="element.key" :label="element.label" :value="element.value">
            <span>{{ element.label }}</span>
          </slot>
          <template v-if="props.remove">
            <CustomIcon
              name="xmark"
              class="tabs-item-remove"
              @click="removeTab(element.key, element.label, element.value)"
            />
          </template>
        </div>
      </div>
    </div>
    <div class="tabs-right-arrow" :class="{ 'is-show': arrowIsShow }" @click="decreaseScroll">
      <CustomIcon name="chevron-right"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
$is-background: #f5f7fa;
.tabs {
  &-wrapper {
    width: 100%;
    height: 40px;
    display: flex;
    gap: 2px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;

    &.is-background {
      border: 1px solid #ddd;
      border-radius: 4px 4px 0 0;
      background-color: $is-background;
    }
  }
  &-left-arrow,
  &-right-arrow {
    @extend %flex-center;
    width: 0;
    height: 100%;
    cursor: pointer;
    overflow: hidden;
    transition-duration: 0.3s;
    border-radius: 6px;
    &.is-show {
      width: 32px;
    }
    &:hover {
      background-color: #f7f7f7;
    }
  }
  &-container {
    width: 100%;
    height: fit-content;
    flex: 1;
    overflow-x: scroll;
    display: flex;
    align-items: center;
    will-change: width;

    &.left {
      justify-content: flex-start;
    }
    &.right {
      justify-content: flex-end;
    }
  }
  &-list {
    display: flex;
    height: 100%;
  }
  &-item {
    @extend %flex-center;
    white-space: nowrap;
    gap: 8px;
    cursor: pointer;
    border-radius: 4px 4px 0 0;
    padding: 8px 12px;
    background-color: #fff;
    transition-duration: 0.3s;
    color: #303133;
    border: 1px solid #ececec;
    border-bottom: 2px solid #40a0ff00;
    &.is-background {
      border-radius: 0;
      background-color: $is-background;

      &.is-active,
      &:hover {
        background-color: #fff;
      }
    }

    &:hover {
      background-color: #f7f7f7;
    }

    &.is-active {
      color: #409EFF;
      border-bottom: 2px solid #409EFF;
    }

    &-remove {
      @extend %flex-center;
      width: 20px;
      height: 20px;
      font-size: 1em !important;
      border-radius: 50%;
      background-color: #fff;
      color: #e9e9e9;
      transition-duration: 0.3s;
      &:hover {
        background-color: #e9e9e9;
        color: #fff;
      }
      &.is-active {
        color: #409EFF;
      }
    }

  }
}
</style>
