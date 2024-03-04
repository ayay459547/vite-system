<script setup lang="ts">
import { CustomTimeLine, CustomIcon, SimpleTable, CustomButton } from '@/components'
import { useSimpleTableSetting } from '@/lib/lib_columns'
import { isEmpty, downloadFile } from '@/lib/lib_utils'

import { columnSetting } from './columns'

const options = [
  {
    timestamp: '8/10 ~ 8/17',
    label: '工作項目(1)',
    size: 'large',
    placement: 'top',
    type: 'success',
    list: [
      { title: '測試表格新功能', path: 'nav-test-new' },
      { title: '時間線測試', path: 'nav1-1-5' },
      { title: '功能維護中', path: 'nav1-1-3' },
      { title: '對話框測試', path: 'nav1-1-7' }
    ],
    ps: '多行編輯組件：加上拖拉更動順序功能，新增時間線組件'
  },
  {
    timestamp: '8/18 ~ 8/24',
    label: '工作項目(2)',
    size: 'large',
    placement: 'top',
    type: 'primary',
    list: [
      { title: '甘特圖測試', path: 'nav1-4-1' },
      { title: '輸入框換架構', path: 'nav1-4-2' }
    ],
    ps: 'modal 組件：新增全屏屬性'
  },
  {
    timestamp: '8/25 ~ 8/30',
    label: '工作項目(3)',
    size: 'large',
    placement: 'top',
    type: '',
    list: [
      { title: '柱狀圖測試', path: 'nav1-4-3' },
      { title: '圖表測試1', path: 'test-Caleb-chart1' },
      { title: '圖表測試2', path: 'test-Caleb-chart2' },
      { title: '圖表測試3', path: 'test-Caleb-chart3' },
      { title: '圖表測試4', path: 'test-Caleb-chart4' }
    ],
    ps: ''
  },
  {
    timestamp: '8/31 ~ 9/12',
    label: '工作項目(4)',
    size: 'large',
    placement: 'top',
    type: '',
    list: [
      { title: '南丁格爾玫瑰圖', path: 'chart-1' }
    ],
    ps: ''
  },
  {
    timestamp: '9/13 ~ 9/15',
    label: '工作項目(5)',
    size: 'large',
    placement: 'top',
    type: '',
    list: [
      { title: '測試頁面-1', path: 'test-page-1' },
      { title: '多行編輯測試', path: 'form-list-test' }
    ],
    ps: 'table組件：新增勾選功能'
  },
  {
    timestamp: '9/18 ~ 9/22',
    label: '複寫甘特圖功能',
    size: 'large',
    placement: 'top',
    type: '',
    list: [
      { title: 'AJAX測試', path: 'ajax-test' },
      { title: '純資料表單測試', path: 'data-table-test' }
    ],
    ps: '新增甘特圖組件'
  }
]

const {
  tableColumns
} = useSimpleTableSetting(columnSetting, 'table')

</script>

<template>
  <div class="page">
    <CustomButton
      label="下載Word"
      type="info"
      plain
      icon-name="file-word"
      @click="downloadFile('/static/file/', '下載word測試.docx')"
    />

    <h3 class="i-my-md">工作進度表</h3>

    <CustomTimeLine :options="options">
      <template #default="{ label, list, ps }">
        <div class="flex-column i-ga-md">
          <label>{{ label }}</label>
          <SimpleTable
            :table-data="list"
            :table-columns="tableColumns"
          >
            <template #column-path="{ row }">
              <RouterLink
                :to="`${row.path}`"
                v-slot="{ navigate }"
              >
              <div class="flex-row i-ga-xs text-primary" @click="navigate">
                <CustomIcon name="up-right-from-square"/>
                <span>{{ row.path }}</span>
              </div>
              </RouterLink>
            </template>
          </SimpleTable>

          <div>其他說明：{{ isEmpty(ps) ? '無' : ps }}</div>
        </div>
      </template>
    </CustomTimeLine>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  padding: 32px;

  label {
    font-size: 1.3em;
  }
}
</style>
