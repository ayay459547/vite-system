<script setup lang="ts">
import { reactive } from 'vue'

import { useNetwork } from '@/lib/lib_hook' // 自訂Composition API
import { CustomIcon } from '@/components' // 系統組件

/**
 * 網路狀態
 * navigator.connection
  {
    isSupported: true, // 瀏覽器是否支援
    isOnline: true, // 是否 連上網路
    saveData: false, // 是否為 數據節省模式
    onlineAt: 1730164863498, // 最後連上網路時間
    downlink 1.6, // 下載速度 Mbps
    effectiveType: "4g", // 類型 4g/3g/2g/slow-2g
    rtt: 0 // 估算的往返時間(Round Trip Time) ms
  }
 *
 */
const network = reactive(useNetwork())

</script>

<template>
  <div class="network-wifi">
    <CustomIcon
      :class="network.isOnline ? 'success' : 'danger'"
      name="wifi"
      size="large"
    />
  </div>
</template>

<style lang="scss" scoped>
.network {
  &-wifi {
    position: fixed;
    z-index: 9999;
    bottom: 12px;
    right: 12px;
    width: fit-content;
    height: fit-content;
    font-size: 0.8em;
    transition: 0.3s;
    opacity: 0.6;

    &:hover {
      opacity: 1;
    }

    .success {
      color: var(--el-color-success);
    }
    .danger {
      color: var(--el-color-danger);
    }
  }
}
</style>
