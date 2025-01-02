<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'

import { CustomPopover, CustomButton, CustomBadge, CustomTooltip } from '@/components' // 系統組件

import type { Props } from '../CustomSearchInfo'

const props = defineProps({
  isDot: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  isVisible: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  isActiveConditions: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  // CustomSearch
  isCondition: {
    type: Boolean as PropType<Props.IsCondition>,
    required: false,
    default: false,
    description: '是否為條件搜尋'
  },
  width: {
    type: [String, Number] as PropType<Props.Width>,
    required: false,
    default: 300,
    description: '寬度'
  },
  placement: {
    type: String as PropType<Props.Placement>,
    required: false,
    default: 'bottom',
    description: '出現位置'
  },
  search: {
    type: Boolean as PropType<Props.Search>,
    required: false,
    default: false,
    description: '是否只顯示搜尋按鈕'
  }
})

const emit = defineEmits(['visible-change'])
const visibleChange = (v: boolean) => {
  emit('visible-change', v)
}

const popverWidth = computed(() => {
  if (!props.isCondition) return 300
  return props.isActiveConditions ? 500 : 350
})

</script>

<template>
  <div class="__search-container">
    <div class="__search-top">
      <CustomTooltip
        placement="top"
        trigger="hover"
        :offset="6"
        :show-after="600"
      >
        <template #content>
          <slot name="label"></slot>
        </template>
        <slot name="label"></slot>
      </CustomTooltip>

      <div v-if="props.search" @click="visibleChange(!props.isVisible)">
        <!-- 由於切換畫面跑版 所以分兩個 -->
        <CustomBadge v-if="props.isDot" is-dot>
          <CustomButton icon-name="magnifying-glass" circle text />
        </CustomBadge>
        <CustomButton v-else icon-name="magnifying-glass" circle text />
      </div>
      <div v-else>
        <slot name="switch"></slot>
      </div>
    </div>

    <!-- 只顯示搜尋按鈕 -->
    <template v-if="props.search">
      <CustomPopover
        :visible="props.isVisible"
        :width="popverWidth"
        placement="bottom"
        popper-class="__search-popover"
        popper-style="max-width: 100vw;"
      >
        <div class="__search-detail">
          <div class="__search-top">
            <slot name="label"></slot>
            <slot name="switch"></slot>
          </div>
          <slot name="input"></slot>
        </div>

        <template #reference>
          <div></div>
        </template>
      </CustomPopover>

      <Teleport to="body">
        <div
          v-if="props.isVisible"
          class="__search-close"
          @click="visibleChange(false)"
        ></div>
      </Teleport>
    </template>
    <!-- 直接全部顯示 -->
    <template v-else>
      <slot name="input"></slot>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.__search {
  &-container {
    width: 100%;
    max-width: 100%;
    min-width: fit-content;
    height: fit-content;
  }
  &-top {
    width: calc(100% - 2px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    gap: 2px;
  }

  &-detail {
    flex: 1;
    width: 100%;
    height: fit-content;
    max-height: 50vh;
    overflow: auto;
    padding-right: 8px;
  }

  &-close {
    position: absolute;
    z-index: var(--i-z-index-search-close);
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: var(--el-color-black);
    opacity: 0.1;
    // pointer-events: none;
  }
}
</style>

<style lang="scss">
.__search {
  &-popover {
    z-index: var(--i-z-index-search-detail) !important;
  }
}
</style>
