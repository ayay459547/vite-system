<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import type { FilesInfo } from './CustomUpload.vue'
import { CustomImage, CustomEmpty, CustomIcon } from '@/components'
import { isEmpty } from '@/lib/lib_utils'

const props = defineProps({
  multiple: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否可上傳多個檔案'
  },
  files: {
    type: Array as PropType<FilesInfo>,
    required: false,
    default: null,
    description: '上傳類型'
  }
})

const previewSrcList = computed(() => {
  return props.files.map(item => {
    return item.src
  })
})

</script>

<template>
  <div class="image">
    <template v-if="!isEmpty(props.files)">
      <!-- 多張圖片 -->
      <div class="image-multiple" v-if="props.multiple">
        <div
          v-for="(file, fileIndex) in props.files"
          :key="file.uuid"
          class="image-sigle"
        >
          <CustomImage
            :src="file.src"
            :preview-src-list="previewSrcList"
            :initial-index="fileIndex"
          />

          <div class="image-info">
            <div>{{ file.name }}</div>
            <div>{{ file.fileSize }}</div>
          </div>
        </div>
      </div>
      <!-- 單張圖片 -->
      <div class="image-sigle" v-else>
        <CustomImage
          :src="props.files[0].src"
          :preview-src-list="previewSrcList"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.image {
  width: 100%;
  height: fit-content;

  &-multiple {
    width: 100%;
    display: flex;
    gap: 8px;
  }
  &-sigle {
    width: 150px;
    width: 150px;
    border-radius: 6px;
    padding: 8px;
    border: 1px solid #ddd;
  }
}

</style>
