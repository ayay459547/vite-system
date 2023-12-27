<script setup lang="ts">
import { CustomTimeLine, CustomIcon, SimpleTable, CustomButton } from '@/components'
import { getSimpleTableSetting } from '@/lib/lib_columns'
import { isEmpty, downloadStaticFile } from '@/lib/lib_utils'

import { columnSetting } from './columns'

const options = [
  {
    timestamp: '8/10 ~ 8/17',
    label: '排程參數設定 (1) + 排程結果預覽',
    size: 'large',
    placement: 'top',
    type: 'success',
    list: [
      { title: '一貫機連續生產規則管理', path: 'fund-1427' },
      { title: '併批工單排程順序管理', path: 'fund-1429' },
      { title: '工單預覽', path: 'auto-31-SG' },
      { title: '生產細部排程預覽', path: 'auto-32-SG' }
    ],
    ps: '多行編輯組件：加上拖拉更動順序功能，新增時間線組件'
  },
  {
    timestamp: '8/18 ~ 8/24',
    label: '看板 + 看板管理',
    size: 'large',
    placement: 'top',
    type: 'primary',
    list: [
      { title: '生產流程看板', path: 'apspub-11' },
      { title: '生產定義看板', path: 'apspub-31' }
    ],
    ps: 'modal 組件：新增全屏屬性'
  },
  {
    timestamp: '8/25 ~ 8/30',
    label: '排程參數設定 (2)',
    size: 'large',
    placement: 'top',
    type: '',
    list: [
      { title: '併批製程識別設定', path: 'fund-1431' },
      { title: '機台限制參數延伸元資料設定', path: 'fund-1432' },
      { title: '客戶型號權值繼承', path: 'fund-1605' },
      { title: '貨批派機條件設定', path: 'fund-1606' },
      { title: '製程機台區間束線設定', path: 'fund-1607' }
    ],
    ps: ''
  },
  {
    timestamp: '8/31 ~ 9/12',
    label: '機台分配',
    size: 'large',
    placement: 'top',
    type: '',
    list: [
      { title: '機台分配管理', path: 'fund-1604' }
    ],
    ps: ''
  },
  {
    timestamp: '9/13 ~ 9/15',
    label: '排程作業',
    size: 'large',
    placement: 'top',
    type: '',
    list: [
      { title: '訂單資訊', path: 'auto-112' },
      { title: '參數設定及排程', path: 'auto-13' }
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
      { title: '甘特圖預覽', path: 'auto-33' },
      { title: '資源排程甘特圖', path: 'optimiz-31' }
    ],
    ps: '新增甘特圖組件'
  }
]

const {
  tableColumns
} = getSimpleTableSetting(columnSetting, 'table')

const downloadWord = () => {
  downloadStaticFile('/file', 'iPASP更版進度.docx')
}

</script>

<template>
  <div class="page">
    <CustomButton
      label="下載進度表"
      type="info"
      plain
      icon-name="file-word"
      @click="downloadWord"
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
