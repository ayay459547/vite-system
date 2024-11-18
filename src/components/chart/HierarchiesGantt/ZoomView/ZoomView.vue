<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { CustomIcon, CustomButton } from '@/components' // 系統組件

const props = defineProps({
  zoomRate: {
    type: Number,
    required: true
  },
  controller: {
    type: Object,
    required: true
  }
})

const sliderRef = ref(null)

const indicateRef = ref(null)
const indicateZoomRateX = computed({
  get: () => props.zoomRate,
  set: rate =>  props.controller.zoomView.setZoomRate(rate)

})
const indicateStyle = computed(() => {
  return `width: ${indicateZoomRateX.value * 100}%`
})
const indicateMove = (type, value?) => {
  const newZoomRateX = (() => {
    switch (type) {
      case 'add': return indicateZoomRateX.value + value
      case 'rate': return value
    }
  })()

  //限制在ZoomRateX在0 ~ 1的範圍內
  if(newZoomRateX > 1) indicateZoomRateX.value = 1
  else if(newZoomRateX < 0) indicateZoomRateX.value = 0
  else indicateZoomRateX.value = newZoomRateX

}

const zoomController = {
  isDraging: false,
  recordClientX: NaN,
  recordZoomRateX: NaN,
  dragStart (event) {
    if(this.isDraging) return
    this.isDraging = true

    const { clientX } = event
    this.recordClientX = clientX
    this.recordZoomRateX = indicateZoomRateX.value

  },
  dragMove (event) {
    if(!this.isDraging) return

    const { clientX } = event
    const moveX = clientX - this.recordClientX
    const newRate = this.recordZoomRateX +  (moveX / sliderRef.value.clientWidth)
    indicateMove('rate', newRate)
  },
  dragEnd() {
    this.isDraging = false
    this.recordClientX = NaN
    this.recordZoomRateX = NaN
  }
}
const dragController = {
  mousedown: event => {
    event.preventDefault()
    zoomController.dragStart(event)
  },
  mousemove: event => zoomController.dragMove(event),
  mouseup: () => zoomController.dragEnd()
}

onMounted(() => {
  indicateRef.value.addEventListener('mousedown', dragController.mousedown)
  window.addEventListener('mousemove', dragController.mousemove)
  window.addEventListener('mouseup', dragController.mouseup)
})
// const emit = defineEmits(['change'])


</script>

<template>
  <div
    class="zoom-wrapper"
  >

    <div class="zoom-bar-container">
      <div class="zoom-bar-slider"
        ref="sliderRef"
      >
        <div class="zoom-bar-indicate"
          ref="indicateRef"
          :style="indicateStyle"
        ></div>
      </div>
    </div>
    <div class="zoom-button-container">
      <CustomIcon
        class="zoom-button-icon"
        x-type="material"
        size="small"
        name="ZoomOutRound"
        @click="indicateMove('add', -0.05)"
      />
      <CustomIcon
        class="zoom-button-icon"
        x-type="material"
        name="ZoomInRound"
        size="small"
        @click="indicateMove('add', 0.05)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .zoom {
    &-wrapper {
      display: flex;
      width: 100%;
      height: fit-content;
      // height: 20px;
    }

    &-bar {
      &-container {
        display: flex;
        width: 100%;
        padding: 2px 8px;
        align-items: center;
      }
      &-slider {
        position: relative;
        width: 100%;
        height: 8px;
        border-radius: 4px;
        background-color: rgb(215, 215, 215);
        box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
      }
      &-indicate {
        position: relative;
        height: 100%;
        // width: 60%;
        border-radius: 4px;
        border: 1px solid rgb(30,144,255);
        background-color: rgb(165, 190, 214);
        &:before {
          content: '';
          position: absolute;
          border: 2px solid rgb(30,144,255);
          background-color: white;
          height: 100%;
          width: 12px;
          top: -2px;
          right: -10px;
          border-radius: 4px;
        }
      }
    }

    &-button {
      &-container {
        display: flex;
        width: fit-content;
        align-items: center;
        padding: 1px 4px;
        gap: 2px;
      }
      &-icon {
        display: flex;
        align-items: center;
        padding: 1px;
        &:hover {
          cursor: pointer;
          background-color: rgb(230, 230, 230);
          border-radius: 5px;
        }
      }
    }
  }
</style>