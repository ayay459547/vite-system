<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps({
  rowData: {
    type: Object
  },
  columnKey: {
    type: String
  },
  spanInfo: {
    type: Object
  },
  columnsWidth: {
    type: Object
  }
})

const tableRef = ref()
const tableData = ref([])
const columns = ref([])
const getDisplayData = ref()

onMounted(() => {
  tableData.value = props.spanInfo.getSubTableData(props.rowData, props.columnKey)
  columns.value = props.spanInfo.getSubColumns(props.columnKey)
  getDisplayData.value = props.spanInfo.getSubDisplayData

})

</script>

<template>
  <div class="sub-table hover-card-info" ref="tableRef">
    <div
      v-for="subRowData in tableData"
      :key="subRowData"
      class="sub-row"
    >
      <template v-for="prop in columns" :key="prop">
        <div class="sub-ceil" :style="`width: ${props.columnsWidth[prop]}px`">
          {{  getDisplayData(rowData, subRowData, prop)  }}
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$border-color: var(--i-color-row-border);
.sub {
  &-table {
    border: 1px solid $border-color;
    margin: 4px -4px;
  }
  &-row {
    display: flex;
    border-bottom: 1px solid $border-color;
    transition: 0.3s;

    background-color: var(--i-color-row-odd);
    &:hover {
      background-color: var(--i-color-row-odd-hover);
    }
    &:nth-child(even) {
      background-color: var(--i-color-row-even);

      &:hover {
        background-color: var(--i-color-row-even-hover);
      }
    }

    &:last-child {
      border-bottom: 1px solid #ffffff00;
    }
  }
  &-ceil {
    // flex: 1;
    padding: 6px 6px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  // &-type {
  //   border-right: 1px solid $border-color;
  // }
}
</style>
