<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import type { PropType } from 'vue'
import { CustomButton } from '@/components'
import { getFileType, readImage } from '@/lib/lib_files'
import { isEmpty, getUuid } from '@/lib/lib_utils'

import ImagesView from './ImagesView.vue'

export type FileType = '' | 'image'

interface Info {
  src?: string
}
export interface FileInfo extends Partial<File>, Info {
  uuid: string
}

export type FilesInfo = Array<FileInfo>

const props = defineProps({
  type: {
    type: [Array, String] as PropType<FileType[] | FileType>,
    required: false,
    default: null,
    description: '上傳類型'
  },
  multiple: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否可上傳多個檔案'
  },
  limitType: {
    type: [Array, String] as PropType<FileType[] | FileType>,
    required: false,
    default: null,
    description: '限制檔案類型'
  }
})

const emit = defineEmits(['file'])

const drag = ref(null)
const active = ref(false)

const files = ref<FileInfo[]>([])

const initFilesData = async (_files: Array<File>) => {
  _files.forEach(async (_file) => {
    const fileType = getFileType(_file)

    const info: Info = {
      src: ''
    }

    switch (fileType) {
      case 'image':
        info.src = await readImage(_file)
        break
      default:
        break
    }

    files.value.push({
      uuid: getUuid(),
      ..._file,
      ...info
    })
  })

  await nextTick()
  emit('file', files.value)
}

const handleDrop = (e: DragEvent) => {
  e.stopPropagation()
  e.preventDefault()
  active.value = false

  const _files = Array.from(e.dataTransfer.files)
  initFilesData(_files)
}

onMounted(() => {
  if (drag.value) {
    drag.value.addEventListener('drop', handleDrop)

    drag.value.addEventListener('dragleave', (e: DragEvent) => {
      active.value = false
      e.stopPropagation()
      e.preventDefault()
    })

    drag.value.addEventListener('dragenter', (e: DragEvent) => {
      active.value = true
      e.stopPropagation()
      e.preventDefault()
    })
    drag.value.addEventListener('dragover', (e: DragEvent) => {
      active.value = true
      e.stopPropagation()
      e.preventDefault()
    })
  }
})

onBeforeUnmount(() => {
  if (drag.value) {
    drag.value.removeEventListener('drop', handleDrop)
  }
})

const onClick = () => {
  const input = document.createElement('input')
  input.type = 'file'

  input.style.display = 'none'
  document.body.appendChild(input)
  input.click()

  const handleFiles = async (e: Event) => {
    const _input = e.target as HTMLInputElement
    const _files = Array.from(_input.files)
    initFilesData(_files)

    await nextTick()
    input.remove()
  }
  input.addEventListener('change', handleFiles, false)
}

</script>

<template>
  <div class="upload-wrapper">
    <div
      ref="drag"
      class="upload-container"
      :class="[{'upload-active': active}]"
    >
      <div class="upload-file">
        <template v-if="props.type === 'image'">
          <ImagesView
            :files="files"
            :multiple="props.multiple"
          />
        </template>

      </div>
      <CustomButton
        label="檔案上傳"
        icon-name="cloud-arrow-up"
        size="large"
        type="primary"
        @click="onClick"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.upload {
  &-wrapper {
    width: 100%;
    height: fit-content;
  }

  &-container {
    width: inherit;
    height: fit-content;

    border: 3px dashed #dedede;
    background-color: #409eff00;

    border-radius: 6px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition-duration: 0.3s;
    gap: 8px;
    padding: 16px;
  }

  &-file {
    width: 100%;
    height: fit-content;
    padding: 8px 0;
  }

  &-active {
    border: 3px dashed #409eff;
    background-color: #d9ecff;
  }
}
</style>
