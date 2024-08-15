<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted } from 'vue'
import { CustomTableV2 } from '@/components'

const props = defineProps({
  tableData: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => {
      return []
    },
    description: '表格資料'
  },
  tableColumns: {
    type: Object as PropType<any[]>,
    required: false,
    default: () => {
      return {}
    },
    description: '表格欄位顯示用設定'
  },
  dateColumns: {
    type: Object as PropType<any[]>,
    required: false,
    default: () => {
      return {}
    },
    description: '表格欄位顯示用設定'
  }
})

onMounted(() => {
  // console.log('props => ', props)
})

</script>

<template>
  <div class="v-table">
    <CustomTableV2
      :data="props.tableData"
      :columns="[...props.dateColumns, ...props.tableColumns]"
      :cache="20"
      :header-height="80"
      fixed
    >
      <!-- <template #header-cell>header-cell</template> -->
      <!-- <template #header-deliveryDate="{ column }">
        <label class="fill-y i-py-xs">{{ $log(column) + '123' }}</label>
      </template> -->
      <!-- <template #column-all="{ row, prop }">
        <span>{{ row[prop] }}</span>
      </template> -->
    </CustomTableV2>
  </div>
</template>

<style lang="scss" scoped>
.v-table {
  width: 100%;
  height: 100%;
}
</style>
