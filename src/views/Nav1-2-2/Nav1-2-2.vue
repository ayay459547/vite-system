<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'

import { ElCard, ElBacktop } from 'element-plus'

import { CustomTimeLine, CustomTag, CustomButton, SimpleQRcode } from '@/components/feature'
import { CustomSwitch } from '@/components/input'

import { awaitTime, scrollToEl } from '@/lib/lib_utils' // 工具
import { formatDatetime } from '@/lib/lib_format' // 格式化

const options = [
  {
    label: 'Custom icon',
    timestamp: '2018-04-12 20:46',
    size: 'large',
    type: 'primary',
    placement: 'top'
  },
  {
    label: 'Custom color',
    timestamp: '2018-04-03 20:46',
    color: '#0bbd87',
    placement: 'top'
  },
  {
    label: 'Custom size',
    timestamp: '2018-04-03 20:46',
    size: 'large',
    type: '',
    placement: 'top'
  },
  {
    label: 'Custom hollow',
    timestamp: '2018-04-03 20:46',
    type: 'primary',
    hollow: true,
    placement: 'top'
  },
  {
    label: 'Custom hollow',
    timestamp: '2018-04-03 20:46',
    type: 'primary',
    hollow: true,
    placement: 'top'
  },
  {
    label: 'Custom hollow',
    timestamp: '2018-04-03 20:46',
    type: 'primary',
    hollow: false,
    placement: 'top'
  },
  {
    label: 'Custom hollow',
    timestamp: '2018-04-03 20:46',
    type: 'primary',
    hollow: true
  },
  {
    label: 'Custom hollow',
    timestamp: '2018-04-03 20:46',
    type: 'primary',
    hollow: true,
    placement: 'top'
  },
  {
    label: 'Default node',
    timestamp: '2018-04-03 20:46',
    type: 'info',
    placement: 'top'
  }
]

const options1 = ref([])
const testPushOptions = async () => {
  options1.value.splice(0)
  awaitTime(1000)

  for (let i = 0; i < options.length; i++) {
    await awaitTime(300)
    console.log(i, ' => ', options[i])
    options1.value.push(options[i])

    await nextTick()
    const allCard = document.querySelectorAll('.test-card')
    const lastEl = allCard[allCard.length - 1]
    scrollToEl(lastEl, { behavior: 'auto' })
  }
}

onMounted(() => {
  testPushOptions()
})

const options2: any[] = [
  {
    label: 'Danger',
    timestamp: '2018-04-12 20:46',
    size: 'large',
    type: 'danger',
    placement: 'top'
  },
  {
    label: '#0bbd87',
    timestamp: '2018-04-03 20:46',
    color: '#0bbd87',
    placement: 'top'
  },
  {
    label: 'Danger',
    timestamp: '2018-04-12 20:46',
    size: 'large',
    type: 'danger',
    hollow: true,
    placement: 'top'
  },
  {
    label: 'Success',
    timestamp: '2018-04-03 20:46',
    type: 'success',
    placement: 'top'
  },
  {
    label: 'Empty',
    timestamp: '2018-04-03 20:46',
    size: 'large',
    type: '',
    placement: 'top'
  },
  {
    label: 'Primary',
    timestamp: '2018-04-03 20:46',
    type: 'primary',
    hollow: true,
    placement: 'top'
  },
  {
    label: 'Info',
    timestamp: '2018-04-03 20:46',
    type: 'info',
    placement: 'top'
  }
]

// qrcode
const url = 'https://www.npmjs.com/package/vue-qr'
const img = 'https://raw.githubusercontent.com/Binaryify/vue-qr/master/src/assets/result1.png'
const bgimg = 'https://raw.githubusercontent.com/Binaryify/vue-qr/master/src/assets/result2.png'

const now = ref('')

onMounted(() => {
  const date = '2028-11-12 12:45:32.0'

  const res = formatDatetime(date, 'YYYY-MM-DD')
  console.log('res => ', res)

  now.value = formatDatetime(new Date(), 'YYYY-MM-DD A hh:mm:ss')
})

const switchValue = ref(false)

</script>

<template>
  <div class="nav-1-2-2">
    <CustomTimeLine :options="options1">
      <template #default="{ label }">
        <ElCard>
          <h3 class="test-card">{{ label }}</h3>
          <h4>Update Github template</h4>
          <p>Tom committed 2018/4/2 20:46</p>
        </ElCard>
      </template>
    </CustomTimeLine>

    <CustomButton label="再一次" @click="testPushOptions" />

    <CustomTimeLine :options="options2">
      <template #default="{ label }">
        <ElCard>
          <h3>{{ label }}</h3>
        </ElCard>
      </template>
    </CustomTimeLine>

    <div class="flex-column i-ga-md">
      <CustomTag label="test2" type="danger" icon-name="user" icon-move="translate" />
      <CustomTag label="test3" type="success" />
    </div>

    <div class="page">
      <h3>QRcode測試</h3>

      <div style="width: 200px; height: 200px">
        <vue-qr :bgSrc="bgimg" :logoSrc="img" :text="url"></vue-qr>
      </div>

      <CustomSwitch v-model="switchValue" />

      <SimpleQRcode :text="url" :bgSrc="bgimg" :logoSrc="img" />

      <h4>{{ now }}</h4>
    </div>

    <ElBacktop :right="100" :bottom="100" :visibility-height="0"/>
    <ElBacktop :bottom="100" :visibility-height="0">
      <div
        style="
          height: 100%;
          width: 100%;
          background-color: var(--el-bg-color-overlay);
          box-shadow: var(--el-box-shadow-lighter);
          text-align: center;
          line-height: 40px;
          color: #1989fa;
        "
      >UP</div>
  </ElBacktop>
  </div>
</template>

<style lang="scss" scoped>
.nav-1-2-2 {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  gap: 16px;
}

.page {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
