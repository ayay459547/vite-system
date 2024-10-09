<script setup lang="ts">
import { ref, onMounted, nextTick, computed, inject } from 'vue'
import type { UseHook, SwalResult } from '@/declare/hook'
// import { isEmpty, deepClone, hasOwnProperty } from '@/lib/lib_utils'
import {
  CustomButton
  // CustomDraggable,
  // CustomEmpty,
  // CustomPopover,
  // CustomIcon
} from '@/components'
import CustomIcon from '@/components/feature/CustomIcon/CustomIcon.vue';
// import { rushOrderFromWeb, getRushOrders} from './api'

// const useHook: UseHook = inject('useHook')
// const { i18nTranslate, swal, permission } = useHook({
//   i18nModule: 'dmd_common'
// })

const useHook: UseHook = inject('useHook')
const { swal, i18nTranslate } = useHook({
  i18nModule: 'auto_common'
})


const props = defineProps({
  i18nTitle: {
    type: String,
    default: ''
  },
  visible: {
    type: Boolean,
    required: true
  }
})



const emit = defineEmits(['update:visible', 'change'])

// const windowLeft = ref(100)
// const windowTop = ref(200)
const windowTransformX = ref(0)
const windowTransformY = ref(0)
const windowWrapperStyle = computed(() => {
  const transformX = windowTransformX.value + 'px'
  const transformY = windowTransformY.value + 'px'
  return [
    // `left: ${windowLeft.value}px`,
    // `top: ${windowTop.value}px`
    `transform: translateX(${transformX}) translateY(${transformY})`
  ]
})

const dragHeaderRef = ref(null)
const dragController = {
  isDragging: false,
  recordClientX: NaN,
  recordClientY: NaN,
  // recordLeft: NaN,
  // recordTop: NaN,
  recordTransFormX: NaN,
  recordTransFormY: NaN,
  dragStart(event) {
    if(dragController.isDragging) return

    dragController.isDragging = true
    dragController.recordClientX = event.clientX
    dragController.recordClientY = event.clientY
    // dragController.recordLeft = windowLeft.value
    // dragController.recordTop = windowTop.value
    dragController.recordTransFormX = windowTransformX.value
    dragController.recordTransFormY = windowTransformY.value
    // console.log( dragController.recordLeft, dragController.recordTop)

  },
  dragMove(event) {
    if(!dragController.isDragging) return

    // console.log( dragController.recordLeft, dragController.recordTop)
    const moveX = event.clientX - dragController.recordClientX
    const moveY = event.clientY - dragController.recordClientY
    // windowLeft.value =  moveX + dragController.recordLeft
    // windowTop.value =  moveY + dragController.recordTop
    windowTransformX.value = moveX + dragController.recordTransFormX
    windowTransformY.value = moveY + dragController.recordTransFormY
    // console.log([moveX, moveY])
  },
  dragEnd() {
    if(!this.isDragging) return
    //Reset Controller
    this.isDragging = false
    this.recordClientX = NaN
    this.recordClientY = NaN
    // this.recordLeft = NaN
    // this.recordTop = NaN
    this.recordTransFormX = NaN
    this.recordTransFormY = NaN
  }
}

const dragStart = event => {dragController.dragStart(event)}
const dragMove = event => {dragController.dragMove(event)}
const dragEnd = () => {dragController.dragEnd()}
onMounted(() => {
  dragHeaderRef.value.addEventListener('mousedown', dragStart)
  window.addEventListener('mousemove', dragMove)
  window.addEventListener('mouseup', dragEnd)
})

const windowVisible = ref(true)
const windowWrapperRef = ref(null)


const closeWindow = () => {
  emit('update:visible', false)
  // windowVisible.value = false
}


</script>

<template>
  <Teleport to="body">
  <div
    class="window-wrapper"
    v-show="props.visible"
    ref="windowWrapperRef"
    :style="windowWrapperStyle"
  >
    <div class="window-container">
      <div class="window-header"
        ref="dragHeaderRef"
      >
        <div class="window-header-left">
          <CustomIcon
            class="window-header-left-icon"
            x-type="carbon"
            name="ZoomArea"
          />
          <div>{{ `${i18nTranslate(props.i18nTitle)}` }}</div>
        </div>
        <CustomButton
          icon-name="xmark"
          icon-size="small"
          size="small"
          text
          @click="closeWindow"
        />
      </div>
      <div class="window-body">
        <slot name="default"></slot>
      </div>
    </div>

  </div>
</Teleport>
</template>



<style lang="scss" scoped>
 .window {
  &-wrapper {
    z-index: 2010;
    position: fixed;
    display: flex;
    width:  400px;
    height: 302px; // 300+2, 2為配合border佔位
    // box-sizing: content-box;
    border: 1px solid lightgray;

    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 4px 0px;


    // flex: 1;
    // top: 20%;
    // left: 20%;
    right: 55px;
    bottom: 15px;
  }

  &-container {
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    width: 100%;
    height: 100%;
    // max-height: 100%;
    // padding: 1px;
    background-color: white;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    padding: 1px;
    width: 100%;
    height: fit-content;
    background-color: rgb(197, 207, 215);
    border: 1px solid #cacaca;
    // box-shadow: inset 0px -1px 1px rgb(136, 136, 136);

    &-left {
      font-weight: bold;
      font-size: 14px;
      padding-left: 4px;
      padding-right: 4px;
      gap: 6px;
      display: flex;
      text-align: center;
      align-items: center;

      &-icon {
        display: flex;
        align-items: center;
      }

    }

    // height: 25px;
  }
  &-body {
    position: relative;
    display: flex;
    width: 100%;
    // max-height: 268px;
    flex-grow: 1;

  }
 }

</style>