<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'

import {
  VxeTable,
  VxeColgroup,
  VxeColumn,
  CustomIcon,
  CustomPopover,
  CustomDraggable,
  CustomScrollbar,
  TimeLevelManagement
} from '@/components'

import { formatDatetime } from '@/lib/lib_format'
import { hasOwnProperty, isEmpty, getUuid, deepClone } from '@/lib/lib_utils'

import dayjs, { getQuarter, getWeekOfYear } from '@/lib/lib_day'
import type { Custom } from './TimeLineTableInfo'
import { version, props as timeLineTableProps } from './TimeLineTableInfo'

import DraggableItem from './Components/DraggableItem.vue'
import GroupDateColumn from './Components/GroupDateColumn.vue'

const baseWidth = 80

const scopedId = getUuid('__TimeLineTable__')

const props = defineProps(timeLineTableProps)

const baseLevelIndex = ref(1)
const timeLevelOptions = ref([
  { index: 6, name: '年', active: false, value: 'year' },
  // { index: 5, name: '半年', active: false, value: 'half' },
  { index: 4, name: '季', active: false, value: 'quarter' },
  { index: 3, name: '月', active: true, value: 'month' },
  { index: 2, name: '周', active: false, value: 'week' },
  { index: 1, name: '日', active: true, value: 'day' }
  // { index: 0, name: '時', active: false, value: 'hour' }
])

const acviteValueList = computed(() => {
  return timeLevelOptions.value.reduce((res, option) => {
    if (option.active && option.index >= baseLevelIndex.value) {
      res.push(option.value)
    }
    return res
  }, [])
})

const timeLineDateKey = ref('')
const changeKey = (newDateKey: string) => {
  timeLineDateKey.value = newDateKey
}

// 群組排序用資料
const groupColumnsSortMap: {
  [key1: string]: {
    [key2: string]: {
      showIndex: number
      count: number
      columnIndex: number
    }
  }
} = {}
const mergeCells = []

// 群組欄位 X
const groupColumns = ref([])

// 群組日期 Y
const groupDateColumns = ref([])

// 日期線欄位
const dateColumns = ref([])

// 其他欄位
const otherColumns = ref([])

const vxeTableRef = ref()
const renderKey = ref(0)
const refreshColumn = async () => {
  await nextTick()
  initData()
  renderKey.value++
}

const isLoading = ref(true)
const isShow = ref(false)

const showData = ref([])

const quarterPrefix = 'Quarter-'
const quarterRegex = new RegExp(quarterPrefix)

const weekPrefix = 'Week-'
const weekRegex = new RegExp(weekPrefix)

// 初始化資料
const initData = () => {
  isLoading.value = true

  for (let sortMapKey in groupColumnsSortMap) {
    delete groupColumnsSortMap[sortMapKey]
  }
  mergeCells.splice(0)
  showData.value.splice(0)

  // 日期群組
  const _dateGroup = {}
  const _tableData = deepClone(props.tableData, [])

  const mapData = _tableData.reduce((resMap, item, itemIndex) => {
    const rowkey = getUuid('group-id')
    const rowData = {...item}

    if(hasOwnProperty(rowData, timeLineDateKey.value)) {
      const timeLineDate = rowData[timeLineDateKey.value]

      let tempRef = _dateGroup
      let groupDate = ''

      // 設定日期群組
      const setDateGroup = (timeLineDateType: string, timeLineDate: string) => {
        let dateColumnKey = ''
        switch (timeLineDateType) {
          case 'year':
            dateColumnKey = formatDatetime(timeLineDate, 'YYYY')
            break
          case 'quarter':
            dateColumnKey = `${quarterPrefix}${getQuarter(timeLineDate)}`
            break
          case 'month':
            dateColumnKey = formatDatetime(timeLineDate, 'YYYY-MM')
            break
          case 'week':
            dateColumnKey = `${weekPrefix}${getWeekOfYear(timeLineDate)}`
            break
          case 'day':
            dateColumnKey = formatDatetime(timeLineDate, 'YYYY-MM-DD')
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

      // 將一樣的資料放一起
      const setSortMap = () => {
        groupColumns.value.forEach((column, columnIndex) => {
          let _sortMapRef = null
          if (!hasOwnProperty(groupColumnsSortMap, column.key)) {
            groupColumnsSortMap[column.key] = {}
          }
          _sortMapRef = groupColumnsSortMap[column.key]

          const columnData = rowData[column.key] ?? 'empty'
          if (!hasOwnProperty(_sortMapRef, columnData)) {
            _sortMapRef[columnData] = {
              showIndex: itemIndex,
              count: 0,
              columnIndex
            }
          }
          // 計算合併用 目前只有第一欄 會合併
          // if (columnIndex === 0) {
          //   _sortMapRef[columnData].count++
          // }
        })
      }

      // 使用日期資料 群組
      if (!isEmpty(timeLineDate)) {
        acviteValueList.value.forEach(timeLineDateType => {
          setDateGroup(timeLineDateType, timeLineDate)
        })
        tempRef = rowkey
        dateColumns.value.forEach(dateColumn => {
          const field = `${groupDate}-${dateColumn.key}`
          const fieldData = rowData[dateColumn.key]
          rowData[field] = fieldData
        })

        setSortMap()

        // 設定表格資料
        resMap.set(rowkey, rowData)
      }
    }

    return resMap
  }, new Map())

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
  groupDateColumns.value = getGroupDateColumns(_dateGroup)

  // 欄位合併
  for (let columnKey in groupColumnsSortMap) {
    const columnSortData = groupColumnsSortMap[columnKey]

    for (let mergeCellKey in columnSortData) {
      const { showIndex = 0, count = 0, columnIndex = 0 } = columnSortData[mergeCellKey]
      if (count > 1) {
        mergeCells.push({ row: showIndex, col: columnIndex, rowspan: count, colspan: 1 })
      }
    }
  }

  showData.value = Array.from(mapData.values()).sort((a, b) => {
    for (let columnKey in groupColumnsSortMap) {
      const columnSortData = groupColumnsSortMap[columnKey]
      if (
        hasOwnProperty(columnSortData, a[columnKey]) &&
        hasOwnProperty(columnSortData, b[columnKey])
      ) {
        return columnSortData[a[columnKey]].showIndex - columnSortData[b[columnKey]].showIndex
      }
    }
    return 0
  })

  console.log({
    dateGroup: _dateGroup,
    groupDateColumns: groupDateColumns.value,
    showData: showData.value,
    groupColumnsSortMap,
    mergeCells
    // __showIndex
  })

  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

const init = () => {
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

  const sortCallback = (a: Custom.TableColumn, b: Custom.TableColumn) => {
    const [aIndex, bIndex] = [ a?.timeIndex ?? -1, b?.timeIndex ?? -1 ]
    return aIndex - bIndex
  }

  groupColumns.value = _groupColumns.sort(sortCallback)

  dateColumns.value = _dateColumns.sort(sortCallback)

  otherColumns.value = _otherColumns.sort(sortCallback)

  // 設定時間線的key
  const timeLineDateColumn = props.tableColumns.find(column => {
    return column?.isTimeLineDate
  })
  changeKey(timeLineDateColumn?.key ?? '')

  initData()

  setTimeout(() => {
    isShow.value = true
  }, 300)
}

onMounted(() => {
  isLoading.value = true
  init()
})

</script>

<template>
  <div
    v-loading="isLoading"
    class="time-line"
    :class="[version, scopedId]"
  >
    <VxeTable
      v-if="isShow"
      ref="vxeTableRef"
      :key="renderKey"
      show-overflow
      show-header-overflow
      :border="true"
      stripe
      :data="showData"
      :row-config="{isCurrent: true, isHover: true}"
      :column-config="{resizable: true}"
      :scroll-y="{enabled: true, gt: 0}"
      :scroll-x="{enabled: true, gt: 0}"
      :merge-cells="mergeCells"
    >
      <VxeColgroup
        title="設定"
        fixed="left"
      >
        <template #header>
          <div class="flex-row i-ga-lg">
            <h3>設定</h3>

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
                      <label>群組欄位</label>
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
                          />
                        </template>
                      </CustomDraggable>
                    </div>

                    <!-- 日期線欄位 -->
                    <div class="draggable-list grid-col-xs-12 date">
                      <label>日期線欄位</label>
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
                          />
                        </template>
                      </CustomDraggable>
                    </div>

                    <!-- 未使用欄位 -->
                    <div class="draggable-list grid-col-xs-24 other">
                      <label>未使用欄位</label>
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
                          />
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
          :title="column.title"
        ></VxeColumn>
      </VxeColgroup>

      <!-- 日期線欄位 -->
      <GroupDateColumn
        :group-date-columns="groupDateColumns"
        :date-columns="dateColumns"
        :base-width="baseWidth"
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
    height: 100;
    min-width: 500px;
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
