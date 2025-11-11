<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted, onUnmounted, inject } from 'vue'
import { storeToRefs } from 'pinia'

import { useI18nStore } from '@/stores/useI18nStore'
import { useLayoutStore } from '@/stores/useLayoutStore'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { CustomButton, CustomButtonGroup } from '@/components/feature' // 系統組件: 功能
import { isEmpty } from '@/lib/lib_utils' // 工具
import { formatDatetime } from '@/lib/lib_format' // 格式化
import { defaultModuleType, langList, langOptions } from '@/declare/declare_i18n'

// excel
import type { ExcelColumn, Worksheet } from '@/lib/lib_files'
import { createWorkbook, downloadWorkbook } from '@/lib/lib_files'

const props = defineProps({
  i18nUsageRecord: {
    type: Object as PropType<any>
  }
})

const useHook = inject('useHook') as UseHook
const { i18nTranslate } = useHook({
  i18nModule: defaultModuleType
})

// excel
const createHeader = (worksheet: Worksheet) => {
  const columnKeyList = [
    'i18nKey',
    ...langList,
    'i18nModule'
  ]

  return columnKeyList.reduce<Partial<ExcelColumn>[]>((res, columnKey, columnIndex) => {
    res.push({
      header: columnKey,
      key: columnKey,
      style: {
        alignment: {
          horizontal: 'left',
          vertical: 'top'
        }
      },
      width: 40
    })

    worksheet.getColumn(columnIndex + 1).alignment = {
      horizontal: 'left',
      vertical: 'top'
    }

    return res
  }, [])
}
const createRows = (worksheet: Worksheet, tableData: any[]) => {
  tableData.forEach(rowData => {
    worksheet.addRow(rowData)
  })
}

// 語言
const i18nStore = useI18nStore()
const { systemLocale } = storeToRefs(i18nStore)

const changeLang = (lang?: string) => {
  let __lang__ = lang

  // 自動切換到下一個語言
  if (isEmpty(lang)) {
    const currentLang = systemLocale.value
    const currentLangIndex = langList.findIndex(langItem => langItem === currentLang)
    const nextLangIndex = currentLangIndex + 1

    // 如果已經是最後一個了 換成第一個
    const nextLang = langList[(langList.length === nextLangIndex ? 0 : nextLangIndex)]
    __lang__ = nextLang
  }

  i18nStore.setSystemLocale(__lang__)
}

const i18nTitle = '下載 i18n 使用紀錄'
const customDownloadExcel = () => {
  try {
    const workbook = createWorkbook()

    for (const routeName in props.i18nUsageRecord) {
      const worksheet = workbook.addWorksheet(routeName, {
        views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
      })

      const excelColumns = createHeader(worksheet)
      worksheet.columns = excelColumns

      const tableData = Object.values(props.i18nUsageRecord[routeName])
      createRows(worksheet, tableData)
    }

    downloadWorkbook(
      workbook,
      `${i18nTitle}_${formatDatetime(new Date(), 'YYYY-MM-DD_HHmmss')}`
    )
  } catch (e) {
    console.log(e)

    console.log(i18nTitle, props.i18nUsageRecord)
  }
}


const layoutStore = useLayoutStore()
const { isDark, layout } = storeToRefs(layoutStore)
// 色系
const changeTone = (colorTone?: string) => {
  const newColorTone = isDark.value ? 'light' : 'dark'
  layoutStore.setColorTone(colorTone ?? newColorTone)
}

// 布局
const changeLayout = (layoutType?: string) => {
  if (layoutType) {
    layoutStore.setLayout(layoutType)
  } else {
    switch (layout.value) {
      case 'layout1':
        layoutStore.setLayout('layout2')
        break
      case 'layout2':
        layoutStore.setLayout('layout3')
        break
      case 'layout3':
        layoutStore.setLayout('layout1')
        break
    }
  }
}

// 以鍵盤切換
const onKeyup = (event: KeyboardEvent) => {
  if(event.key === '*') {
    changeLang() // 語系
  } else if (event.key === '/') {
    changeTone() // 色系
  } else if (event.key === '+') {
    changeLayout() // 布局
  }
  event.preventDefault()
}
onMounted(() => {
  window.addEventListener('keyup', onKeyup)
})
onUnmounted(() => {
  window.removeEventListener('keyup', onKeyup)
})

</script>

<template>
  <div class="flex-column i-ga-md">
    <div class="flex-row i-ga-md">
      <CustomButton
        icon-name="globe"
        :label="i18nTitle"
        type="primary"
        plain
        @click="customDownloadExcel"
      />

      <CustomButtonGroup type="success">
        <CustomButton
          v-for="option in langOptions"
          :key="option.value"
          :label="option.label"
          plain
          @click="changeLang(option.value)"
        />
      </CustomButtonGroup>
    </div>

    <div class="flex-row i-ga-md">
      <CustomButtonGroup type="warning">
        <CustomButton
          label="淺色"
          plain
          @click="changeTone('light')"
        />
        <CustomButton
          label="深色"
          plain
          @click="changeTone('dark')"
        />
      </CustomButtonGroup>
    </div>

    <div class="flex-row i-ga-md">
      <CustomButtonGroup type="info">
        <CustomButton
          v-for="layout in layoutStore.layoutOptions"
          :label="`${i18nTranslate('layout')} ${layout.label}`"
          plain
          :key="layout.value"
          @click="changeLayout(layout.value)"
        />
      </CustomButtonGroup>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
