<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted, onUnmounted, ref, reactive, inject, nextTick, computed, watch } from 'vue'
import throttle from '@/lib/lib_throttle'

import type { UseHook } from '@/declare/hook'
import { CustomPopover } from '@/components'
// import { CustomPopover, SimpleFilter, CustomInput, CustomButton, CustomTabs, CustomDivider } from '@/components'
// import { isEmpty, message } from '@/lib/lib_utils'

const useHook: UseHook = inject('useHook')
const { swal, i18nTranslate } = useHook({
  i18nModule: 'auto_common'
})


const props = defineProps({
  message: {
    type: [Object, null] as PropType<any>,
    required: true
  }
})

onMounted(() => {
})



const recordPosition = reactive({
  left: NaN,
  top: NaN
})

const messageVisible = ref(true)
const messagePoisition = (() => {
  return [
    'position: absolute',
    `left: ${recordPosition.left}px`,
    `top: ${recordPosition.top}px`
  ]
})

const popoverStyle =  computed(() => {
  const translateX =  props.message.style.left - recordPosition.left
  const translateY =  props.message.style.top - recordPosition.top
  return  `
    border: 1px solid #c8c9cc;
    width: fit-content;
    transform: translateX(${translateX}px) translateY(${translateY}px);
  `
})

// const popoverStyle = `
//   border: 1px solid #c8c9cc;
//   width: fit-content;
// `
const popoverPlacement = () => {
  switch(props.message.type) {
    case 'orders2': return 'bottom'
    case 'editTimeLevel': return 'left'
    default: return 'top'
  }
}


// watch(
//   [
//     () => props.message.data,
//     () => props.message.type
//   ],
//   () => {
//     recordPosition.left = props.message.style.left
//     recordPosition.top = props.message.style.top
//   }
// )


onMounted(() => {
  recordPosition.left = props.message.style.left
  recordPosition.top = props.message.style.top
  // console.log(props.message)
})

const getStatusText = (item) => {
  const i18nKey = 'gantt-state-' + item.status
  return i18nTranslate(i18nKey)
}

</script>

<template>
  <CustomPopover
    :visible="messageVisible"
    :placement="popoverPlacement()"
    :popperStyle="popoverStyle"
  >
    <template #default>
      <template v-if="props.message.type === 'orders'">
        <div div class="popover-container orders">
          <template v-for="(item, index) in props.message.data" :key="index">
            <template v-if="index === 0">
              <div class="popover-data orders">
                <span> {{ `${i18nTranslate('workOrder-no')} :` /*工單編號*/ }} </span>
                <span> {{ `${item.orderIds}` }} </span>
              </div>
              <div class="popover-data orders">
                  <span> {{ `${i18nTranslate('route-orderIndex')} :` /*途程站點順序*/ }} </span>
                  <span> {{ `${item.moiIndex}` }} </span>
                </div>
              <div class="popover-data orders">
                <span> {{ `${i18nTranslate('workOrder-status')} :` /*工單狀態*/ }} </span>
                <span> {{ getStatusText(item) }} </span>
              </div>
              <div class="popover-data orders">
                <span> {{ `${i18nTranslate('process-no')} :` /*製程編號*/ }} </span>
                <span> {{ item.processId }} </span>
              </div>
              <div class="popover-data orders">
                <span> {{ `${i18nTranslate('machine-no')} :` /*機台編號*/ }} </span>
                <span> {{ item.machineId }} </span>
              </div>
              <div class="popover-data orders">
                <span> {{ `${i18nTranslate('estimate-startTime')} :`/*開始時間*/ }} </span>
                <span> {{ item.startDate }} </span>
              </div>
              <div class="popover-data orders">
                <span> {{ `${i18nTranslate('estimate-endTime')} :` /*結束時間*/ }} </span>
                <span> {{ item.endDate }} </span>
              </div>
            </template>
          </template>

        </div>
      </template>
      <template v-else-if="props.message.type === 'orders2'">
        <div div class="popover-container orders">
          <template v-for="(item, index) in props.message.data" :key="index">
            <template v-if="index === 0">
              <div class="popover-data orders">
                <span> {{ `${i18nTranslate('workOrder-no')} :` /*工單編號*/ }} </span>
                <span> {{ `${item.orderIds}` }} </span>
              </div>
              <div class="popover-data orders">
                <span> {{ `${i18nTranslate('route-orderIndex')} :` /*途程站點順序*/ }} </span>
                  <span> {{ `${item.moiIndex}` }} </span>
                </div>
              <div class="popover-data orders">
                <span> {{ `${i18nTranslate('workOrder-status')} :` /*工單狀態*/ }} </span>
                <span> {{ getStatusText(item) }} </span>
              </div>
              <div class="popover-data orders">
                <span> {{ `${i18nTranslate('process-no')} :` /*製程編號*/ }} </span>
                <span> {{ item.processId }} </span>
              </div>
              <div class="popover-data orders">
                <span> {{ `${i18nTranslate('machine-no')} :` /*機台編號*/ }} </span>
                <span> {{ item.machineId }} </span>
              </div>
              <div class="popover-data orders">
                <span> {{ `${i18nTranslate('estimate-startTime')} :`/*開始時間*/ }} </span>
                <span> {{ item.startDate }} </span>
              </div>
              <div class="popover-data orders">
                <span> {{ `${i18nTranslate('estimate-endTime')} :` /*結束時間*/ }} </span>
                <span> {{ item.endDate }} </span>
              </div>
            </template>
          </template>

        </div>
      </template>
      <template v-else-if="props.message.type === 'rushIndicate'">
        <div div class="popover-container orders">
          <template v-for="(item, index) in props.message.data" :key="index">
            <template v-if="index === 0">
              <div class="popover-data orders">
                <span> {{ `${i18nTranslate('workOrder-no')} :` /*工單編號*/ }} </span>
                <span> {{ `${item.orderIds}` }} </span>
              </div>
              <div class="popover-data orders">
                <span> {{ `${i18nTranslate('route-orderIndex')} :` /*途程站點順序*/ }} </span>
                <span> {{ `${item.moiIndex}` }} </span>
              </div>
              <div class="popover-data orders">
                <span> {{ `${i18nTranslate('workOrder-status')} :` /*工單狀態*/ }} </span>
                <span> {{ i18nTranslate('insert-order') /*'插單'*/ }} </span>
                <!-- <span> {{ item.statusStr }} </span> -->
              </div>
              <div class="popover-data orders">
                <span> {{ `${i18nTranslate('process-no')} :` /*製程編號*/ }} </span>
                <span> {{ item.processId }} </span>
              </div>
              <div class="popover-data orders">
                <span> {{ `${i18nTranslate('machine-no')} :` /*機台編號*/ }} </span>
                <span> {{ `${item.fromMachineId} → ${item.machineId}` }} </span>
              </div>
              <!-- <div> {{ item }}</div> -->
              <!-- <div class="popover-data orders">
                <span> {{ '開始時間 : ' }} </span>
                <span> {{ item.startTimeString }} </span>
              </div> -->
              <!-- <div class="message-data orders">
                <span> {{ `結束時間 : ` }} </span>
                <span> {{ item.data.endDate }} </span>
              </div> -->
            </template>
          </template>

        </div>
      </template>
      <!-- <template v-else-if="props.message.type === 'dragTimeLine'">
        <div div class="popover-container orders">
          <span> {{ '期望開工時間 : ' }} </span>
          <span> {{ props.message.data.text }} </span>
        </div>
      </template> -->
    </template>
    <template #reference>
      <div class="popover-reference" :style="messagePoisition()">
      </div>
       <!-- <div class="message-reference" >
       </div> -->
    </template>
  </CustomPopover>


</template>

<style lang="scss" scoped>
.message {
  &-wrapper {
    pointer-events: none;

  }

  &-container {
    position: relative;
    padding: 8px;
    min-height: 40px;
    z-index: 5;
    border: 1px solid #c8c9cc;
    background-color: white;
    border-radius: 2px;
    pointer-events: none;
    transform: translate(0, -100%);
    // overflow: hidden;
    // text-align: center;
    // justify-content: center;
    // align-content: center;
    box-shadow: 0px 1px 2px 1px lightgray;


    &.orders {
      width: fit-content;
      height: fit-content;
    }

    &:before {
      content: "";
      position: absolute;
      // background: red;
      top: 100%;
      left: 28px;
      border-top: solid 10px lightgray;
      border-left: solid 10px transparent;
      border-right: solid 10px transparent;




      // box-shadow: 0px 0px 5px 3px lightgray;
    }
    &:after {
      content: "";
      position: absolute;
      // background: red;
      top: 100%;
      left: 30px;
      border-top: solid 8px white;
      border-left: solid 8px transparent;
      border-right: solid 8px transparent;
      // box-shadow: 0px 0px 5px 3px lightgray;
    }


  }

  &-test {
    position: absolute;
  }

  &-data {
    &.rushable-cause {
      text-align: center;
      justify-content: center;
      align-content: center;
    }

    &.orders {
      font-size: 14px;
      display: flex;
      text-align: center;
      align-items: center;
      flex-wrap: nowrap;
      text-wrap: nowrap;
      padding: 4px;
      height: 24px;
      gap: 4px;
    }
  }



}

.popover {
  &-container {
    position: relative;
    width: fit-content;

    &.orders {
      width: fit-content;
      height: fit-content;
    }
    // padding: 8px;
  }
  &-data {
    &.rushable-cause {
      text-align: center;
      justify-content: center;
      align-content: center;
    }

    &.orders {
      font-size: 14px;
      color: black;
      display: flex;
      text-align: center;
      align-items: center;
      flex-wrap: nowrap;
      text-wrap: nowrap;
      padding: 4px;
      height: 24px;
      gap: 4px;
    }
  }
}



</style>
