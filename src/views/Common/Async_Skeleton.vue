<script setup lang="ts">
import { ElSkeleton, ElSkeletonItem, ElAutoResizer } from 'element-plus'

</script>

<template>
  <div class="page-skeleton">
    <ElAutoResizer>
      <template #default="{ height, width }">
        <ElSkeleton
          :style="{
            width: `${width}px`,
            height: `${height}px`
          }"
          animated
        >
          <template #template>
            <ElSkeletonItem
              variant="text"
              :style="{
                width: `100%`,
                height: `${height}px`
              }"
            />
          </template>

          <template #default></template>
        </ElSkeleton>
      </template>
    </ElAutoResizer>
  </div>
</template>

<style lang="scss" scoped>
.page-skeleton {
  background-color: var(--i-color-system-page);
  width: fit-content;
  max-width: 100%;
  height: fit-content;
  max-height: 100%;
}
</style>
