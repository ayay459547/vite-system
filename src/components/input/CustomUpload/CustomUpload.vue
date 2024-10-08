<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, inject, computed } from 'vue'

import type { UseHook } from '@/declare/hook'
import { CustomButton, CustomEmpty, CustomIcon } from '@/components'
import {
  getFileType,
  byteConvert,
  // readExcel,
  readImage
} from '@/lib/lib_files'
import { swal, isEmpty, getUuid, deepClone, getProxyData } from '@/lib/lib_utils'
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Types, Emits, Expose } from './CustomUploadInfo'
import { version, props as uploadProps } from './CustomUploadInfo'
import { getFileTypeList, getIconClass } from './variable'

import FilesView from './FilesView.vue'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

const scopedId = getUuid('__i-upload__')

const props = defineProps(uploadProps)

const emit = defineEmits(['file'])

const drag = ref(null)
const active = ref(false)

const targetList: File[] = []
const files = ref<Types.FilesInfo>([])

const limitTypeList = computed(() => {
  if (isEmpty(props.limitType)) return []

  const _limitType = Array.isArray(props.limitType) ? props.limitType : [props.limitType]
  return getFileTypeList(_limitType)
})

/**
 * 確認檔案類型是否符合條件
 * @param {Array} _files 檔案列表
 * @param fileType 類型
 * @returns {Boolean} 是否符合
 */
const checkFilesType = (_files: Array<File>): boolean => {
  if (isEmpty(props.limitType)) return true

  return _files.every(_file => {
    if (limitTypeList.value.includes(_file.type)) return true
    return false
  })
}

// 能顯示的數量 (能上傳的數量)
const showCount = ref(1)
const isLoading = ref(false)
// 初始化檔案的資料
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

  if (!checkFilesType(Array.from(target))) {
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
    const { name, type, size, lastModified, webkitRelativePath } = _target

    const info: Types.Info = {
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
        // info.excel = await readExcel(_target)
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
    console.log(files.value)
    onFile(files.value, targetList)
    isLoading.value = false
  }, 500)
}

const remove = async (fileIndex: number) => {
  files.value.splice(fileIndex, 1)
  targetList.splice(fileIndex, 1)

  await nextTick()
  setTimeout(() => {
    onFile(files.value, targetList)
  }, 500)
}

const onFile: Emits.File = (files: Types.FilesInfo, targetList: File[]) => {
  emit('file', files, targetList)
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
  input.accept = limitTypeList.value.join(', ')

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

const getFormData: Expose.GetFormData = () => {
  const _formData = new FormData()
  for (const _target of targetList) {
    _formData.append('file', _target)
  }
  return _formData
}

const getFiles: Expose.GetFiles = () => {
  const _files = getProxyData(files.value)
  return deepClone<Types.FilesInfo>([], _files)
}

defineExpose({
  getFormData,
  getFiles
})
</script>

<template>
  <div
    v-loading="isLoading"
    class="__upload-wrapper"
    :class="`CustomUpload_${version} ${scopedId}`"
  >
    <div ref="drag" class="__upload-container" :class="[{ '__upload-active': active }]">
      <div v-if="isEmpty(files)">
        <CustomEmpty :image-size="60">
          <template #image>
            <CustomIcon name="file-arrow-up" :icon-class="getIconClass('file')" />
          </template>
          <template #description> </template>
        </CustomEmpty>
      </div>
      <div v-else class="__upload-file">
        <FilesView :files="files" :multiple="props.multiple" @remove="remove" />
      </div>

      <CustomButton
        :label="`${i18nTranslate(['select', 'file'])}`"
        icon-name="cloud-arrow-up"
        size="large"
        type="primary"
        @click="onClick"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.__upload {
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

    background-color: #409eff00;
    border: 3px dashed #dedede {
      radius: 6px;
    }

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
