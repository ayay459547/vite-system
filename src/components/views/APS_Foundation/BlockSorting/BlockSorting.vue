<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted, reactive, ref, inject, nextTick, computed } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { useFormListSetting } from '@/lib/lib_columns'
import type { Option, Options } from '@/components'
import { CustomInput, FormList } from '@/components/input'
import { getProxyData, isEmpty } from '@/lib/lib_utils' // 工具

import type { FormData } from './api'

import {
  defaultSortingByOptions,
  defaultorderOptions,
  getOrderingTypeOptions,
  columnSetting as formListColumnSetting
} from './columns'

const props = defineProps({
  blockTypeItemIndex: {
    type: Number as PropType<number>,
    default: 1,
    description: `區塊 typeItemIndex
      1.開工區 (fund-1426, fund-1441)
      2.插單區 (fund-1426, fund-1441)
      3.鎖定區 (fund-1426)
      4.預排區 (fund-1426, fund-1441)
      5.一般 (fund-1429)
      6.PN (fund-1429)
      7.緊急貨批工單區 super hot run (fund-1426)
    `
  },
  blocks: {
    type: Array as PropType<Array<FormData>>,
    default() {
      return []
    },
    description: '初始化資料'
  },
  sortingByOptions: {
    type: Array as PropType<Options>,
    default() {
      return defaultSortingByOptions
    },
    description: '名稱 選項'
  },
  orderOptions: {
    type: Array as PropType<Options>,
    default() {
      return defaultorderOptions
    },
    description: '排序方式 選項'
  },
  isEdit: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
    description: '是否可編輯'
  },
  isHiddenDescOneMaxMultMin: {
    type: Boolean as PropType<boolean>,
    default: false,
    description: '是否隱藏多小一大'
  }
})

const useHook = inject('useHook') as UseHook
const { i18nTranslate, i18nTest, swal } = useHook({
  i18nModule: 'system'
})

const label = computed(() => {
  switch (props.blockTypeItemIndex) {
    case 1:  {
      const i18nKey = 'sequence-checkIn-schedule-set'
      if (i18nTest(i18nKey)) {
        return i18nTranslate(i18nKey)
      }
      return '[開工區排程排序設定]'
    }
    case 2:  {
      const i18nKey = 'sequence-insert-schedule-set'
      if (i18nTest(i18nKey)) {
        return i18nTranslate(i18nKey)
      }
      return '[插單區排程排序設定]'
    }
    case 3:  {
      const i18nKey = 'sequence-lock-schedule-set'
      if (i18nTest(i18nKey)) {
        return i18nTranslate(i18nKey)
      }
      return '[鎖定區排程排序設定]'
    }
    case 4:  {
      const i18nKey = 'sequence-reserve-schedule-set'
      if (i18nTest(i18nKey)) {
        return i18nTranslate(i18nKey)
      }
      return '[預排區排程排序設定]'
    }
    case 5:  {
      const i18nKey = 'merge-general-schedule-set'
      if (i18nTest(i18nKey)) {
        return i18nTranslate(i18nKey)
      }
      return '[一般併批排程設定]'
    }
    case 6:  {
      const i18nKey = 'merge-pn-schedule-set'
      if (i18nTest(i18nKey)) {
        return i18nTranslate(i18nKey)
      }
      return '[PN併批排程設定]'
    }
    case 7:  {
      const i18nKey = 'sequence-superHotRun-schedule-set'
      if (i18nTest(i18nKey)) {
        return i18nTranslate(i18nKey)
      }
      return '[緊急貨批工單區排程排序設定]'
    }
    default:
      return ''
  }
})

const {
  columns: formListColumn,
  forms: formList,
  validate: validateFormList,
  add: addItem,
  remove: removeItem
} = useFormListSetting<FormData>(formListColumnSetting, 'form', [])

// 暫時無用
const options: Record<string, Options> = reactive({
  sortingBy: [],
  order: []
})

// 已選選項列表
const selectedOptions = computed(() => {
  return formList.value.map(formItem => {
    return formItem.sortingBy
  })
})

const remove = (rowIndex: number) => {
  removeItem(rowIndex)
}

// 取的過濾後的選項
const getReserveTypeOptions = (rowIndex: number) => {
  const currentValue = formList.value[rowIndex].sortingBy
  return options.sortingBy.filter((option: Option) => {
    return currentValue === option.value || !selectedOptions.value.includes(option.value)
  })
}

// 依據排序項目 變更 i18n 文字
const getReserveSortingOptions = (rowIndex: number) => {
  const sortingBy = formList.value[rowIndex].sortingBy

  return getOrderingTypeOptions(
    props.blockTypeItemIndex,
    Number.parseInt(`${sortingBy}`),
    props.isHiddenDescOneMaxMultMin
  )
}

const isLoading = ref(false)

// 初始化 選項
const initSortingByOptions = (sortingByOptions: Options) => {
  options.sortingBy = sortingByOptions
}
const initOrderOptions = (orderOptions: Options) => {
  options.order = orderOptions
}

const checkInValues = ['16', '17', '18', '19', '20', '3']
// 初始化 資料
const initData = (blocks: Array<FormData>) => {
  formList.value.splice(0)

  if (!isEmpty(blocks)) {
    blocks.forEach(item => {
      // check in 有區分 年/月/日/時/分/秒
      const { sortingBy } = item

      if (checkInValues.includes(`${sortingBy}`)) {
        addItem({
          ...item,
          sortingBy: 3,
          checkIn: parseInt(`${sortingBy}`)
        })
      } else {
        addItem({ ...item, checkIn: 3 })
      }

    })
  } else {
    addItem()
  }
}

const formListRef = ref()

// 初始化
const init = async () => {
  isLoading.value = true

  // 排序項目
  initSortingByOptions(props.sortingByOptions)
  initOrderOptions(props.orderOptions)
  initData(props.blocks)

  await nextTick()
  if (formListRef.value) {
    const method = props.isEdit ? 'open' : 'close'
    formListRef.value.setCollapse(method)
  }
  setTimeout(() => {
    isLoading.value = false
  }, 300)
}

onMounted(() => {
  init()
})

defineExpose({
  init,
  initData,
  initSortingByOptions,
  initOrderOptions,
  addItem,
  removeItem,
  submit: async () => {
    await nextTick()

    // 檢查最後一筆是否是 批量大小 typeItemIndex = 5
    if ([5, 6].includes(props.blockTypeItemIndex)) {
      const formLen = formList.value.length
      const formLastTypeItemIndex = formList.value[formLen - 1].sortingBy

      if (formLastTypeItemIndex !== 5) {
        swal({
          icon: 'error',
          title: i18nTranslate('error', 'system'),
          text: `${i18nTranslate('BlockSortingType-typeItemIndex-5')}：${i18nTranslate('setting-last')}`,
          showCancelButton: false
        })

        const el = document.querySelector('.block-sorting-container')

        return Promise.reject([{
          el,
          getDom () {
            return el
          }
        }])
      }
    }

    return await Promise.all([validateFormList()])
      .then(async () => {
        // check in 有區分 年/月/日/時/分/秒
        const list = getProxyData<FormData[]>(formList.value)
        const blocks = [
          {
            typeItemIndex: props.blockTypeItemIndex,
            scheduleBlockSortingSettings: list.map(item => {
              const { sortingBy, checkIn } = item
              if (checkInValues.includes(`${sortingBy}`)) {
                return { ...item, sortingBy: checkIn }
              }
              return item
            })
          }
        ]

        return Promise.resolve(blocks)
      })
      .catch(errorList => {
        return Promise.reject(errorList)
      })
  }
})
</script>

<template>
  <div v-loading="isLoading" class="block-sorting-container">
    <FormList
      ref="formListRef"
      v-model="formList"
      :label="label"
      :column-setting="formListColumnSetting"
      item-key="key"
      :min="1"
      is-draggable
      is-create
      is-remove
      :is-edit="props.isEdit"
      is-collapse
      :draggable-group="`BlockSorting-${props.blockTypeItemIndex}`"
      @add="addItem"
      @remove="remove"
    >
      <template #header-all="{ column }">
        <div class="text-danger i-pr-xs">
          {{ column.required ? '*' : '' }}
        </div>
        <div>{{ i18nTranslate(column.i18nLabel) }}</div>
      </template>

      <template #column-sortingBy="{ rowIndex }">
        <div class="fill flex-row">
          <CustomInput
            v-model="formList[rowIndex].sortingBy"
            v-bind="formListColumn.sortingBy"
            :options="getReserveTypeOptions(rowIndex)"
            :disabled="!props.isEdit"
          />
          <CustomInput
            v-show="checkInValues.includes(`${formList[rowIndex].sortingBy}`)"
            v-model="formList[rowIndex].checkIn"
            v-bind="formListColumn.checkIn"
            style="width: 120px;"
          />
        </div>
      </template>

      <template #column-order="{ rowIndex }">
        <CustomInput
          v-model="formList[rowIndex].order"
          v-bind="formListColumn.order"
          :disabled="!props.isEdit"
          :options="getReserveSortingOptions(rowIndex)"
        />
      </template>
    </FormList>
  </div>
</template>

<style lang="scss" scoped>
.block-sorting {
  &-container {
    width: 100%;
    height: fit-content;
  }
}
</style>
