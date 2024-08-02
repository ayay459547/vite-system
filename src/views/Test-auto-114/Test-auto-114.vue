<script setup lang="ts">
// Composition API
import { ref, onMounted, reactive, inject, nextTick } from 'vue'
// 引入類型
import type { UseHook, SwalResult } from '@/declare/hook.ts'
// 引入組件
import { CustomModal, CustomTabs, CustomEmpty, CustomButton } from '@/components'
// 引入權限
import { type Permission, getPermission, defaultPermission } from '@/lib/lib_permission.ts'
// 插單:機台角度
import MachineView from './MachineView/MachineView.vue'
// 插單:訂單角度
import OrderView from './OrderView/OrderView.vue'
// 插單:Excel匯入
import ImportRushOrders from './Components/ImportRushOrders.vue'

// 接收 GlobalView.vue 的 useHook
const useHook: UseHook = inject('useHook')
const { i18nTranslate, permission, swal } = useHook({
  i18nModule: 'system'
})

const tab = ref('MachineView')
const machineViewRef = ref()
const orderViewRef = ref()
const tabs = [
  { label: '機台', value: 'MachineView', i18nLabel: 'machine' },
  // { label: '製程', value: 'ProcessView', i18nLabel: 'process' },
  { label: '訂單', value: 'OrderView', i18nLabel: 'order' }
]
const isLoading = ref(true)

onMounted(() => {
  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
  }, 300)
})

const init = async () => {
  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
  }, 300)

  await nextTick()
  switch (tab.value) {
    case 'MachineView':
      machineViewRef.value?.init()
      break
    case 'OrderView':
      orderViewRef.value?.init()
      break
  }
}

const userPermission = ref<Permission>(getPermission(defaultPermission))
onMounted(() => {
  userPermission.value = permission('auto-114')
  init()
})

// Excel 匯入
const modal = reactive({
  upload: false
})
const importRushOrdersRef = ref()
const onUploadClick = () => {
  if (!userPermission.value.update) {
    swal({
      icon: 'warning',
      title: '無法上傳',
      text: '無權限',
      showCancelButton: false
    })
    return
  }
  modal.upload = true
}
const onUploadSubmit = async () => {
  swal({
    icon: 'warning',
    title: '確定上傳',
    text: '將上傳報工資料'
  }).then(async (result: SwalResult) => {
    if (result.isConfirmed && importRushOrdersRef.value) {
      isLoading.value = true
      const status = await importRushOrdersRef.value?.submit()

      if (status === 'success') {
        modal.upload = false
        await nextTick()
        init()
      } else {
        setTimeout(() => {
          isLoading.value = true
        }, 300)
      }
    }
  })
}
</script>

<template>
  <div v-loading="isLoading" class="page">
    <CustomModal
      v-model="modal.upload"
      title="插單作業：Excel匯入"
      height-size="large"
      @submit="onUploadSubmit"
    >
      <ImportRushOrders ref="importRushOrdersRef" />
    </CustomModal>

    <div class="page-tabs">
      <!-- 切換 -->
      <CustomTabs v-model="tab" :options="tabs"></CustomTabs>
      <CustomButton
        type="primary"
        :label="i18nTranslate('upload')"
        icon-name="file-arrow-up"
        plain
        :disabled="!userPermission.update"
        @click="onUploadClick"
      />
    </div>

    <div class="page-view">
      <Transition name="fade" mode="out-in">
        <MachineView v-if="tab === 'MachineView'" ref="machineViewRef" />
        <OrderView v-else-if="tab === 'OrderView'" ref="orderViewRef" />
        <CustomEmpty v-else />
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &-tabs {
    display: flex;
    align-items: center;
    gap: 2px;
    height: fit-content;
  }
  &-view {
    flex: 1;
    width: 100%;
    height: 100%;
  }
}
</style>
