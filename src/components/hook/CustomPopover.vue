<script setup lang="ts">
import { ElPopover } from 'element-plus'

</script>

<template>
  <div class="popover-container">
    <ElPopover
      placement="top-start"
      title="Title"
      :width="200"
      trigger="hover"
      content="this is content, this is content, this is content"
    >
      <template #reference>
        <el-button class="m-2">Hover to activate</el-button>
      </template>
    </ElPopover>
  </div>
</template>

<style lang="scss" scoped>
.popover {
  &-container {
    width: fit-content;
    height: fit-content;
  }
}
</style>