<script setup lang="ts">
import { ref, onMounted, inject, nextTick, computed } from 'vue'
import type { UseHook, SwalResult } from '@/declare/hook'

import { isEmpty, deepClone, hasOwnProperty, awaitTime } from '@/lib/lib_utils'
import {
  CustomButton,
  CustomDraggable,
  CustomEmpty,
  CustomPopover,
  CustomIcon
} from '@/components'
import { rushOrderFromWeb, updateRushOrder,  getRushOrders, getRushableMachine} from './api'
import dayjs from 'dayjs'

// 檢查排停
import SchedulingObserver from '@/components/views/APS_Automation/SchedulingObserver/SchedulingObserver.vue'

const useExpectTime = false

const useHook: UseHook = inject('useHook')
const { auth, i18nTranslate, swal, permission } = useHook({
  i18nModule: 'auto_common'
})
const authData = auth()

// 是否為排程中
const isScheduling = ref(true)
const schedulingRef = ref(null)
const resetScheduling = () => { schedulingRef.value.reset() }

type RushItems = Array<MachineItem>
type MachineItem = {
  machineId: string
  rushOrders: Array<OrderItem>
}
type OrderItem = {
  type: 'new' | 'old'
  machineId: string
  processId: string
  orderIds: string
  data?
}



const displayMachines = ref<Array<string>>([])
const addDisplayMachine = (newMachineId:string) => {
  const isExist = displayMachines.value.includes(newMachineId)
  if(!isExist) {
    displayMachines.value.push(newMachineId)
    if(!editRushMachineMap.has(newMachineId)) {
      const allEditOrder = [...editRushMachineMap.values()].flat()
      const originOrders = deepClone([], originRushMachineMap.get(newMachineId) ?? [])
      const newOrders = originOrders.filter(originOrder => {
        return !allEditOrder.some(editOrder => editOrder.orderKey === originOrder.orderKey)
      })

      // console.log(originOrders, allEditOrder, newOrders)


      editRushMachineMap.set(newMachineId, newOrders)
    }
  }
}
const removeDisplayMachine = (newMachineId:string) => {
  const spliceIndex = displayMachines.value.findIndex(existMachineId => existMachineId === newMachineId )
  if(spliceIndex >= 0) {
    displayMachines.value.splice(spliceIndex, 1)


    const machineEditOrders = editRushMachineMap.get(newMachineId) ?? []
    machineEditOrders.forEach(editOrder => {
      const originOrder = getOriginOrder(editOrder)
      if(originOrder) {
        const originMachine = originOrder.machineId
        if(originMachine !== newMachineId) {
          const targetOrders = editRushMachineMap.get(originMachine)
          addOrderItem(targetOrders, originOrder)
          // targetOrders.push(originOrder)
          sortOrders(targetOrders)
        }
      }
    })

    editRushMachineMap.delete(newMachineId)
  }
}

const computedRushMachineMap = computed(() => {
  const entries = displayMachines.value.map(machineId => {
    return [machineId, editRushMachineMap.get(machineId)]
  })

 return Object.fromEntries(entries)
})
const refreshDisplayMachine = () => {
  // Computed僅響應在監聽值的變更，需要給列重新賦值刷新畫面
  displayMachines.value = deepClone([], displayMachines.value.filter(machineId => !isEmpty(editRushMachineMap.get(machineId))))
}

const emit = defineEmits(['delete', 'reset'])
const props = defineProps({
  rushMap: {
    type: Map,
    required: true
  },
  controller: {
    type: Object,
    required: true
  }
})

// CustomDrag Style
const containerStyle = {
  // 'background-color': 'white'
}
const orderListStyle = {
  // width: '100%',
  // gap: '2px'
  // 'background-color': 'white'
}
const orderStyle = {
  width: 'fit-content',
  padding: '0px',
  'border-bottom': 'none'
  // 'background-color': 'white'
}

const rushItems = ref<RushItems>([])
type DeletType = 'machine' | 'order' | 'index'
const deleteItem = (value, type: DeletType) => {
  // console.log(value, type)
  switch (type) {
    case 'machine': {
      removeDisplayMachine(value)
      break
    }
    case 'order': {
      const { machineId, type } = value
      const  machineRushOrders = editRushMachineMap.get(machineId)

      const deleteIndex = machineRushOrders.findIndex(item => item === value)
      if(deleteIndex >= 0) machineRushOrders.splice(deleteIndex, 1)

      // 工單是否存在於編輯前的插單設定
      // 有則新增type:remove的工單在機台
      const originOrder = getOriginOrder(value)
      if(originOrder) {
        const originMachineId = originOrder.machineId
        if(originMachineId === machineId) {
        // 從編輯前插單設定複製一個新的工單
          const removeOrder = deepClone({}, originOrder)
          // 將新工單type變更為remove，原本value.type為remove則維持old
          if(type === 'remove') removeOrder.type = 'old'
          else  removeOrder.type = 'remove'

          addOrderItem(machineRushOrders, removeOrder)
          // machineRushOrders.push(removeOrder)
        }
        else {
          // 從編輯前插單設定複製一個新的工單
          const oldOrder = deepClone({}, originOrder)
          const originMachineRushOrders = editRushMachineMap.get(originMachineId)
          if(originMachineRushOrders) {
            addOrderItem(originMachineRushOrders, oldOrder)
            //originMachineRushOrders.push(oldOrder)
          }
        }
      }


      break
    }
    case 'index': {
      const { machineIndex, orderIndex } = value
      if(orderIndex < 0) return
      const machineItem = rushItems.value[machineIndex]

      machineItem.rushOrders.splice(orderIndex, 1)
      break
    }
  }


  refreshDisplayMachine()
  props.controller.ganttData.setEditOrder()
  props.controller.ganttCanvas.setLevelInfo('reset')
  // setRushMachines()

  // console.log('AFTER DELETE', rushItems.value)
}
const sendRushOrders = () => {
  swal({
    icon: 'question',
    title: i18nTranslate('rushmanage-swal-confirmTitle') /*'是否完成編輯'*/,
    text: i18nTranslate('rushmanage-swal-confirmText') /*'確認後系統將根據編輯設定重新排程'*/
    // html: ''
  }).then(async (result: SwalResult) => {
    if (result.isConfirmed) {

      const rushSetting = displayMachines.value.map(machineId => {
        return {
          machineId,
          rushOrders: editRushMachineMap.get(machineId) ?? []
        }
      })


      const userName = authData?.user?.fullName ?? ''
      const { status, msg} = await updateRushOrder(rushSetting, userName)
      // const { status, msg} = await rushOrderFromWeb(rushSetting)
      if (status === 'success') {
        swal({
          icon: 'success',
          title: i18nTranslate('rushmanage-swal-successTitle') /*'編輯成功'*/,
          text: i18nTranslate('rushmanage-swal-successText') /*'系統排程中，請稍後'*/,
          showCancelButton: false
        })

        resetScheduling()
      }
      else {
        swal({
          icon: 'error',
          title: i18nTranslate('edit-failed') /*'取得資料失敗'*/,
          text: msg ?? i18nTranslate('warning-contactIT') /*'請聯絡資訊人員'*/,
          showCancelButton: false
        })
      }
    }
  })
}

const isCollapse = ref(false)
const setCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const editRushMachineMap = new Map()
// const resetEditRushMachineMap = () => {
//   editRushMachineMap.clear()
//   const originMachines = [...originRushMachineMap.keys()]
//   originMachines.forEach(machineId => {
//     editRushMachineMap.set(machineId, reactive(deepClone([], originRushMachineMap.get(machineId))))
//   })
// }


// 編輯前的插單設定備份
const originRushMachineMap = new Map()
const setOriginRushMachineMap = async() => {
  const { data: rushOrders } = await getRushOrders()
  const getOriginRushMachine = (machineId:string) => {
    const rushMachine = originRushMachineMap.get(machineId)
    if(rushMachine) return rushMachine

    const newArray = []
    originRushMachineMap.set(machineId, newArray)
    return newArray
  }

  rushOrders.forEach(rushOrder => {
    const { machineId } = rushOrder
    const machineRushOrders = getOriginRushMachine(machineId)
    machineRushOrders.push(rushOrder)
  })
}

onMounted(async () =>  {
  await setOriginRushMachineMap()
  // resetEditRushMachineMap()
  props.controller.ganttData.setRushMap(editRushMachineMap)
})



const sortOrders = (orders) => {
  if(useExpectTime) orders.sort(sortExpectStartTime)
  // else
}
const sortExpectStartTime = (a, b) => {
    // SortRole
    // 有設定ExpectStartTime者排序在前
    // 兩者皆有則ExpectStartTime較早者在前
    // 兩者皆無y則維持排序不變
    const timeA = a.expectStartTime ?? -1
    const timeB = b.expectStartTime ?? -2

    // a排前面回傳負值 a排後面回傳正值
    if(timeA * timeB >= 0) return timeA - timeB //皆有或皆無ExpectStartTime
    return  (timeA > 0) ? -1 : 1
}
// const sortDefault = (a, b) => {



// }
const addOrderItem = (rushOrderItems, orderItem) => {
  const { orderIds, moiIndex } = orderItem
  const getSpliceIndex = (index: number) => {
    if(index === rushOrderItems.length) return index
    const { orderIds: curOrderIds, moiIndex: curMoiIndex } = rushOrderItems[index]
    // console.log(curOrderIds, curMoiIndex)
    if(orderIds === curOrderIds && Number(moiIndex) < Number(curMoiIndex)) return index
    else return getSpliceIndex(index + 1)
  }

  const spliceIndex = getSpliceIndex(0)
  rushOrderItems.splice(spliceIndex, 0, orderItem)
  // return getSpliceIndex(0)
}
const addRushOrders = (rushOrders, machineId, expectStartTime, limitStartTime ) => {
  // 新增機台於編輯狀態介面，已存在則略過
  addDisplayMachine(machineId)
  // 取得機台目前編輯的插單列表
  const machineRushOrders = editRushMachineMap.get(machineId)

  const getExpectStartTimeString = orderExpectStartTime => {
    return dayjs(limitStartTime).add(orderExpectStartTime, 'second').format('YYYY-MM-DD HH:mm')
  }
  let orderExpectStartTime = expectStartTime
  const orderItems = rushOrders.map(rushOrder => {
    // console.log(rushOrder)
    const duration = rushOrder.unixEndTime - rushOrder.unixStartTime
    const orderKey = rushOrder.orderKey
    const expectStartTime = useExpectTime ? orderExpectStartTime : rushOrder.startTimeValue

    const orderItem = {
      type: 'new',
      orderKey,
      machineId,
      processId: rushOrder.processId,
      orderIds: rushOrder.orderIds,
      moiIndex: rushOrder.moiIndex,
      data: rushOrder,
      duration,
      expectStartTime,
      expectStartTimeString: getExpectStartTimeString(expectStartTime)
    }

    orderExpectStartTime += duration
    return orderItem
  })

  orderItems.forEach(orderItem => removeSameOrder(orderItem))



  orderItems.forEach(orderItem => {
    addOrderItem(machineRushOrders, orderItem)
    // const spliceIndex = addOrderItem(machineRushOrders, orderItem)
    // machineRushOrders.splice(spliceIndex, 0, orderItem)
  })


  sortOrders(machineRushOrders)
  // console.log(machineRushOrders)

  refreshDisplayMachine()
}
const removeSameOrder = newRushOrder => {
  const { orderKey } = newRushOrder
  const machineIds = displayMachines.value
  machineIds.forEach(machineId => {
    const machinieRushOrders = editRushMachineMap.get(machineId)
    const spliceIndex = machinieRushOrders.findIndex(existRushOrder => {
      return existRushOrder.orderKey === orderKey
    })
    if(spliceIndex >= 0) machinieRushOrders.splice(spliceIndex, 1)
  })
}

const getOriginOrder = order => {
  const { orderKey, type } = order
  switch(type) {
    case 'old':
    case 'remove': return order
    case 'new': {
      const machineOrders = [...originRushMachineMap.values()].flat() //get(order.data.machineId) ?? []
      return machineOrders.find(order => order.orderKey === orderKey)
    }
    default: return null
  }
}


const setRushMachines = async () => {
  await nextTick()
  rushItems.value.forEach(item => {
    const machineId = item.machineId
    const newOrders = item.rushOrders.filter(order => order.type === 'new')

    if(newOrders.length > 0) {
      props.rushMap.set(machineId, newOrders)
    }
    else {
      props.rushMap.delete(machineId)
      emit('delete', machineId)
    }
  })
}

// const getRushMachinebyOrder = async (orders) => {
//   const processOrders = orders.map(order => {
//     const { orderIds, processId } = order
//     return {
//       orderId: orderIds,
//       processId
//     }
//   })
//   const resData = await getRushableMachine(processOrders)

//   resData.forEach(data => {
//     const {
//       orderId,
//       processId,
//       machines
//     } = data


//     const orderKey = orders.find(order => order.orderIds === orderId && order.orderIds === processId).orderKey
//     return processOrder
//   })


// }




defineExpose({
  addRushOrders,
  setRushMachines
})


// const getOrderClass = element => {
//   switch (element.type) {
//     case 'new': return 'isNew'
//     case 'old': return 'isOld'
//     case ''
//   }
//   return element.type === 'new' ? 'isNew' : ''
// }
const getOrderText = element => {
  return element.orderIds + '_' + element.moiIndex
}
const getMachineString = element => {
  if( element.type === 'new') return `${i18nTranslate('machine-no') /*機台編號*/} : ${element.data.fromMachineId ?? element.data.machineId } → ${element.machineId }`
  return `${i18nTranslate('machine-no') /*機台編號*/} : ${element.machineId }`
}

const checkRushOrderMove = (dragEvent: any, machineId: string) => {
  // 插單順序變更時需檢查插單順序跟途程順序會不會有衝突
  const dragList = editRushMachineMap.get(machineId)
  const fromIndex = dragEvent.draggedContext.index
  const toIndex = dragEvent.draggedContext.futureIndex

  const getOrderIndexs = (element) => {
    switch(element.type) {
      case 'remove':
      case 'old': return {

      }
    }
  }

  const { orderIds, moiIndex } = dragEvent.draggedContext.element
  // console.log(dragEvent.draggedContext.element)
  const checkMoveable = () => {
    // 拖曳前後位置相同則不衝突
    if(toIndex === fromIndex) return true
    else if (toIndex > fromIndex) {
      // 檢查
      for (let index = fromIndex + 1; index <= toIndex; index ++ ) {
        const { orderIds: checkOrderIds, moiIndex: checkMoiIndex } = dragList[index]
        // 工單編號不相等則不衝突
        if(checkOrderIds !== orderIds) break
        // 工單編號相等，則檢查moiIndex
        if(checkMoiIndex === null) break
        else if(Number(checkMoiIndex) > Number(moiIndex)) return false
      }
    }
    else if (toIndex < fromIndex) {
      for (let index = toIndex; index < fromIndex; index ++ ) {
        const { orderIds: checkOrderIds, moiIndex: checkMoiIndex } = dragList[index]
        // 工單編號不相等則不衝突
        if(checkOrderIds !== orderIds) break
        // 工單編號相等，則檢查moiIndex
        if(checkMoiIndex === null) break
        else if(Number(checkMoiIndex) < Number(moiIndex)) return false
      }
    }
    return true
  }

  const moveable = checkMoveable()
  return moveable
}

// resetRushOrder  機台內工單被拖曳時根據期望時間調整排序並更新渲染
const resetRushOrder = async (changeEvent: any, machineId: string) => {
  const dragList = editRushMachineMap.get(machineId)
  if(hasOwnProperty(changeEvent, 'moved')) {
    // console.log('move')
    // dragList陣列以期望時間排序
    const moveOrder = changeEvent.moved.element
    const newIndex = changeEvent.moved.newIndex // 拖曳工單的新位置
    const oldIndex = changeEvent.moved.oldIndex // 拖曳工單的舊位置

    const direction = (newIndex > oldIndex) ? 'after' : 'before'

    const getNewExpectStartTime = () => {
      if(!useExpectTime) return null
      // moveOrder無expectStartTime則略過
      if(!hasOwnProperty(moveOrder, 'expectStartTime')) return null
      if(moveOrder.expectStartTime === null) return null

      const targetOrder = dragList[newIndex] //DragList目標位置原本的order
      switch(direction) {
          // 排序向前，提早預期開工時間
          case 'before': {
            const newExpectStartTime = targetOrder.expectStartTime
            return newExpectStartTime
            // const tempExpectStartTime = newExpectStartTime + moveOrder.duration
            // moveOrder.expectStartTime = newExpectStartTime
            // setBehindOrderExectStartTime(tempExpectStartTime, newIndex)

            // break
          }
          // 排序向後，增加預期開工時間
          case 'after': {
            if(targetOrder.expectStartTime) {
              const newExpectStartTime = targetOrder.expectStartTime + targetOrder.duration
              return newExpectStartTime
              // const tempExpectStartTime = newExpectStartTime + moveOrder.duration
              // return

            }
            const lastIndex = dragList.findLastIndex(order => order.expectStartTime)
            if(lastIndex >= 0 ) return dragList[lastIndex].expectStartTime
            else return moveOrder?.expectStartTime
          }
      }
    }
    const setBehindOrderExectStartTime = (tempExectStartTime, index) => {
      if(index >= dragList.length) return
      const curOrder = dragList[index]
      const { expectStartTime = null, duration } = curOrder

      if(expectStartTime !== null) {
        if(expectStartTime < tempExectStartTime) {
          setOrderExpectStarTime(curOrder, tempExectStartTime)
          const nextExectStartTime = tempExectStartTime + duration
          setBehindOrderExectStartTime(nextExectStartTime, index + 1)
        }
      }
    }
    const setOrderExpectStarTime = (order, newExpectStartTime) => {
      const {
        expectStartTime,
        expectStartTimeString
      } = order
      const newExpectStartTimeString = dayjs(expectStartTimeString).add(newExpectStartTime - expectStartTime, 'second').format('YYYY-MM-DD HH:mm')
      order.expectStartTimeString = newExpectStartTimeString
      order.expectStartTime = newExpectStartTime
    }
    const newExpectStartTime = getNewExpectStartTime()
    dragList.splice(oldIndex, 1)
    dragList.splice(newIndex, 0, changeEvent.moved.element )

    // console.log(newExpectStartTime)
    if(newExpectStartTime !== null) {
      setOrderExpectStarTime(moveOrder, newExpectStartTime)
      const tempExectStartTime = newExpectStartTime + moveOrder.duration
      setBehindOrderExectStartTime(tempExectStartTime, newIndex + 1 )
    }
  }

  // console.log(dragList,changeEvent)

  sortOrders(dragList)

  props.controller.ganttData.setEditOrder()
  props.controller.ganttCanvas.setLevelInfo('reset')
  refreshDisplayMachine()
}

const computedRushable = () => {
  return isEmpty(displayMachines.value)
}


</script>

<template>
  <div class="management-wrapper">
    <div class="management-container">
      <!-- header -->
      <div class="management-header">
        <div class="management-header-left">
          <div class="button-collapse">
            <CustomButton
              v-if="isCollapse"
              icon-name="caret-down"
              text
              plain
              @click="setCollapse()"
            >
              <h4 class="management-header-title"> {{ i18nTranslate('rushmanage-viewStatus') /*'檢視編輯狀態'*/ }}</h4>
            </CustomButton>
            <CustomButton
                v-else
                icon-name="minus"
                icon-size="small"
                text
                plain
                @click="setCollapse()"
            >
            <h4 class="management-header-title"> {{ i18nTranslate('rushmanage-hideStatus') /*'隱藏編輯狀態'*/ }}</h4>
            </CustomButton>
          </div>
        </div>
        <div class="management-header-right">
          <!-- 排停檢查 -->
           <SchedulingObserver
            ref="schedulingRef"
            v-show="isScheduling"
            v-model="isScheduling"
          />
          <!-- 送出插單 -->
          <CustomButton
            v-if="!isScheduling"
            :label="i18nTranslate('rushmanage-done') /*完成編輯*/"
            type="primary"
            :disabled="computedRushable()"
            @click="sendRushOrders"
          />
        </div>
      </div>
      <!-- content -->
      <div class="management-content" v-show="!isCollapse">
        <!-- 無插單機台時顯示 -->
        <div v-if="isEmpty(displayMachines)" class="management-content-empty">
          <CustomEmpty
            :image-size="50"
            :description="i18nTranslate('rushmanage-empty') /*無編輯機台或工單*/"
          />
        </div>
        <!-- 被插單機台列表 -->
        <CustomDraggable
          v-else
          v-model="displayMachines"
          item-key="machineId"
          :style="containerStyle"
          group="machine"
        >
          <template #header>
            <div class="title-container">
              <div class="title-machine">
                <h4> {{ i18nTranslate('machine-no') /*'機台'*/ }} </h4>
              </div>
              <div class="title-mark">
                <div class="title-mark-item">
                  <div class="color new"></div>
                  <h4> {{ i18nTranslate('rushmanage-state-editing') /*'編輯中工單'*/ }} </h4>
                </div>
                <div class="title-mark-item">
                  <div class="color old"></div>
                  <h4> {{ i18nTranslate('rushmanage-state-edited') /*'已編輯工單'*/ }} </h4>
                </div>
                <div class="title-mark-item">
                  <div class="color remove"></div>
                  <h4> {{ i18nTranslate('rushmanage-state-cancel') /*'取消編輯'*/ }} </h4>
                </div>
              </div>
            </div>

          </template>
          <template #item="{ element }">
            <div class="machine-container">
              <div class="machine-id">
                <span class="machine-id-text"> {{ element }} </span>
              </div>

              <div class="machine-orderlist">
                <!-- 用 v-if 保證顯示資料即時更新 -->
                <!-- 特定機台(element)的插單工單列表 -->
                <template v-if="!isEmpty(computedRushMachineMap[element])">
                  <CustomDraggable
                    v-model="computedRushMachineMap[element]"
                    :style="orderListStyle"
                    :row-style="orderStyle"
                    :move="(event) => checkRushOrderMove(event, element)"
                    @change="(event) => resetRushOrder(event, element)"
                    :group="`${element}-order`"
                    direction="row"
                  >
                    <template #item="{ element }">
                      <CustomPopover
                        trigger="hover"
                        width="fit-content"
                        placement="bottom-start"
                        :offset="5"
                      >
                        <div class="order-detail">
                          <span> {{ `${i18nTranslate('workOrder-no') /*工單編號 */} : ${element.orderIds}` }} </span>
                          <span> {{ `${i18nTranslate('process-no') /*製程編號 */} : ${element.processId}` }} </span>
                          <span> {{ getMachineString(element) /*`機台編號 : ${element.machineId }`*/ }} </span>
                          <template v-if="useExpectTime" >
                            <span v-if="element.expectStartTimeString"> {{ `${i18nTranslate('process-no') /*預計開工時間 */} : ${element.expectStartTimeString}` }} </span>
                          </template>
                        </div>

                        <template #reference>
                          <div class="order-block" :class="element.type">
                            <div v-if="useExpectTime" class="upper">{{ element.expectStartTimeString }} </div>
                            <div class="lower">
                            <!-- <div class="order-block-upper" :class="getOrderClass(element)">{{ element.expectStartTimeString }} </div>
                            <div class="order-block-lower" :class="getOrderClass(element)"> -->
                              <div class="order-id">
                                <div> {{ `${getOrderText(element)}` }} </div>
                              </div>
                              <div class="delete-container">
                                <CustomIcon
                                  class="delete-btn" :class="element.type"
                                  type="far"
                                  name="circle-xmark"
                                  size="small"
                                  @click="deleteItem(element, 'order')"
                                />
                              </div>
                            </div>
                          </div>
                        </template>
                      </CustomPopover>


                    </template>
                  </CustomDraggable>
                </template>

              </div>
              <div class="machine-delete">
                <div class="delete-container">
                  <CustomIcon
                    class="delete-btn"
                    type="far"
                    name="circle-xmark"
                    size="small"
                    @click="deleteItem(element, 'machine')"
                  />
                </div>
              </div>
            </div>


          </template>
        </CustomDraggable>
      </div>


    </div>
  </div>

</template>



<style lang="scss" scoped>
.management {
  &-wrapper {
    padding: 7px;
    width: 100%;
  }
  &-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 4px;
    gap: 4px;
    //
    background-color: #b9c6db;
    border: 1px solid #ebeef5;
    border-radius: 7px;
  }
  &-header {
    width: 100%;

    // height: 50px;
    display: flex;
    justify-content: space-between;
    // flex-direction: row-reverse;
    &-title {
      text-align: center;
      color: rgb(29, 29, 29);
      padding-left: 8px;
    }
    &-left {
      display: flex;
      width:100%;
      align-items: center;
    }
    &-right{
      display: flex;
      align-items: center;
    }


    &-machine {
      &-title {
        width: 150px;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        background-color: #d1d9e7;
        border-radius: 5px 5px;
        border: 1px solid rgb(172, 172, 172);
      }
      &-list {
        // width: fit-content;
        display: flex;
        flex-direction: row;
        overflow-x: scroll;
        scrollbar-width: none;
        // padding: ;
        // background-color: white;
      }
      &-item {
        display: flex;
        padding-left: 8px;
        padding-right: 8px;
        height: 100%;
        text-align: center;
        align-items: center;
        justify-content: center;

        border-right: 1px solid rgb(172, 172, 172);
        // border: 1px solid #c8c9cc;
        // background-color: #f4f4f5; // #ebeef5;
        // border-radius: 5px;
      }
      &-container {
        width: 100%;
        display: flex;
        // background-color: white;
      }
    }
  }
  &-content {
    width: 100%;
    display: flex;
    flex-direction: column;

    &-empty {
      border-radius: 5px;
      width: 100%;
    // height: 50px;
      background-color: white;
      text-align: center;
      justify-content: center;
      align-content: center;
    }
  }
}

.machine {
  &-container {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    background-color: white;
  }
  &-id {
    min-width: 180px;
    text-align: center;
    justify-content: center;
    align-content: center;
    border-right: 1px solid #ebeef5;
    // background-color: white;

  }
  &-orderlist {
    width: 100%;
    display: flex;
    // padding-left: 4px;
    // padding-right: 4px;
    background-color: white;
    overflow: hidden;
    overflow-x: scroll;
    scrollbar-width: none;
  }
  &-delete {
    border-left: 1px solid #ebeef5;
    padding-left: 4px;
    padding-right: 4px;
  }

}
.order {
  &-block {
    // transition-duration: 0.5s;
    border-right: 1px solid white;
    background-color: #f4f4f5;
    .upper {
      // transition-duration: 0.5s;
      padding: 1px 4px;
      height: 30%;
      font-size: 12px;
      font-weight: lighter;

      background-color: white;
    }
    .lower {
      // transition-duration: 0.5s;
      height: 100%;
      width: fit-content;
      min-width: 150px;

      display: flex;
      justify-content: space-between;
      padding: 2px 6px;
      gap: 2px;
    }

    &.new {
      // border: 1px solid orange;
      .lower {
        border-top: 4px solid orange;
        background-color: #ffd187;
      }
    }
    &.old {
      .lower {
        border-top: 4px solid #D70909;
      }
    }
    &.remove {
      .lower {
        transition-duration: 0.5s;
        border-top: 4px solid darkgray
      }
    }



  }
  &-id {
    width: fit-content;
    // padding-left: 4px;
    padding-right: 4px;
    // padding-bottom: 2px;
    white-space: nowrap;
    text-align: center;
    justify-content: center;
    
    align-content: center
    // align-content: end;
  }
  &-detail {
    display: flex;
    flex-direction: column;
    gap:4px;
  }
}

.title {
  &-container {
    width: 100%;
    height: 40px;
    display: flex;
    background-color: #d1d9e7;
    border-radius: 5px 5px 0 0;
  }
  &-machine {
    min-width: 180px;
    border-right: 1px solid #ebeef5;
    text-align: center;
    justify-content: center;
    align-content: center;
  }
  &-mark {
    width: 100%;
    display: flex;

    &-item {
      height: 100%;
      width: fit-content;
      margin-right: 4px;
      display: flex;
      text-align: center;
      justify-content: center;
      align-items: center;


      .color {
        width: 12px;
        height: 12px;
        margin: 8px;
        &.old {
          border: 1px solid #c8c9cc;
          border-top: 3px solid #D70909;
          background-color: #f4f4f5; // #ebeef5;
        }
        &.new {
          border: 1px solid orange;
          border-top: 3px solid orange;
          background-color: #ffd187;
        }
        &.remove {
          border: 1px solid #c8c9cc;
          border-top: 3px solid darkgray;
          background-color: #f4f4f5; // #ebeef5;
        }
      }
    }
  }
}



.delete {
  &-container {
    color: #888888;
    height: 100%;
    justify-content: center;
    align-content: center;
  }


  &-btn {
    transition: transform 0.5s;
    transform: rotateZ(0deg);
    cursor: pointer;
    :hover {
      color: #409EFF;
    }

    &.remove {
      transform: rotateZ(45deg);
    }
  }



}

</style>