<script setup lang="ts">
import { ElAlert, ElAutoResizer } from 'element-plus'

</script>

<template>
  <div class="page-error">
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
  width: fit-content;
  max-width: 100%;
  height: fit-content;
  max-height: 100%;
}
</style>
