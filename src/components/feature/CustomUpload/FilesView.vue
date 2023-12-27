<script setup lang="ts">
import { type PropType, computed } from 'vue'

// import type { Hook } from '@/declare/hook'
import { CustomIcon, CustomImage, CustomButton } from '@/components'
import { isEmpty, getUuid } from '@/lib/lib_utils'

import type { FilesInfo } from './CustomUpload.vue'

// const hook: Hook = inject('hook')
// const { i18nTranslate, swal, eventList } = hook()

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

const emit = defineEmits(['remove'])

const scopedId = getUuid('__i-file__')

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
  <div class="__i-file" :class="scopedId">
    <template v-if="!isEmpty(props.files)">
      <!-- 多張圖片 -->
      <div class="__i-file-multiple">
        <div
          v-for="(file, fileIndex) in props.files"
          :key="file.uuid"
          class="__i-file-sigle"
        >
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
@mixin iconColor ($type, $color) {
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
  @include iconColor('word', #409EFF);
  @include iconColor('excel', #67C23A);
  @include iconColor('powerpoint', #E6A23C);

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
