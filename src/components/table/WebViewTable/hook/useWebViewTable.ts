import { shallowRef, ref, inject } from 'vue'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
// import DownloadModal from '@/components/table/DownloadModal/DownloadModal.vue'
import type { ScopeKey } from '@/types/types_i18n'

// import { getColumnSetting } from '@/lib/lib_idb'
// import { isEmpty, hasOwnProperty } from '@/lib/lib_utils'
import { useTableSetting } from '@/lib/lib_columns'

// import {
//   webViewUrl,
//   getUrlParams,
//   getWebViewParams
// } from '../api'
import type { Types, Props } from '../WebViewTableInfo'

export const useWebViewTable = (props: Partial<Props>, i18nModule: ScopeKey) => {
  const useHook = inject('useHook') as UseHook
  const { i18nTranslate, i18nTest } = useHook({ i18nModule })

  const tableData = shallowRef<Array<Types['tableData']>>([])
  const tableDataCount = ref(0)

  const {
    tableSetting,
    downloadExcel,
    // setParams,
    getParams,
    changePage,
    toggleSelection,
    getSelectionRows,
    getDisplayData,
    spanInfo
  } = useTableSetting(
    props.columnSetting ?? {},
    props.tableKey,
    props.tableOptions ?? {},
    { i18nTranslate, i18nTest }
  )

  return {
    tableData,
    tableDataCount,

    tableSetting,
    downloadExcel,
    // setParams,
    getParams,
    changePage,
    toggleSelection,
    getSelectionRows,
    getDisplayData,
    spanInfo
  }
}
