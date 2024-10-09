<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted, onUnmounted, ref, reactive, inject, nextTick, computed } from 'vue'
import throttle from '@/lib/lib_throttle'

import type { UseHook } from '@/declare/hook'
import { CustomPopover, CustomInput } from '@/components'
import { group } from 'console'
// import { CustomPopover, SimpleFilter, CustomInput, CustomButton, CustomTabs, CustomDivider } from '@/components'
// import { isEmpty, message } from '@/lib/lib_utils'

const useHook: UseHook = inject('useHook')
const { swal, i18nTranslate } = useHook({
  i18nModule: 'auto_common'
})

const emit = defineEmits(['update:display'])
const props = defineProps({
  display: {
    type: Boolean
  },
  name: {
    type: String
  },
  levelFilters: {
    type: Array<any>
  },
  levelIndex: {
    type: Number
  },
  filterColumns: {
    type: Array<any>
  },
  groupItem: {
    type: Object
  },
  area: { //SearchButon Area
    type: Object
  },
  controller: {
    type: Object
  }

})

const recordPosition = reactive({
  left: NaN,
  top: NaN
})

const messageVisible = computed({
  get: () => props.display,
  set: (value) => {
    emit('update:display', value)
  }
})
const messagePoisition = (() => {
  return [
    'position: absolute',
    `left: ${recordPosition.left}px`,
    `top: ${recordPosition.top}px`
  ]
})

// const popoverStyle =  computed(() => {
//   const translateX =  props.area.left - recordPosition.left
//   const translateY =  props.area.top - recordPosition.top
//   console.log(translateX, translateY)
//   return  `
//     border: 1px solid #c8c9cc;
//     width: fit-content;
//     transform: translateX(${translateX}px) translateY(${translateY}px);
//   `
// })


const popoverStyle = ref(`
  width: 250px;
  border: 1px solid #c8c9cc;
  padding: 0;
`)


const levelAllOptions = ref([])
const levelActiveOptions = computed(() => {
  const curIndex = props.levelIndex
  const curParams = props.groupItem.levelFilters
  .filter((data, index) => curIndex !== index)
  .map(level => level.param)

  return levelAllOptions.value.filter(option => {
    return !curParams.some(param => param === option.value)
  })
})
const levelValueOptions  = computed(() => {
  const valueOptions = props.filterColumns.find(
    filter => filter.param === levelParams.value
  ).options
  return valueOptions
})
const levelValueType = computed(() => {
  const valueType = props.filterColumns.find(
    filter => filter.param === levelParams.value
  ).type
  return valueType
})


const resetLevelValue = () => {
  // groupLevel.value[index].values.splice(0)
}

// const levelParams = ref('')
const levelParams = computed({
  get: () => props.groupItem.levelFilters[props.levelIndex].param,
  set: newParam => {
    const filterColumn = props.filterColumns.find(
      filter => filter.param === newParam
    )
    const { type, param } = filterColumn
    const values = []
    const levelFilter = { type, label: null, param, values}
    props.controller.search.applySearch(props.groupItem, props.levelIndex, levelFilter )
  }
})
const levelValues = computed({
  get: () => props.groupItem.levelFilters[props.levelIndex].values,
  set: newValues => {
    const levelFilter = props.groupItem.levelFilters[props.levelIndex]
    levelFilter.values = newValues
    props.controller.search.applySearch(props.groupItem, props.levelIndex, levelFilter )

  }
})


const keepVisible = ref(false)
const stopPropagation = (event) => {
  event.stopPropagation()
}

const popverRef = ref(null)
const closeSearch = () => {
  messageVisible.value = false
}


onMounted(async() => {
  recordPosition.left = props.area.left
  recordPosition.top = props.area.top
  messageVisible.value = true
  levelAllOptions.value = props.filterColumns.map(column => {
    const { param, label, i18nLabel } = column
    return { value: param, label, i18nLabel }
  })



  // setTimeout(() => {
  //   window.addEventListener('click', checkClose)
  // }, 300)
})
// onUnmounted(()=> {
//   window.removeEventListener('click', checkClose)
// })
const test = (...param) => {
  console.log('mask')
}


const openSideDetailEdit = () => {
  props.controller.sideView.setNextView('groupSetting', props.groupItem)
}

</script>

<template>
  <CustomPopover
    ref="popverRef"
    :visible="messageVisible"
    @update-visible="test"
    :offset="10"
    placement="right"
    :popperStyle="popoverStyle"
    trigger="click"
  >
    <template #default>
      <div class="search-container"
        @click="stopPropagation"
      >
        <div class="search-header">
          <div class="search-header-text">
              {{ `${props.groupItem.name}` }}
          </div>
          <div class="search-header-icon">
            <CustomButton icon-name="edit" size="small" text @click="openSideDetailEdit"/>
          </div>
          <!-- Text -->
        </div>
        <div class="search-body">
          <CustomInput
            i18n-module="auto_common"
            hidden-label
            v-model="levelParams"
            type="select"
            :options="levelActiveOptions"
            @change="resetLevelValue"
          >
            <template #prefix>
              <span class="search-level"> {{ `#${props.levelIndex + 1}` }} </span>
            </template>
          </CustomInput>
          <template v-if="levelParams !== ''">
            <template v-if="levelValueType === 'string'">
              <CustomInput
                i18n-module="auto_common"
                filterable
                hidden-label
                clearable
                multiple
                v-model="levelValues"
                type="select"
                :options="levelValueOptions"
              />
            </template>
            <template v-else-if="levelValueType === 'number'">
              <CustomInput
                i18n-module="auto_common"
                filterable
                hidden-label
                clearable
                multiple
                v-model="levelValues"
                type="select"
                :options="levelValueOptions"
              />
            </template>
            <template v-else-if="levelValueType=== 'time'">
              <CustomInput
                i18n-module="auto_common"
                hidden-label
                clearable
                multiple
                v-model="levelValues"
                type="datetimerange"
                :options="levelValueOptions"
              />
            </template>
          </template>
          <!-- Input param: String -->
          <!-- Input Values: []-->
        </div>
      </div>
      <!-- 處理關閉用的全屏不佔位透明遮罩 -->
      <div class="mask-close" @click="closeSearch"></div>
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
.search {
  &-container {
    display: flex;
    flex-direction: column;
    padding: 8px;
  }
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8px;
    font-weight: bold
    // background-color: lightgrey;
    // border-bottom: 1px solid lightgrey;
  }
  &-body {
    display: flex;
    flex-direction: column;
  }
  &-level {
    color: #606266;
  }
}

.mask-close {
  z-index: -1;
  position: fixed;
  top:0;
  left:0;
  height: 100%;
  width: 100%;
}


</style>
