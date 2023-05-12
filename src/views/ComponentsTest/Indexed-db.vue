<script setup lang="ts">
import { ref, inject } from 'vue'
import type { Hook } from '@/declare/hook'

const value = ref<string>('')
const valuePhone = ref<string>('')

const hook: () => Hook = inject('hook')
const { openEventList } = hook()

const openPopover = (e: MouseEvent) => {
  openEventList(e)
}

</script>

<template>
  <div class="input-test">
    <h1 class="i-mb-md">{{ $t('test') }}</h1>
    <FormInput
      v-model="value"
      label="測試密碼"
      required
      :validate="['password']"
    />
    <FormInput
      v-model="valuePhone"
      label="測試phone"
      :validate="['phone']"
    />
    <CustomButton
      label="測試Popover"
      @click="openPopover"
    />
  </div>
</template>

<style lang="scss" scoped>
.input-test {
  width: 100%;
  height: 100%;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>