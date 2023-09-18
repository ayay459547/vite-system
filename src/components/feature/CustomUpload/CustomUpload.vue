<script setup lang="ts">
import type { Hook } from '@/declare/hook'
import { ref, onMounted, onBeforeUnmount, nextTick, inject } from 'vue'
import type { PropType } from 'vue'
import { CustomButton, CustomEmpty, CustomIcon } from '@/components'
import {
  getFileType,
  byteConvert,
  readImage,
  readExcel
} from '@/lib/lib_files'
import { isEmpty, getUuid } from '@/lib/lib_utils'

import FilesView from './FilesView.vue'

export type FileType = '' | 'image' | 'excel' | 'word' | 'powerpoint' | 'zip'

interface Info {
  src?: string
  fileSize?: string
  fileType?: string
  excel?: any
}
export interface FileInfo extends Partial<File>, Info {
  uuid: string
}
export type FilesInfo = Array<FileInfo>

const props = defineProps({
  type: {
    type: String as PropType<FileType>,
    required: false,
    default: '',
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

const fileTypeMap = {
  image: ['image/png', 'image/jpeg'],
  word: [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  excel: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  powerpoint: [
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ],
  zip: [
    '',
    'application/x-zip-compressed'
  ],
  json: [
    'application/json'
  ]
}

const hook: Hook = inject('hook')
const { i18nTranslate, swal, loading, eventList } = hook()

const drag = ref(null)
const active = ref(false)

const files = ref<FileInfo[]>([])

const checkFilesType = (_files: Array<File>, fileType: FileType): boolean => {
  if (isEmpty(props.type)) return true

  return _files.every(_file => {
    if (fileTypeMap[fileType].includes(_file.type)) return true
    return false
  })
}

const initFilesData = async (_files: Array<File>) => {
  console.log(_files)
  if (checkFilesType(_files, props.type)) {
    _files.forEach(async (_file) => {
      const fileType = getFileType(_file)
      const {
        name,
        type,
        size,
        lastModified,
        webkitRelativePath
      } = _file

      const info: Info = {
        src: '',
        fileSize: byteConvert(size),
        fileType: fileType
      }

      switch (fileType) {
        case 'image':
          info.src = await readImage(_file)
          break
        case 'excel':
          info.excel = await readExcel(_file)
          break
        case 'word':
          break
        default:
          break
      }

      files.value.push({
        uuid: getUuid(),
        name,
        type,
        size,
        lastModified,
        webkitRelativePath,
        ...info
      })
    })
  } else {
    swal({
      icon: 'error',
      title: '上傳檔案失敗',
      text: '檔案資料格式錯誤'
    })
  }

  await nextTick()
  emit('file', files.value)
}

const remove = (fileIndex: number) => {
  files.value.splice(fileIndex, 1)
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
  input.multiple = props.multiple

  switch (props.type) {
    case 'image':
      input.accept = fileTypeMap.image.join(', ')
      break
    case 'word':
      input.accept = fileTypeMap.word.join(', ')
      break
    case 'excel':
      input.accept = ''
      break
    default:
      input.accept = ''
      break
  }

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
        <template v-if="isEmpty(files)">
          <CustomEmpty
            :image-size="100"
          >
            <template #image>
              <CustomIcon v-if="props.type === 'image'" name="image"/>
              <CustomIcon v-else name="file"/>
            </template>
            <template #description></template>
          </CustomEmpty>
        </template>
        <template v-else>
          <FilesView
            :files="files"
            :multiple="props.multiple"
            @remove="remove"
          />
        </template>

      </div>
      <CustomButton
        :label="`${i18nTranslate('upload')}${i18nTranslate('file')}`"
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

    transition-duration: 0.3s;
    &:hover {
      background-color: #f4f4f5a9;
    }
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
