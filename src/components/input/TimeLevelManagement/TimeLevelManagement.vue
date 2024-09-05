<script setup lang="ts">
import { computed } from 'vue'
import {
  CustomPopover,
  CustomIcon,
  CustomInput,
  CustomButton
} from '@/components'

import { props as managementProps } from './TimeLevelManagementInfo'

const emit = defineEmits([
  'activeChange',
  'baseChange',
  'update:baseLevelIndex'
])

const props = defineProps(managementProps)

const baseLevelIndex = computed(() => props.baseLevelIndex)
const timeLevelActive = computed(() => {
  if(props.activeLevelIndexs) {
    // 由activeLevelIndex判斷options是否為active
    return props.options.map(option =>
      props.activeLevelIndexs.includes(option.index)
    )
  }
  else {
    // 把active綁訂在options上
    return props.options.map(option => option.active)
  }
})

const setTimeLevelActive = timeLevel => {
  //切換checkBox
  timeLevel.active =  !timeLevel.active
  emit('activeChange')
}
const setBaseLevel = timeLevel => {
  emit('update:baseLevelIndex', timeLevel.index)
  emit('baseChange', timeLevel.index)
}

const isUpperLevel = timeLevel => {
  return timeLevel.index >= baseLevelIndex.value
}
const isBaseLevel = timeLevel => {
  return timeLevel.index === baseLevelIndex.value
}
const getOptionStyle = timeLevel => {
  if(isBaseLevel(timeLevel)) return 'base-level' //基準時間維度
  else if(isUpperLevel(timeLevel)) return 'upper-level' //大於基準維度的時間維度
  else return 'lower-level' //小於基準維度的時間維度
}

</script>

<template>
  <CustomPopover
    :offset="5"
    :placement="props.placement"
    popperStyle="padding: 2px"
  >
    <template #default>
      <div class="option-container">
        <template v-for="(timeLevel, index) in props.options" :key="index">
          <div class="option-item" :class="getOptionStyle(timeLevel)">
            <CustomInput
              v-model="timeLevelActive[index]"
              hidden-label
              :label="timeLevel.name"
              type="checkbox"
              @change="setTimeLevelActive(timeLevel)"
            />
            <CustomButton
              v-if="isBaseLevel(timeLevel)"
              style="color: orange;"
              icon-type="fas"
              icon-name="star"
              icon-size="small"
              text
              size="small"
            />
            <CustomButton
              v-else
              @click="setBaseLevel(timeLevel)"
              icon-type="far"
              icon-name="star"
              icon-size="small"
              text
              size="small"
            />
          </div>
        </template>
      </div>
    </template>

    <template #reference>
      <CustomIcon
        class="icon-trigger"
        size="small"
        :icon="['far', 'clock']"
      />
    </template>
  </CustomPopover>
</template>

<style lang="scss" scoped>
.option {
  &-container {
    display: flex;
    flex-direction: column;
  }
  &-item {
    display: flex;
    padding-left: 8px;
    padding-right: 4px;
    align-items: center;
    &.lower-level {
      background-color: darkgray;
      opacity: 0.8;
    }
    &.base-level {
      background-color: rgb(255, 231, 186);
      border-bottom: 3px solid orange;
    }
  }
  &-name {
    width: 100%;
    text-align: center;
    align-items: center;
  }
}
.icon {
  &-trigger {
    cursor: pointer;
  }
}

</style>