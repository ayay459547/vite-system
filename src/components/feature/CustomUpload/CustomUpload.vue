<script setup lang="ts">
import type { Hook } from '@/declare/hook'
import {
  ref,
  // unref,
  onMounted,
  onBeforeUnmount,
  nextTick,
  inject
} from 'vue'
import type { PropType } from 'vue'
import { CustomButton, CustomEmpty, CustomIcon } from '@/components'
import {
  getFileType,
  byteConvert,
  readImage,
  readExcel
} from '@/lib/lib_files'
import {
  isEmpty,
  getUuid,
  deepClone,
  getProxyData,
  usePageI18n
} from '@/lib/lib_utils'

import FilesView from './FilesView.vue'

import i18nMessage from './i18n'

export type FileType = '' | 'image' | 'excel' | 'word' | 'powerpoint' | 'zip'

interface Info {
  src?: string
  fileSize?: string
  fileType?: string
  fileTarget?: File
  excel?: any[]
  properties?: any
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
  overwrite: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否再上傳清空原來的檔案'
  },
  multiple: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
    description: '是否可上傳多個檔案'
  },
  limitCount: {
    type: [Number, null] as PropType<number | null>,
    required: false,
    default: null,
    description: '限制檔案數量'
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
const { swal } = hook()
const { i18nTranslate } = usePageI18n(i18nMessage)

const drag = ref(null)
const active = ref(false)

const targetList: File[] = []
const files = ref<FilesInfo>([])

const checkFilesType = (_files: Array<File>, fileType: FileType): boolean => {
  if (isEmpty(props.type)) return true

  return _files.every(_file => {
    if (fileTypeMap[fileType].includes(_file.type)) return true
    return false
  })
}

const showCount = ref(1)
const isLoading = ref(false)
const initFilesData = async (target: FileList) => {
  isLoading.value = true
  if (props.overwrite) {
    targetList.splice(0)
    files.value.splice(0)
  }

  const total = target.length + files.value.length
  if (total > showCount.value) {
    swal({
      icon: 'error',
      title: '上傳檔案失敗',
      text: '超過檔案上傳數量限制',
      showCancelButton: false
    })
    isLoading.value = false
    return
  }

  if (!checkFilesType(Array.from(target), props.type)) {
    swal({
      icon: 'error',
      title: '上傳檔案失敗',
      text: '檔案資料格式錯誤',
      showCancelButton: false
    })
    isLoading.value = false
    return
  }

  for (const _target of target) {
    targetList.push(_target)

    const fileType = getFileType(_target)
    const {
      name,
      type,
      size,
      lastModified,
      webkitRelativePath
    } = _target

    const info: Info = {
      src: '',
      fileSize: byteConvert(size),
      fileType: fileType,
      fileTarget: _target
    }

    switch (fileType) {
      case 'image':
        info.src = await readImage(_target)
        break
      case 'excel':
        info.excel = await readExcel(_target)
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
  }

  await nextTick()
  setTimeout(() => {
    emit('file', files.value, targetList)
    isLoading.value = false
  }, 500)
}

const remove = async (fileIndex: number) => {
  files.value.splice(fileIndex, 1)
  targetList.splice(fileIndex, 1)

  await nextTick()
  setTimeout(() => {
    emit('file', files.value, targetList)
  }, 500)
}

const handleDrop = (e: DragEvent) => {
  e.stopPropagation()
  e.preventDefault()
  active.value = false

  const target = e.dataTransfer.files
  initFilesData(target)
}

onMounted(() => {
  if (props.multiple) {
    showCount.value = Infinity
  } else {
    showCount.value = 1
  }
  if (!isEmpty(props.limitCount)) {
    showCount.value = props.limitCount
  }

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
    const target = _input.files

    initFilesData(target)

    await nextTick()
    input.remove()
  }
  input.addEventListener('change', handleFiles, false)
}

const getIcon = (type: string) => {
  switch (type) {
    case 'image': return 'image'
    case 'excel': return 'file-excel'
    case 'word': return 'file-word'
    case '':
    default:
      return 'file'
  }
}
const getText = (type: string) => {
  switch (type) {
    case 'image': return 'image'
    case 'excel': return 'excel'
    case 'word': return 'word'
    case '':
    default:
      return 'file'
  }
}

defineExpose({
  getFormData () {
    const _formData = new FormData()
    for (const _target of targetList) {
      _formData.append('file', _target)
    }
    return _formData
  },
  getFiles () {
    const _files = getProxyData(files.value)
    return deepClone([], _files)
  }
})

</script>

<template>
  <div v-loading="isLoading" class="upload-wrapper">
    <div
      ref="drag"
      class="upload-container"
      :class="[{'upload-active': active}]"
    >
      <div v-if="isEmpty(files)">
        <CustomEmpty :image-size="60">
          <template #image>
            <CustomIcon :name="getIcon(props.type)"/>
          </template>
          <template #description>
            <!-- <span>{{ i18nTranslate(getText(props.type)) }}</span> -->
          </template>
        </CustomEmpty>
      </div>
      <div v-else class="upload-file">
        <FilesView
          :files="files"
          :multiple="props.multiple"
          @remove="remove"
        />
      </div>

      <CustomButton
        :label="`${i18nTranslate('select')}${i18nTranslate(getText(props.type))}`"
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
    height: 100%;
    padding: 8px 0;
  }

  &-active {
    border: 3px dashed #409eff;
    background-color: #d9ecff;
  }
}
</style>
