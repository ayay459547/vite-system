<script setup lang="ts">
import { onMounted, ref } from 'vue'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'

import { SimpleQRcode, CustomSwitch } from '@/components'
import { datetimeFormat } from '@/lib/lib_day'

const url = 'https://www.npmjs.com/package/vue-qr'
const img = 'https://raw.githubusercontent.com/Binaryify/vue-qr/master/src/assets/result1.png'
const bgimg = 'https://raw.githubusercontent.com/Binaryify/vue-qr/master/src/assets/result2.png'

const now = ref('')

onMounted(() => {
  const date = '2028-11-12 12:45:32.0'

  const res = datetimeFormat(date, 'YYYY-MM-DD')
  console.log('res => ', res)

  now.value = datetimeFormat(new Date(), 'YYYY-MM-DD A hh:mm:ss')
})

const switchValue = ref(false)

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

    <CustomSwitch
      v-model="switchValue"
    />

    <SimpleQRcode
      :text="url"
      :bgSrc='bgimg'
      :logoSrc="img"
    />

    <h4>{{ now }}</h4>
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
