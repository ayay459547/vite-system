<script setup lang="ts">
import type { Hook } from '@/declare/hook'
import { ref, reactive, onMounted, nextTick, computed, inject } from 'vue'
import {
  type TableData,
  type Search,
  getVersionOptions,
  getData
} from './api'
import {
  CustomInput,
  CustomButton,
  type DraggableChange,
  CustomDraggable,
  CustomTabs,
  TableMain,
  CustomIcon,
  CustomSearch
} from '@/components'

import { isEmpty, scrollToEl } from '@/lib/lib_utils'
import { columnSetting } from './columns'
import { getSimpleTableSetting, getFormSetting } from '@/lib/lib_columns'

import dayjs from '@/lib/lib_day'

const hook: Hook = inject('hook')
const { i18nTranslate } = hook()

const isLoading = ref(true)

const tab = ref('search')
const tabs = [
  { label: '搜尋', key: 'search' },
  { label: '排序', key: 'sort' }
]

const dateTab = ref('')
const dateTabs = ref([
  // { label: '20231128', key: '20231128' },
  // { label: '20231129', key: '20231129' }
])

const isOpen = ref(true)

const options = reactive({
  version: [],
  dateInterval: []
})

const getDateIntervalOptions = () => {
  const _options = []
  const getDay = (dayIndex: number) => {
    return dayjs(new Date()).add(dayIndex, 'days')
  }

  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const date = getDay(dayIndex).format('YYYY-MM-DD')

    _options.push({
      label: date,
      value: date
    })
  }
  return _options
}

const sortList = ref([
  { id: 'machine', value: '機台' },
  { id: 'custProduct', value: '客戶產品編號' },
  { id: 'process', value: '製程' },
  { id: 'product', value: '產品型號' },
  { id: 'productGroup', value: '產品族' },
  { id: 'reportRestrictedGroup', value: 'Device Group' }
])
const sortMap = ref({
  machine: 0,
  custProduct: 1,
  process: 2,
  product: 3,
  productGroup: 4,
  reportRestrictedGroup: 5,
  length: 6
})
const onSortChange = async (draggable: DraggableChange) => {
  await nextTick()
  const { moved } = draggable

  if (!isEmpty(moved)) {
    sortList.value.forEach((element, elementIndex) => {
      sortMap.value[element.id] = elementIndex
    })

    await nextTick()
    initShowData()
  }
}

// table
const tableData = ref<TableData[]>([])
const showData = ref([])

// 資源警示
const { tableColumns } = getSimpleTableSetting(columnSetting, 'table', '')
const showColumns = ref([])

const initShowData = async () => {
  isLoading.value = true

  await nextTick()
  const _showColumns = new Array(sortMap.value.length)

  tableColumns.forEach(column => {
    const insertIndex = sortMap.value[column?.prop ?? '']
    if (!isEmpty(insertIndex) && typeof insertIndex === 'number') {
      _showColumns.splice(insertIndex, 1, column)
    } else {
      _showColumns.push(column)
    }
  })

  showColumns.value = _showColumns.filter(column => !isEmpty(column))

  setTimeout(() => {
    isLoading.value = false
  }, 300)
}

const initData = async () => {
  isLoading.value = true
  const resData = await getData(getSearch(false))
  tableData.value = resData

  await nextTick()
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

const init = async () => {
  options.version = await getVersionOptions()
  options.dateInterval = getDateIntervalOptions()

  initShowData()
}

// search
const {
  columns: searchColumn,
  forms: search,
  reset: resetForm,
  getActiveForms: getSearch,
  validate: validateForm
} = getFormSetting<Search>(columnSetting, 'search')

// filter
const {
  columns: filterColumn,
  forms: filter,
  activeForms: activeFilter
  // getActiveForms: getFilter
} = getFormSetting<TableData>(columnSetting, 'filter')

const isSubmitDisabled = computed(() => {
  return isEmpty(search.version) || isEmpty(search.dateInterval)
})

const initTabs = async () => {
  await nextTick()
  search.dateInterval.forEach((date, dateIndex) => {
    if (dateIndex === 0) {
      dateTab.value = date
    }

    dateTabs.value.push({
      label: date,
      key: date
    })
  })
}

const filterSearch = async () => {
  await validateForm().then(async () => {
    initTabs()
    initData()

  }).catch(errorList => {
    console.log(errorList)
    const el = errorList[0]?.getDom()
    if (el) {
      scrollToEl(el)
    }
  })
}

onMounted(async () => {
  isLoading.value = true

  await init()
  await nextTick()
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})

</script>

<template>
  <div v-loading="isLoading" class="fund-1608 page-wrapper">
    <div class="page-feature" :class="isOpen ? 'is-open': 'is-close'">
      <!-- 縮放箭頭 -->
      <CustomButton
        icon-name="chevron-left"
        class="feature-btn"
        :class="isOpen ? 'is-open': 'is-close'"
        circle
        @click="isOpen = !isOpen"
      />

      <CustomTabs v-model="tab" :list="tabs" />

      <div class="feature-container">
        <div class="feature-content">
          <Transition name="fixed" mode="out-in">
            <KeepAlive>
              <div v-if="tab === 'search'">
                <CustomInput
                  v-model="search.version"
                  v-bind="searchColumn.version"
                  :options="options.version"
                />
                <CustomInput
                  v-model="search.dateInterval"
                  v-bind="searchColumn.dateInterval"
                  :options="options.dateInterval"
                />
                <CustomInput
                  v-model="search.showCorrectCompare"
                  v-bind="searchColumn.showCorrectCompare"
                />
                <div class="flex-row content-end i-ga-md">
                  <CustomButton
                    :label="i18nTranslate('reset')"
                    icon-name="broom"
                    icon-move="rotate"
                    @click="resetForm"
                  />
                  <CustomButton
                    type="primary"
                    :label="i18nTranslate('search')"
                    icon-name="magnifying-glass"
                    :disabled="isSubmitDisabled"
                    @click="filterSearch"
                  />
                </div>
              </div>
              <div v-else-if="tab === 'sort'">
                <CustomDraggable
                  v-model="sortList"
                  :row-style="{ borderRadius: '6px', backgroundColor: '#a0cfff' }"
                  @change="onSortChange"
                >
                  <template #item="{ element, index }">
                    <div class="flex-row-center content-between fill i-pa-md cursor-pointer">
                      <label class="cursor-pointer">{{ `${index + 1}. ${element.value}` }}</label>

                      <CustomIcon name="bars" />
                    </div>
                  </template>
                </CustomDraggable>
              </div>
            </KeepAlive>
          </Transition>
        </div>
      </div>

    </div>

    <div class="page-table">
      <CustomTabs v-model="dateTab" :list="dateTabs" />

      <TableMain
        :show-data="tableData"
        :show-columns="showColumns"
      >
        <template #header-all="{ label }">
          <label>{{ label }}</label>
        </template>
        <template
          v-for="key in [
            'machine',
            'process',
            'productGroup',
            'custProduct',
            'product',
            'reportRestrictedGroup'
          ]"
          :key="key"
          #[`header-${key}`]="{ prop }"
        >
          <CustomSearch
            v-model="filter[prop]"
            v-model:active="activeFilter[prop]"
            v-bind="filterColumn[prop]"
            search
          />
        </template>
      </TableMain>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$feature-width: 270px;
$bg-color: #ecf5ff;

.page {
  &-wrapper {
    width: 100%;
    height: 100%;
    padding: 16px;
    display: flex;
    gap: 16px;
    position: relative;
  }

  &-feature {
    width: $feature-width;
    height: 100%;
    will-change: margin-left;
    transition-duration: 0.3s;
    position: relative;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    &.is-open {
      margin-left: 0;
    }
    &.is-close {
      margin-left: -$feature-width;
    }

    .feature {
      &-btn {
        position: absolute;
        right: 0;
        top: 50%;
        z-index: 1;
        &.is-open {
          transform: translateY(-100%) translateX(50%) rotateZ(0deg);
        }
        &.is-close {
          transform: translateY(-100%) translateX(50%) rotateZ(180deg);
        }
      }
      &-container {
        width: 100%;
        flex: 1;
        height: 100%;
        padding: 16px;
        overflow-y: auto;
        background-color: $bg-color;
        border-radius: 0 0 6px 6px;
      }
      &-content {
        width: 100%;
        height: fit-content;
        padding: 8px 0;
      }
    }
  }

  &-table {
    flex: 1;
    width: 100%;
    will-change: width;
    position: relative;
    display: flex;
    flex-direction: column;
  }
}
</style>

<style lang="scss">
.fund-1608 .list-group {
  gap: 8px;
}
</style>
