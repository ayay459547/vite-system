<script setup lang="ts">
import { reactive, onBeforeMount, onMounted } from 'vue'
import Clusterize from 'clusterize.js'
import { ElTable, ElTableColumn } from 'element-plus'

const url = 'https://segmentfault.com/q/1010000017202682'

const tableData = reactive<any[]>([])
let clusterize: any = null

onBeforeMount(() => {
  for(let i = 0 ; i < 1000; i++){
    tableData.push({
      no: i,
      date: '2016-05-02',
      name: '王小虎' + i,
      address: '上海市普陀区金沙江路 1518 弄'
    })
  }
})

onMounted(() => {
  setTimeout(() => {
    clusterize = new Clusterize({
      rows: document.querySelectorAll('.el-table__row'),
      scrollElem: document.getElementById('scrollContent'),
      contentElem: document.querySelector('.el-table__body tbody')
    })

    console.log(clusterize)
  }, 2000)
})
</script>

<template>
  <div class="page">
    <div id="scrollContent" style="height: 300px; overflow: auto;">
      <div class="i-mb-xl">{{ url }}</div>

      <ElTable :data="tableData" style="width: 100%">
        <ElTableColumn prop="no" label="index" width="80">
        </ElTableColumn>
        <ElTableColumn prop="date" label="日期" width="180">
        </ElTableColumn>
        <ElTableColumn prop="name" label="姓名" width="180">
        </ElTableColumn>
        <ElTableColumn prop="address" label="地址">
        </ElTableColumn>
      </ElTable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
}
</style>
