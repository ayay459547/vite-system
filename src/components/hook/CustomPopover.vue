<script setup lang="ts">
import { ref } from 'vue'
import { ElPopover } from 'element-plus'

const visible = ref<boolean>(false)
const left = ref<number>(0)
const top = ref<number>(0)

interface EventItem {
  icon: string
  label: string
  event: Function
}

const openPopover = (click: MouseEvent, eventList?: Array<EventItem>) => {
  const { clientX, clientY } = click
  left.value = clientX
  top.value = clientY

  console.log(eventList)

  visible.value = false
  setTimeout(() => {
    visible.value = true
  }, 100)
}

const closePopover = () => {
  console.log('closePopover')
  if (visible.value) {
    visible.value = false
  }
}

defineExpose({
  openPopover,
  closePopover
})

</script>

<template>
  <div
    class="popover-container"
    :style="{
      left: left + 'px',
      top: top + 'px'
    }"
  >
    <ElPopover
      :visible="visible"
      placement="bottom"
      :width="200"
    >
      <ul>
        <li>123</li>
        <li>456</li>
        <li>789</li>
      </ul>
      <template #reference>
        <div
          v-click-outside="closePopover"
          class="popover-test"
          @click="visible = !visible"
        ></div>
      </template>
    </ElPopover>
  </div>
</template>

<style lang="scss" scoped>
.popover {
  &-container {
    width: fit-content;
    height: fit-content;
    position: fixed;
  }
  &-test {
    // display: none;
  }
}
</style>