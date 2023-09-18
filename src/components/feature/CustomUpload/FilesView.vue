<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import type { FilesInfo } from './CustomUpload.vue'
import { CustomIcon, CustomImage } from '@/components'
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

const getIcon = (fileType: string) => {
  switch (fileType) {
    case 'word': return 'file-word'
    case 'excel': return 'file-excel'
    case 'powerpoint': return 'file-powerpoint'
    case 'pdf': return 'file-pdf'
    case 'csv': return 'file-csv'
    case 'audio': return 'file-audio'
    case 'video': return 'file-video'
    case 'code': return 'file-code'
    case 'image': return 'file-image'
    case 'zip': return 'file-zipper'
    default: return 'file'
  }
}

</script>

<template>
  <div class="file">
    <template v-if="!isEmpty(props.files)">
      <!-- 多張圖片 -->
      <div class="file-multiple">
        <div
          v-for="(file, fileIndex) in props.files"
          :key="file.uuid"
          class="file-sigle"
        >
          <CustomImage
            v-if="file.fileType === 'image' && !isEmpty(file.src)"
            :src="file.src"
            fit="contain"
            :preview-src-list="previewSrcList"
            :initial-index="fileIndex"
          />
          <CustomIcon
            v-else
            class="file-icon"
            :class="`file-${file.fileType}`"
            :name="getIcon(file.fileType)"
          />

          <div class="file-info">
            <div
              v-i-fixed="{
                text: file.name,
                class: '',
                style: ''
              }"
              class="info-text ellipsis"
            >{{ file.name }}</div>
            <div class="info-size ellipsis">{{ file.fileSize }}</div>
          </div>

        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@mixin iconColor ($type, $color) {
  &-#{$type} {
    color: $color;
  }
}

.file {
  width: 100%;
  height: 100%;
  min-height: fit-content;

  &-multiple {
    width: 100%;
    height: 100%;
    display: flex;
    gap: 8px;
  }
  &-sigle {
    width: 150px;
    height: 100%;
    border-radius: 6px;
    padding: 8px;
    border: 1px solid #ddd;
  }
  &-icon {
    font-size: 8em !important;
    color: #909399;
  }
  @include iconColor('word', #409EFF);
  @include iconColor('excel', #67C23A);
  @include iconColor('powerpoint', #E6A23C);

  &-info {
    width: 100%;
    height: 100%;
    font-weight: 600;
    font-size: 1.1em;
    padding-top: 8px;
  }
}

</style>
