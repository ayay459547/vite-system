<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { CustomButton } from '@/components'

const drag = ref(null)
const active = ref(false)

const files = ref()

const emit = defineEmits(['file'])

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  active.value = false

  const _files = Array.from(e.dataTransfer.files)
  files.value = _files
  console.log(_files)
  emit('file', _files)
}

onMounted(() => {
  if (drag.value) {
    drag.value.addEventListener('drop', handleDrop)

    drag.value.addEventListener('dragleave', (e: DragEvent) => {
      active.value = false
      e.preventDefault()
    })

    drag.value.addEventListener('dragenter', (e: DragEvent) => {
      active.value = true
      e.preventDefault()
    })
    drag.value.addEventListener('dragover', (e: DragEvent) => {
      active.value = true
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

  const handleFiles = (e: Event) => {
    const _input = e.target as HTMLInputElement
    const _files = Array.from(_input.files)

    files.value = _files
    console.log(_files)
    emit('file', _files)
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
    min-height: 200px;
  }

  &-container {
    width: inherit;
    height: 300px;

    border: 3px dashed #dedede;
    background-color: #409eff00;

    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition-duration: 0.3s;
  }

  &-active {
    border: 3px dashed #409eff;
    background-color: #d9ecff;
  }
}
</style>
