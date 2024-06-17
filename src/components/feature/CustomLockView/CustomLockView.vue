<script setup lang="ts">
import { getUuid } from '@/lib/lib_utils'
import { CustomIcon } from '@/components'

import { version, props as lockViewProps } from './CustomLockViewInfo'

const scopedName = '__i-lock-view__'
const scopedId = getUuid(scopedName)

const props = defineProps(lockViewProps)

</script>

<template>
  <div
    class="lock-view-wrapper"
    :class="[
      `CustomLockView_${version}`,
      scopedId,
      scopedName
    ]"
  >
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

.__i-lock-view__ {
  &.lock-view{
    &-wrapper,
    &-container {
      width: fit-content;
      height: fit-content;
      min-width: 100%;
      min-height: 100%;
      position: relative;
    }
  }
  .lock-view{
    &-mask {
      width: calc(100% + $fix-width * 2);
      height: calc(100% + $fix-width * 2);
      transform: translate(-$fix-width, -$fix-width);
      position: absolute;
      z-index: 1;
      opacity: 0.7;
      border: 3px dashed var(--el-color-primary);
      border-radius: 12px;
      background-color: var(--el-color-primary-light-8);
    }
    &-description {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 1;
      display: flex;
      flex-direction: column;
      // justify-content: center;
      align-items: center;
      padding: 32px;
      gap: 12px;
    }
    &-icon {
      color: var(--el-color-primary);
      font-size: 3em;
    }
    &-text {
      font-size: 1.5em;
      font-weight: 600;
    }

    &-inner {
      display: contents;
    }
  }
}
</style>
