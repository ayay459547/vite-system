<script setup lang="ts">
import { ref } from 'vue'
import { CustomInput, CustomDivider, CustomEmpty } from '@/components'
const value = ref<string>('Aa123456')
const valuePhone = ref<string>('')

// import { useEnvStore } from '@/stores/stores_env'

// const envStore = useEnvStore()

// console.log(envStore)

const checkboxValue = ref([])
const options = [
  { label: 'test1', value: '1', color: '#909399' },
  { label: 'test2', value: '2', color: '#b88230' },
  { label: 'test3', value: '3', color: '#67C23A' },
  { label: 'test4', value: '4' },
  { label: 'test5', value: '5' }
]
</script>

<template>
  <div class="nav-2">
    <h1 class="i-mb-md">This is Nav-2 page</h1>
    <CustomInput
      v-model="value"
      label="測試密碼"
      required
      :validate="['password']"
    />

    <CustomDivider />

    <CustomInput
      v-model="valuePhone"
      label="測試phone"
      :validate="['phone']"
    />

    <CustomDivider />

    <CustomInput
      v-model="checkboxValue"
      type="checkbox"
      :options="options"
    >
      <!-- <template #options="{ label, value, color, isChecked }">
        <div>{{ `${label} => ${value} => ${color} => ${isChecked}` }}</div>
      </template> -->
    </CustomInput>

    <CustomDivider />

    <CustomInput
      v-model="checkboxValue"
      type="checkbox"
      :options="options"
    >
      <template #option="{ label, value, color, isChecked }">
        <div>{{ `${label} => ${value} => ${color} => ${isChecked}` }}</div>
      </template>
    </CustomInput>

    <CustomEmpty />
  </div>
</template>

<style lang="scss" scoped>
.nav-2 {
  width: 100%;
  height: 100%;
  padding: 32px;
}
</style>