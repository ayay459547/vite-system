<script setup lang="ts">
import { getUuid } from '@/lib/lib_utils' // 工具
import { CustomIcon } from '@/components/feature' // 系統組件

import { version, props as lockViewProps } from './CustomLockViewInfo'

const scopedId = getUuid(version)

const props = defineProps(lockViewProps)

</script>

<template>
  <div class="lock-view-wrapper" :class="scopedId">
    <Transition name="fixed" mode="out-in">
      <div v-show="props.isLock" class="lock-view-container">
        <!-- 遮罩 -->
        <div class="lock-view-mask"></div>

        <!-- 鎖定 -->
        <div class="lock-view-description">
          <CustomIcon class="lock-view-icon" name="lock"/>
          <slot name="description">
            <span class="lock-view-text">{{ props.description }}</span>
          </slot>
        </div>
      </div>
    </Transition>

    <!-- 內容 -->
    <div class="lock-view-inner">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$fix-width: 12px;

div[class*="__CustomLockView"] {
  &.lock-view{
    &-wrapper,
    &-container {
      width: fit-content;
      height: fit-content;
      min: {
        width: 100%;
        height: 100%;
      }
      position: relative;
    }
  }
  .lock-view{
    &-mask {
      width: calc(100% + $fix-width * 2);
      height: calc(100% + $fix-width * 2);
      transform: translate(-$fix-width, -$fix-width);
      position: absolute;
      z-index: 3;
      opacity: 0.7;
      border: 3px dashed var(--el-color-primary) {
        radius: 12px;
      };
      background-color: var(--el-color-primary-light-8);
    }
    &-description {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 4;
      display: flex;
      flex-direction: column;
      // justify-content: center;
      align-items: center;
      padding: 32px;
      gap: 12px;
    }
    &-icon {
      color: var(--el-color-primary);
      font-size: 3rem;
    }
    &-text {
      font: {
        size: 1.5em;
        weight: 600;
      }
    }

    &-inner {
      display: contents;
    }
  }
}
</style>
