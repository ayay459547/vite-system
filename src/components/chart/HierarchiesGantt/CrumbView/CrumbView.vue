<script setup lang="ts">
import { onMounted, ref, computed, inject } from 'vue'
import type { UseHook } from '@/declare/hook'
import {
  CustomIcon,
  CustomPopover,
  TimeLevelManagement
} from '@/components'
import { filterColumnSetting } from '@/lib/lib_gantt'

import ZoomView from '../ZoomView/ZoomView.vue'

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: 'auto_common'
})

const props = defineProps({
  zoomRate: {
    type: Number
  },
  levelInfo: {
    type: Object
  },
  rootYItem: {
    type: Object
  },
  rootYItemList: {
    type: Array<any>
  },
  controller: {
    type: Object
  },
  useFunction: {
    type: Object
  }
})
// const emit = defineEmits(['change'])
const levelChange = index => {
  props.controller.ganttCanvas.setLevelInfo('index', index)
}
const toRoot = () => {
  props.controller.ganttCanvas.setLevelInfo('root')
}

const getLabel = item => {
  const { param } = item.prevLevelFilters.at(-1)
  // console.log(item)
  return i18nTranslate(filterColumnSetting[param].i18nLabel)
}


const popoverVisible = ref(null)
// const tempRootYItem = computed<string>({
//   get: () => props.rootYItem.key,
//   set: (newKey: string) => {
//     const newRoot = props.rootYItemList.find(rootYItem => {
//       return rootYItem.key === newKey
//     })
//     props.controller.ganttData.setRootYItem(newRoot)
//   }
// })
const rootYItemOptions = computed(()=> {
  return props.rootYItemList.map(rootYItem => {
    return {
      label: rootYItem.name,
      value: rootYItem.key
    }
  })
})
const setRootYItem  = (newKey) => {
  const newRoot = props.rootYItemList.find(rootYItem => {
      return rootYItem.key === newKey
    })
    props.controller.ganttData.setRootYItem(newRoot)
}


const baseLevelIndex = computed({
  get: () => props.controller.ganttData.baseLevelIndex,
  set: value =>  props.controller.ganttData.setBaseLevelIndex(value)
})
const timeLevelOptions = ref([
  { index: 6, i18nLabel: 'datetime-year', name: '年', active: false},
  { index: 5, i18nLabel: 'datetime-year-half', name: '半年', active: false},
  { index: 4, i18nLabel: 'datetime-quarter', name: '季', active: false},
  { index: 3, i18nLabel: 'datetime-month', name: '月', active: false},
  { index: 2, i18nLabel: 'datetime-week', name: '周', active: false},
  { index: 1, i18nLabel: 'datetime-day', name: '日', active: false},
  { index: 0, i18nLabel: 'datetime-hour', name: '時', active: false}
])

// const activeLevelIndexs = ref([])

onMounted(() => {
  const activeLevelIndexs = props.controller.ganttData.activeLevelIndexs
  timeLevelOptions.value.forEach(option => option.active = activeLevelIndexs.includes(option.index))
  // baseLevelIndex.value = props.controller.ganttData.baseLevelIndex
})


const setActiveLevelIndexs = () => {
  const activeLevelIndexs = timeLevelOptions.value
  .filter(option => option.active)
  .map(option => option.index)
  .reverse()

  props.controller.ganttData.setActiveLevelIndexs(activeLevelIndexs)
}

</script>

<template>
  <div class="wrapper">
    <!-- 時間軸單位 -->
    <div class="time-container">
      <TimeLevelManagement
        :options="timeLevelOptions"
        v-model:baseLevelIndex="baseLevelIndex"
        @activeChange="setActiveLevelIndexs"
      />
    </div>
    <!-- 縮放條 -->
    <div class="zoom-container">
      <ZoomView
        :zoomRate="props.zoomRate"
        :controller="props.controller"
      />
    </div>
    <!-- 麵包屑 -->
    <div class="crumb-container" v-if="props.useFunction.Crumb">
      <div class="crumb-item">
        <div class="crumb-root">
          <div class="crumb-root-icon">
            <CustomIcon name="folder" size="small" :style="{ color: 'rgb(60,60,60)'}" @click="toRoot"/>
          </div>
          <CustomPopover
            :visible="popoverVisible"
            :offset="4"
            placement="bottom-start"
            trigger="click"
            popper-style="
              padding: 2px;
              min-width: 100px;
              width: fit-content;
            "
          >
          <template #default>
            <div class="btn-container">
              <template v-for="option in rootYItemOptions" :key="option">
                <CustomButton
                  :label="option.label"
                  style="width: 100%;"
                  text
                  @click="setRootYItem(option.value)"
                />
              </template>
            </div>

          </template>
          <template #reference>
            <div class="crumb-root-text">
              <span> {{ props.rootYItem.name }}</span>
            </div>
          </template>
          </CustomPopover>

        </div>
      </div>
      <template v-for="(item,index) in props.levelInfo.crumbs" :key="index">
        <div class="crumb-item">
          <div class="crumb-item-text" @click="levelChange(index)">
            <!-- {{  }} -->
            <span> {{ `${getLabel(item)} : ${item.name}` }}</span>
            <span> {{ '>' }} </span>
          </div>
        </div>
      </template>
    </div>


  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: row-reverse;
  background-color: #b9c6db;
  width: 100%;
  border: 1px solid rgb(200,200,200);
  border-bottom: 1px solid rgb(240, 240, 240);
  box-shadow: rgba(0, 0, 0, 0.15) 0px 1px 2px 0px;
  z-index: 1;
}
.crumb {
  &-container {
    display: flex;
    // background-color: #b9c6db;
    width: 100%;
  }
  &-root {
    height: 100%;
    display: flex;
    width: fit-content;
    align-content: center;
    text-align: center;
    min-width: 100px;
    gap: 2px;
    margin-right: 4px;
    font-size: 12px;
    background-color: rgb(249 249 249);
    border-radius: 2px;
    border: rgb(155 155 155) solid 1px;
    &-icon {
      padding: 2px;
      border-right: rgb(155 155 155) solid 1px;
    }
    &-text {
      width: 100%;
      display: flex;
      padding: 2px;
      justify-content: center;
      align-content: center;
      text-align: center;
    }
  }

  &-item {
    display: flex;
    align-content: center;
    padding: 2px;
    cursor: pointer;

    &-text {
      display: flex;
      // align-self: center;
      align-items: center;
      text-align: center;
      font-size: 12px;
      margin-right: 4px;
      gap: 8px;
    }
  }

}
.zoom {
  &-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    // border: 1px solid rgb(200,200,200);
  }
}
.time {
  &-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    // border: 1px solid rgb(200,200,200);
  }
}

.btn-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>