<script setup lang="ts">
import { type PropType, computed } from 'vue'

import { CustomIcon, CustomImage, CustomButton } from '@/components'
import { isEmpty } from '@/lib/lib_utils.ts'

import type { Custom } from './CustomUploadInfo'
import { getIcon, getIconClass } from './variable'

const props = defineProps({
  multiple: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否可上傳多個檔案'
  },
  files: {
    type: Array as PropType<Custom.FilesInfo>,
    required: false,
    default: null,
    description: '上傳類型'
  }
})

const emit = defineEmits(['remove'])

const previewSrcList = computed(() => {
  return props.files.map(item => {
    return item.src
  })
})
</script>

<template>
  <div class="__i-file">
    <template v-if="!isEmpty(props.files)">
      <!-- 多張圖片 -->
      <div class="__i-file-multiple">
        <div v-for="(file, fileIndex) in props.files" :key="file.uuid" class="__i-file-sigle">
          <div class="__file-icon">
            <CustomImage
              v-if="file.fileType === 'image' && !isEmpty(file.src)"
              :src="file.src"
              fit="contain"
              :preview-src-list="previewSrcList"
              :initial-index="fileIndex"
            />
            <CustomIcon
              v-else
              class="icon"
              :class="`file-${file.fileType}`"
              :name="getIcon(file.fileType)"
              :icon-class="getIconClass(file.fileType)"
            />
          </div>

          <div class="__i-file-info">
            <div class="info-text">{{ file.name }}</div>
            <div class="info-size">{{ file.fileSize }}</div>
          </div>

          <CustomButton
            type="danger"
            icon-name="trash-can"
            text
            @click="emit('remove', fileIndex)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@mixin icon-color($type, $color) {
  &-#{$type} {
    color: $color !important;
  }
}

.__i-file {
  width: 100%;
  height: 100%;
  min-height: fit-content;

  &-multiple {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  &-sigle {
    width: 100%;
    height: 70px;
    border-radius: 6px;
    padding: 8px;
    border: 1px solid #ddd;

    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    flex: 1;

    transition-duration: 0.3s;
    &:hover {
      background-color: #ecf5ff;
    }
  }
  &-icon {
    width: fit-content;
    min-width: 40px;
    height: inherit;
    .icon {
      font-size: 3em !important;
      line-height: 70px;
      color: #909399;
    }
  }
  @include icon-color('word', #409eff);
  @include icon-color('excel', #67c23a);
  @include icon-color('powerpoint', #e6a23c);

  &-info {
    width: 100%;
    height: 100%;
    font-weight: 600;
    font-size: 1.1em;
    padding-top: 8px;
    white-space: nowrap;
  }
}
</style>
