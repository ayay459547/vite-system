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
import type { Custom, Expose } from './TimeLineTableInfo'
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
const acviteTimeLevelList = computed(() => {
  return timeLevelOptions.value.reduce((res, option) => {
    if (option.active && option.index >= baseLevelIndex.value) {
      res.push(option.value)
    }
    return res
  }, [])
})

const timeLineDateKey = ref('')
const changeKey = async (newDateKey: string) => {
  timeLineDateKey.value = newDateKey

  await nextTick()
  refreshColumn()
}

// 群組排序用資料 X軸
const groupColumnsSortMap: {
  [key: string]: number
} = {}
const mergeCells = ref([])
const resetMergeCells = () => {
  // 合併欄位資料 必需先排序好資料
  mergeCells.value.splice(0)
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

    if (__row__ >= 0 && __col__ >= 0 && __rowspan__ >= 1) {
      mergeCells.value.push({
        row: __row__,
        col: __col__,
        rowspan: __rowspan__,
        colspan: 1
      })
    }
  })
  console.log('vxeTableRef => ', vxeTableRef.value)

  vxeTableRef.value?.setMergeCells(mergeCells.value)
}

// 群組欄位 X軸
const groupColumns = ref([])
const groupColumnsKey = computed<string[]>(() => {
  return groupColumns.value.reduce((res, groupColumn) => {
    if (!isEmpty(groupColumn.key)) {
      res.push(groupColumn.key)
    }
    return res
  }, [])
})

// 群組日期 Y軸
const groupDateColumns = ref([])
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
const dateColumns = ref([])

// 其他欄位 none
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
  showData.value.splice(0)
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

    // 設定日期群組
    const setDateGroup = (timeLineDateType: string) => {
      let dateColumnKey = ''
      const timeLineDate = item[timeLineDateKey.value]

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

  await nextTick()
  initData()
}

onMounted(() => {
  init()
})

defineExpose({
  init
})

</script>

<template>
  <div
    v-loading="isLoading"
    class="time-line"
    :class="[version, scopedId]"
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
