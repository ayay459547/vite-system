<script setup lang="ts">
import { ref, inject } from 'vue'
import Swal from 'sweetalert2'

import type { Hook } from '@/declare/hook'
import { CustomButton, CustomTooltip, CustomPopover } from '@/components'

const value = ref<string>('')
const valuePhone = ref<string>('')

const hook: Hook = inject('hook')
const { eventList, swal } = hook()

const openPopover = (e: MouseEvent) => {
  eventList(e, [
    {
      icon: ['fas', 'user'],
      label: 'callback-1',
      event: () => {
        console.log('callback-1: 密碼 => ', value.value)
      }
    },
    {
      icon: ['fas', 'phone'],
      label: 'callback-2',
      event: () => {
        console.log('callback-2: phone => ', valuePhone.value)
      }
    }
  ])
}
type Icon = 'info' | 'warning' | 'success' | 'error' | 'question'
const showAlert = (icon: Icon) => {
  swal({
    icon,
    title: '測試彈框'
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire('Saved!', '', 'success')
    } else if (result.isDenied) {
      Swal.fire('Changes are not saved', '', 'info')
    }
  })
}

</script>

<template>
  <div class="input-test">
    <div
      v-fixed="{
        text: 'v-fixed test 789 456 123',
        class: '',
        style: 'color: #fff'
      }"
      class="input-fixed"
    >
      v-fixed test
    </div>

    <CustomButton
      label="測試Popover"
      @click="openPopover"
    />

    <CustomButton
      label="測試Sweetalert2 info"
      @click="showAlert('info')"
    />
    <CustomButton
      label="測試Sweetalert2 warning"
      @click="showAlert('warning')"
    />
    <CustomButton
      label="測試Sweetalert2 success"
      @click="showAlert('success')"
    />
    <CustomButton
      label="測試Sweetalert2 error"
      @click="showAlert('error')"
    />
    <CustomButton
      label="測試Sweetalert2 question"
      @click="showAlert('question')"
    />

    <CustomTooltip>
      <CustomButton label="滑鼠移入 Tooltip" type="primary"/>
      <template #content>
        <div>Tooltip 內容1</div>
      </template>
    </CustomTooltip>

    <CustomTooltip trigger="click">
      <CustomButton label="滑鼠點擊 Tooltip" type="success"/>
      <template #content>
        <div>Tooltip 內容2</div>
      </template>
    </CustomTooltip>

    <CustomPopover>
      <div>顯示內容1 Popover</div>
      <template #reference>
        <CustomButton label="滑鼠點擊 Popover"/>
      </template>
    </CustomPopover>

    <CustomPopover
      :width="300"
      title="內容2標題"
      trigger="hover"
      placement="right"
    >
      <div>顯示內容2 Popover --------------</div>
      <template #reference>
        <CustomButton label="滑鼠移入 Popover"/>
      </template>
    </CustomPopover>
  </div>
</template>

<style lang="scss" scoped>
.input {
  &-test {
    width: 100%;
    height: 100%;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &-fixed {
    border: 1px solid skyblue;
    border-radius: 6px;
    width: fit-content;
    height: fit-content;
    padding: 8px;
    cursor: default;
  }
}
</style>
