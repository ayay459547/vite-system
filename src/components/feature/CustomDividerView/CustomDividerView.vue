<script setup lang="ts">
import { useSlots } from 'vue'
import { ElButton } from 'element-plus'

import { CustomIcon, CustomScrollbar } from '@/components'
import { getUuid } from '@/lib/lib_utils'

import { version, props as dividerViewProps } from './CustomDividerViewInfo'

const scopedName = '__i-divider-view__'
const scopedId = getUuid(scopedName)

const props = defineProps(dividerViewProps)

const slots = useSlots()
const hasSlot = (prop: string): boolean => {
  return !!slots[prop]
}
</script>

<template>
  <div
    class="divider-view-container"
    :class="[
      `CustomDividerView_${version}`,
      scopedId,
      scopedName
    ]"
  >
    <!-- 左邊 -->
    <div class="divider-view-left">
      <CustomScrollbar>
        <slot name="left"></slot>
      </CustomScrollbar>
    </div>
    <!-- 拖拉變更兩邊大小 -->
    <div class="divider-view-draggable">
      <div class="divider-view-btn">
        <CustomIcon name="chevron-left" class="left-icon"/>
        <CustomIcon name="chevron-right" class="right-icon"/>
      </div>
    </div>
    <!-- 右邊 -->
    <div class="divider-view-right">
      <CustomScrollbar>
        <slot name="right"></slot>
      </CustomScrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.__i-divider-view__ {
  &.divider-view {
    &-container {
      width: 100%;
      height: 100%;
      display: flex;
      border: 2px solid gray;
    }
  }
  .divider-view {
    &-draggable {
      width: 8px;
      height: 100%;
      background-color: var(--el-color-info-light-8);
      position: relative;
    }
    &-btn {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -100%);

      width: 24px;
      height: 24px;
      padding: 18px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--el-color-info-light-8);
      cursor: pointer;

      &:hover {
        .left-icon,
        .right-icon {
          background-color: var(--el-color-info-light-8);
        }
      }
    }

    &-left,
    &-right {
      flex: 1;
      width: 100%;
      height: 100%;
      padding: 6px;
    }
  }
}
</style>
