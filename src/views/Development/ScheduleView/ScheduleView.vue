<script setup lang="ts">
import {
  CustomTimeLine,
  CustomIcon,
  SimpleTable,
  CustomButton
} from '@/components'

import { columnSetting } from './columns'
import { getSimpleTableSetting } from '@/lib/lib_columns'

import { isEmpty, downloadStaticFile } from '@/lib/lib_utils'

const options = [
  {
    timestamp: '8/10 ~ 8/17',
    label: '選單1',
    size: 'large',
    placement: 'top',
    type: 'success',
    list: [
      { title: '選單1-1-1', path: 'nav1-1-1' },
      { title: '選單1-1-2', path: 'nav1-1-2' },
      { title: '選單1-1-3', path: 'nav1-1-3' },
      { title: '選單1-1-4', path: 'nav1-1-4' }
    ],
    ps: '多行編輯組件：加上拖拉更動順序功能，新增時間線組件'
  },
  {
    timestamp: '8/18 ~ 8/24',
    label: '選單2',
    size: 'large',
    placement: 'top',
    type: 'primary',
    list: [
      { title: '選單2', path: 'nav2' }
    ],
    ps: 'modal 組件：新增全屏屬性'
  },
  {
    timestamp: '9/18 ~ 9/22',
    label: '複寫甘特圖功能',
    size: 'large',
    placement: 'top',
    type: '',
    list: [
      { title: '選單3-1-1', path: 'nav3-1-1' },
      { title: '選單3-1-2', path: 'nav3-1-2' },
      { title: '選單3-1-3', path: 'nav3-1-3' }
    ],
    ps: '新增甘特圖組件'
  }
]

const {
  tableColumns
} = getSimpleTableSetting(columnSetting, 'table')

const downloadWord = () => {
  downloadStaticFile('下載word測試.docx')
}

</script>

<template>
  <div class="page">
    <CustomButton
      label="下載word"
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
