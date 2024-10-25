<script setup lang="ts">
import { ref, shallowRef, onMounted, nextTick, computed, inject } from 'vue'

import type { UseHook } from '@/declare/hook' // 全域功能類型
import {
  VxeTable,
  VxeColgroup,
  VxeColumn,
  CustomIcon,
  CustomPopover,
  CustomDraggable,
  CustomScrollbar,
  TimeLevelManagement
} from '@/components' // 系統組件

import { formatDatetime } from '@/lib/lib_format' // 格式化
import { hasOwnProperty, isEmpty, getUuid, deepClone } from '@/lib/lib_utils' // 工具
import dayjs, { getQuarter, getWeekOfYear } from '@/lib/lib_day'
import { defaultModuleType } from '@/i18n/i18n_setting'

import type { Types, Expose } from './TimeLineTableInfo'
import { version, props as timeLineCustomTableProps } from './TimeLineTableInfo'

import DraggableItem from './Components/DraggableItem.vue'
import GroupDateColumn from './Components/GroupDateColumn.vue'

const baseWidth = 80

const scopedId = getUuid(version)

const props = defineProps(timeLineCustomTableProps)

const useHook: UseHook = inject('useHook')
const { i18nTranslate } = useHook({
  i18nModule: props.i18nModule
})

const baseLevelIndex = ref(1)
const timeLevelOptions = ref([
  { index: 6, name: '年', active: false, value: 'year', i18nLabel: 'datetime-year' },
  // { index: 5, name: '半年', active: false, value: 'half', i18nLabel: 'datetime-year-half' },
  { index: 4, name: '季', active: false, value: 'quarter', i18nLabel: 'datetime-quarter' },
  { index: 3, name: '月', active: false, value: 'month', i18nLabel: 'datetime-month' },
  { index: 2, name: '周', active: false, value: 'week', i18nLabel: 'datetime-week' },
  { index: 1, name: '日', active: true, value: 'day', i18nLabel: 'datetime-day' }
  // { index: 0, name: '時', active: false, value: 'hour', i18nLabel: 'datetime-hour' }
])
const acviteTimeLevelList = computed(() => {
  return timeLevelOptions.value.reduce((res, option) => {
    if (
      (option.index >= baseLevelIndex.value && option.active) ||
      option.index === baseLevelIndex.value
    ) {
      res.push(option.value)
    }
    return res
  }, [])
})

const emit = defineEmits(['changeKey'])

const timeLineDateKey = ref('')
const changeKey = async (newDateKey: string) => {
  timeLineDateKey.value = newDateKey

  emit('changeKey', newDateKey)
  await nextTick()
  refreshColumn()
}

// 群組排序用資料 X軸
const groupColumnsSortMap: {
  [key: string]: number
} = {}

// 清除 Y軸欄位合併
const clearMergeCells = () => {
  setTimeout(() => {
    vxeTableRef.value?.clearMergeCells()
  }, 0)
}
// 設定 Y軸欄位合併
const mergeCells = []
const setMergeCells = () => {
  setTimeout(() => {
    vxeTableRef.value?.setMergeCells(mergeCells)
  }, 80)
}

// 重設 Y軸欄位合併
const resetMergeCells = () => {
  clearMergeCells()

  // 合併欄位資料 必需先排序好資料
  mergeCells.splice(0)
  const mergeMap: Record<string, {
    __row__: number
    __col__: number
    __rowspan__: number
  }> = {}
  showData.value.forEach((rowData, rowIndex) => {
    let mergeKey = ''

    groupColumns.value.forEach((groupColumn, groupColumnIndex) => {
      const columnData = rowData[groupColumn.key]
      mergeKey += `__${groupColumn.key}-${columnData}__`

      if (!hasOwnProperty(mergeMap, mergeKey)) {
        mergeMap[mergeKey] = {
          __row__: rowIndex,
          __col__: groupColumnIndex,
          __rowspan__: 0
        }
      }
      mergeMap[mergeKey].__rowspan__ += 1
    })

  })

  Object.values(mergeMap).forEach(mergeCell => {
    const {__row__, __col__, __rowspan__} = mergeCell

    if (__rowspan__ > 1) {
      mergeCells.push({
        row: __row__,
        col: __col__,
        rowspan: __rowspan__,
        colspan: 1
      })
    }
  })

  setMergeCells()
}

// 群組欄位 X軸
const groupColumns = shallowRef([])
const groupColumnsKey = computed<string[]>(() => {
  return groupColumns.value.reduce((res, groupColumn) => {
    if (!isEmpty(groupColumn.key)) {
      res.push(groupColumn.key)
    }
    return res
  }, [])
})

// 群組日期 Y軸
const groupDateColumns = shallowRef([])
const getGroupDateColumns = (dateGroup: Record<string, any>) => {
  if (isEmpty(dateGroup)) return []

  const groupDateList = Object.entries(dateGroup)

  return groupDateList.sort((a, b) => {
    const [a_column] = a
    const [b_column] = b
    if (quarterRegex.test(a_column) || quarterRegex.test(b_column)) {
      return parseInt(a_column.replace(quarterPrefix, '')) - parseInt(b_column.replace(quarterPrefix, ''))
    }
    if (weekRegex.test(a_column) || weekRegex.test(b_column)) {
      return parseInt(a_column.replace(weekPrefix, '')) - parseInt(b_column.replace(weekPrefix, ''))
    }

    const aDateTime = formatDatetime(`${a_column}`, 'YYYY-MM-DD HH:mm:ss')
    const bDateTime = formatDatetime(`${b_column}`, 'YYYY-MM-DD HH:mm:ss')

    return dayjs(aDateTime).valueOf() - dayjs(bDateTime).valueOf()
  }).map(([dateColumnKey, subDateGroup]) => {
    let title = dateColumnKey
    if (quarterRegex.test(dateColumnKey)) {
      title = `Q${dateColumnKey.replace(quarterPrefix, '')}`
    } else if (weekRegex.test(dateColumnKey)) {
      title = `W${dateColumnKey.replace(weekPrefix, '')}`
    }

    return {
      key: dateColumnKey,
      title: title,
      columns: getGroupDateColumns(subDateGroup)
    }
  })
}

// 日期線欄位 Y軸
const dateColumns = shallowRef([])

// 其他欄位 none
const otherColumns = shallowRef([])

const vxeTableRef = ref()
const renderKey = ref(0)
const refreshColumn = async () => {
  await nextTick()
  initData()
  renderKey.value++
}

const isLoading = ref(true)
const isShow = ref(false)

const showData = shallowRef([])
/**
 * 群組用資料
 * key = 組群的資料 合併成key (matrixKey)
 *
 * 矩陣表 insertIndex(插入矩陣表的位置) x groupDate(最小群組日期)
 * [
 *  { 日期1: uuid, 日期2: uuid, 日期3: uuid }, (insertIndex)
 *  { 日期1: uuid, (無)       , 日期3: uuid },
 *  { (無)       , (無)       , 日期3: uuid }
 * ]
 * 如果日期存在 就加一條
 * 資料顯示群組
 */
const matrixMap = new Map()
const getMatrixMap = (rowData: any) => {
  const keyList = groupColumnsKey.value.reduce((res, columnKey) => {
    if (!isEmpty(rowData[columnKey])) {
      res.push(rowData[columnKey])
    }
    return res
  }, [])

  return keyList.join('-')
}

const quarterPrefix = 'Quarter-'
const quarterRegex = new RegExp(quarterPrefix)

const weekPrefix = 'Week-'
const weekRegex = new RegExp(weekPrefix)

// 初始化資料
const initData = async () => {
  isLoading.value = true

  for (let sortMapKey in groupColumnsSortMap) {
    delete groupColumnsSortMap[sortMapKey]
  }
  showData.value = []
  matrixMap.clear()

  // 日期群組
  const _dateGroup = {}

  const _tableData = deepClone(props.tableData, [])

  let rowIndex = -1
  const tableMap = _tableData.reduce((resMap, item) => {
    if(
      // 沒該日期欄位資料 || 資料是空
      !hasOwnProperty(item, timeLineDateKey.value) ||
      isEmpty(item[timeLineDateKey.value])
    ) {
      return resMap
    }

    let tempRef = _dateGroup
    // 最小群組日期
    let groupDate = ''

    // format 避免資訊重複
    const formartUseMap = {
      year: false,
      // quarter: false,
      month: false,
      // week: false,
      day: false
    }

    // 設定日期群組
    const setDateGroup = (timeLineDateType: string) => {
      let dateColumnKey = ''
      let formartList = []
      let formartStr = ''
      const timeLineDate = item[timeLineDateKey.value]

      switch (timeLineDateType) {
        case 'year':
          formartUseMap.year = true

          dateColumnKey = formatDatetime(timeLineDate, 'YYYY')
          break
        case 'quarter':
          dateColumnKey = `${quarterPrefix}${getQuarter(timeLineDate)}`
          break
        case 'month':
          formartList = [formartUseMap.year ? '' : 'YYYY', 'MM'].filter(str => str.length > 0)
          formartUseMap.year = true
          formartUseMap.month = true
          formartStr = formartList.join('-')

          dateColumnKey = formatDatetime(timeLineDate, formartStr)
          break
        case 'week':
          dateColumnKey = `${weekPrefix}${getWeekOfYear(timeLineDate)}`
          break
        case 'day':
          formartList = [
            formartUseMap.year ? '' : 'YYYY',
            formartUseMap.month ? '' : 'MM',
            'DD'
          ].filter(str => str.length > 0)
          formartUseMap.year = true
          formartUseMap.month = true
          formartUseMap.day = true
          formartStr = formartList.join('-')

          dateColumnKey = formatDatetime(timeLineDate, formartStr)
          break
      }

      if (!hasOwnProperty(tempRef, dateColumnKey)) {
        tempRef[dateColumnKey] = {}
      }
      if (dateColumnKey.length > 0) {
        tempRef = tempRef[dateColumnKey]
        groupDate = dateColumnKey
      }
    }
    // 使用日期資料 群組
    acviteTimeLevelList.value.forEach(timeLineDateType => {
      setDateGroup(timeLineDateType)
    })

    // 塞入矩陣表的資料 (隨機不重複)
    const matrixId = getUuid('matrix-id')
    tempRef = matrixId

    // 矩陣表 合併成key
    const matrixKey = getMatrixMap(item)
    if (!matrixMap.has(matrixKey)) {
      matrixMap.set(matrixKey, [])
    }
    // 矩陣表 insertIndex(插入矩陣表的位置) x groupDate(最小群組日期)
    const matrixData = matrixMap.get(matrixKey)

    let insertIndex = matrixData.findIndex((matrix: any) => {
      return !hasOwnProperty(matrix, groupDate)
    })

    if (insertIndex === -1) {
      insertIndex = matrixData.length
      rowIndex++
      matrixData.push({})
    }

    matrixData[insertIndex][groupDate] = matrixId
    // 更新矩陣表資料
    matrixMap.set(matrixKey, matrixData)

    // 行資料的key = 合併成key + 插入矩陣表的位置
    const rowKey = `${matrixKey}-${insertIndex}`
    if (!resMap.has(rowKey)) {
      resMap.set(rowKey, { rowKey, ...item })
    }
    const rowData = resMap.get(rowKey)

    dateColumns.value.forEach(dateColumn => {
      // 對應 GroupDateColumn field
      const field = `${groupDate}-${dateColumn.key}`
      const fieldData = item[dateColumn.key]
      rowData[field] = fieldData
    })

    // 計算群組欄位的合併+排序
    groupColumns.value.forEach(groupColumn => {
      const sortMapKey = `${groupColumn.key}-${item[groupColumn.key]}`

      if (!hasOwnProperty(groupColumnsSortMap, sortMapKey)) {
        groupColumnsSortMap[sortMapKey] = rowIndex
      }
    })

    // 設定表格資料
    resMap.set(rowKey, rowData)
    return resMap
  }, new Map())

  // 日期群組
  groupDateColumns.value = getGroupDateColumns(_dateGroup)

  // 排序資料
  showData.value = Array.from(tableMap.values()).sort((a, b) => {
    for (let groupColumn of groupColumns.value) {
      const [a_sortMapKey, b_sortMapKey] = [
        `${groupColumn.key}-${a[groupColumn.key]}`,
        `${groupColumn.key}-${b[groupColumn.key]}`
      ]
      if (groupColumnsSortMap[a_sortMapKey] !== groupColumnsSortMap[b_sortMapKey]) {
        return groupColumnsSortMap[a_sortMapKey] - groupColumnsSortMap[b_sortMapKey]
      }
    }

    return 0
  })

  await nextTick()
  setTimeout(() => {
    resetMergeCells()
  }, 800)

  setTimeout(() => {
    isShow.value = true
    isLoading.value = false
  }, 1600)
}

const init: Expose.Init = async () => {
  const _groupColumns = []
  const _dateColumns = []
  const _otherColumns = []

  props.tableColumns.forEach(column => {
    const timeLineType = column?.timeLineType ?? 'none'
    switch (timeLineType) {
      case 'group':
        _groupColumns.push(column)
        break
      case 'date':
        _dateColumns.push(column)
        break
      case 'none':
      default:
        _otherColumns.push(column)
        break
    }
  })

  const sortCallback = (a: Types.TableColumn, b: Types.TableColumn) => {
    const [aIndex, bIndex] = [a?.timeIndex ?? -1, b?.timeIndex ?? -1]
    return aIndex - bIndex
  }
  groupColumns.value = _groupColumns.sort(sortCallback)
  dateColumns.value = _dateColumns.sort(sortCallback)
  otherColumns.value = _otherColumns.sort(sortCallback)

  // 設定時間線的key
  const timeLineDateColumn = props.tableColumns.find(column => {
    return column?.isTimeLineDateActive
  })
  changeKey(timeLineDateColumn?.key ?? '')

  await nextTick()
  initData()
}

onMounted(() => {
  init()
})

defineExpose({
  init,
  changeKey
})

</script>

<template>
  <div
    v-loading="isLoading"
    class="time-line"
    :class="scopedId"
  >
    <VxeTable
      v-show="isShow"
      ref="vxeTableRef"
      :key="renderKey"
      show-overflow
      show-header-overflow
      :border="true"
      stripe
      :data="showData"
      :row-config="{ isCurrent: true, isHover: true }"
      :column-config="{ resizable: true }"
      :scroll-y="{ enabled: true, gt: 0 }"
      :scroll-x="{ enabled: true, gt: 0 }"
    >
      <VxeColgroup
        :title="i18nTranslate('setting', defaultModuleType)"
        fixed="left"
      >
        <template #header>
          <div class="flex-row i-ga-lg">
            <h3>{{ i18nTranslate('setting', defaultModuleType) }}</h3>

            <!-- 檢驗合併用 需要再打開 -->
            <!-- <div class="test-merge">
              <CustomButton
                :label="i18nTranslate('setting', defaultModuleType)"
                icon-name="table-cells-column-lock"
                size="small"
                @click="setMergeCells"
              />

              <CustomButton
                :label="i18nTranslate('clear', defaultModuleType)"
                icon-name="table-cells"
                size="small"
                @click="clearMergeCells"
              />
            </div> -->

            <div class="flex-row i-ga-md">
              <CustomPopover
                :offset="5"
                :width="600"
                placement="right-start"
              >
                <CustomScrollbar always>
                  <div class="time-line-draggable grid-row">
                    <!-- 群組欄位 -->
                    <div class="draggable-list grid-col-xs-12 group">
                      <label>{{ i18nTranslate('column-group', defaultModuleType) }}</label>
                      <CustomDraggable
                        v-model="groupColumns"
                        :group="{ name: 'columns', pull: true, put: true }"
                        stripe
                        height="100%"
                        @change="refreshColumn"
                      >
                        <template #item="{ element: elementItem, index }">
                          <DraggableItem
                            :index="index"
                            :column="elementItem"
                            :timeLineDateKey="timeLineDateKey"
                            @changeKey="changeKey"
                          >
                            <label>{{ `${index + 1}. ${i18nTranslate(elementItem?.i18nLabel ?? elementItem.label)}` }}</label>
                          </DraggableItem>
                        </template>
                      </CustomDraggable>
                    </div>

                    <!-- 日期線欄位 -->
                    <div class="draggable-list grid-col-xs-12 date">
                      <label>{{ i18nTranslate('column-dateLine', defaultModuleType) }}</label>
                      <CustomDraggable
                        v-model="dateColumns"
                        :group="{ name: 'columns', pull: true, put: true }"
                        stripe
                        @change="refreshColumn"
                      >
                        <template #item="{ element: elementItem, index }">
                          <DraggableItem
                            :index="index"
                            :column="elementItem"
                            :timeLineDateKey="timeLineDateKey"
                            @changeKey="changeKey"
                          >
                            <label>{{ `${index + 1}. ${i18nTranslate(elementItem?.i18nLabel ?? elementItem.label)}` }}</label>
                          </DraggableItem>
                        </template>
                      </CustomDraggable>
                    </div>

                    <!-- 未使用欄位 -->
                    <div class="draggable-list grid-col-xs-24 other">
                      <label>{{ i18nTranslate('column-unuse', defaultModuleType) }}</label>
                      <CustomDraggable
                        v-model="otherColumns"
                        :group="{ name: 'columns', pull: true, put: true }"
                        stripe
                        @change="refreshColumn"
                      >
                        <template #item="{ element: elementItem, index }">
                          <DraggableItem
                            :index="index"
                            :column="elementItem"
                            :timeLineDateKey="timeLineDateKey"
                            @changeKey="changeKey"
                          >
                            <label>{{ `${index + 1}. ${i18nTranslate(elementItem?.i18nLabel ?? elementItem.label)}` }}</label>
                          </DraggableItem>
                        </template>
                      </CustomDraggable>
                    </div>
                  </div>
                </CustomScrollbar>
                <template #reference>
                  <CustomIcon
                    class="cursor-pointer"
                    :icon="['fas', 'sliders']"
                  />
                </template>
              </CustomPopover>

              <TimeLevelManagement
                v-model:base-level-index="baseLevelIndex"
                v-model:options="timeLevelOptions"
                placement="right-start"
                icon-size="default"
                @activeChange="refreshColumn"
                @baseChange="refreshColumn"
              />
            </div>
          </div>
        </template>

        <!-- 群組欄位 -->
        <VxeColumn
          v-for="column in groupColumns"
          :key="column.key"
          :field="column.key"
          :width="column?.width ?? baseWidth"
          :min-width="column?.minWidth ?? baseWidth"
          :title="i18nTranslate(column?.i18nLabel ?? column.label)"
          class-name="time-line-group"
        ></VxeColumn>
      </VxeColgroup>

      <!-- 日期線欄位 -->
      <GroupDateColumn
        :group-date-columns="groupDateColumns"
        :date-columns="dateColumns"
        :base-width="baseWidth"
        :i18n-module="props.i18nModule"
      />

      <!-- 測試顯示用 -->
      <!-- <VxeColumn
        v-for="column in dateColumns"
        :key="column.key"
        :field="column.key"
        :width="column?.width ?? baseWidth"
        :min-width="column?.minWidth ?? baseWidth"
        :title="column.title"
      ></VxeColumn> -->
    </VxeTable>
  </div>
</template>

<style lang="scss" scoped>
$max-height: calc(100vh - 240px);

.time-line {
  width: 100%;
  height: 100%;
  padding: 16px;

  &-draggable {
    width: 100%;
    height: 100%;
    max-height: $max-height;
    padding-right: 8px;
    gap: 12px 0;
  }
}

.draggable {
  &-list {
    width: 100%;
    height: 100%;
    background-color: var(--i-color-system-page);
    padding: 8px;
    border: 1px solid var(--el-color-info-light-7) {
      radius: 6px;
    };

    &.group,
    &.date {
      position: sticky;
      top: 0;
      z-index: 3;
      min-height: calc($max-height / 3);
    }

    &.other {
      opacity: 0.9;
      z-index: 1;
      min-height: calc($max-height / 3);
    }
  }

  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    width: 100%;
    height: 100%;
    padding: 8px;
  }
}
</style>

<style lang="scss">
div[class*="__TimeLineTable"] {
  table[class*="vxe-table"] {
    border-collapse: collapse; /* 合併邊框 */
  }
  tr[class*="vxe-body"] {
    content-visibility: auto;

    td.time-line-group {
      position: relative;
      vertical-align: top;
      padding: 12px 0;
      border-right: 1px solid var(--el-border-color-lighter);
    }

    div.vxe-cell {
      position: sticky;
      top: 12px;
    }
  }
}
</style>
