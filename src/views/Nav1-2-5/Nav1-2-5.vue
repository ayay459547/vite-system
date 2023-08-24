<script setup lang="ts">
import { SimpleQRcode } from '@/components'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'

const url = 'https://www.npmjs.com/package/vue-qr'
const img = 'https://raw.githubusercontent.com/Binaryify/vue-qr/master/src/assets/result1.png'
const bgimg = 'https://raw.githubusercontent.com/Binaryify/vue-qr/master/src/assets/result2.png'
const test = () => {
  // console.log(777)
}

</script>

<template>
  <div class="page">
    <h3>QRcode測試</h3>

    <div style="width: 200px; height: 200px;">
      <vue-qr
        :bgSrc='bgimg'
        :logoSrc="img"
        :text="url"
      ></vue-qr>
    </div>

    <SimpleQRcode
      :url="url"
      :bgSrc='bgimg'
      :logoSrc="img"
    />
  </div>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>