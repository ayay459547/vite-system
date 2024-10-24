<script setup lang="ts">
import { ref, inject } from 'vue'
import Swal from 'sweetalert2'
import type { UseHook } from '@/declare/hook'
import { CustomButton, CustomTooltip, CustomPopover } from '@/components' // 系統組件
import { ElTooltip, ElButton } from 'element-plus'

// Custom virtual-ref
const cusButtonRef = ref()
const cusTooltipRef = ref()

const cusVisible = ref(false)

// virtual-ref
const buttonRef = ref()
const tooltipRef = ref()

const visible = ref(false)

// test
const value = ref<string>('')
const valuePhone = ref<string>('')

const useHook: UseHook = inject('useHook')
const { eventList, swal } = useHook()

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
  }).then(result => {
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
  <div class="fill flex-row i-ga-md">
    <!-- Custom virtual-ref -->
    <div class="input-test">
      <CustomButton
        v-for="i in 3"
        :key="i"
        type="primary"
        @mouseover="(e: Event) => (cusButtonRef = e.currentTarget)"
        @click="cusVisible = !cusVisible"
      >
        Custom Click to open tooltip
      </CustomButton>

      <CustomTooltip
        ref="cusTooltipRef"
        :visible="cusVisible"
        :popper-options="{
          modifiers: [
            {
              name: 'computeStyles',
              options: {
                adaptive: false,
                enabled: false
              }
            }
          ]
        }"
        :virtual-ref="cusButtonRef"
        virtual-triggering
        popper-class="singleton-tooltip"
      >
        <template #content>
          <span> Custom Some content </span>
        </template>
      </CustomTooltip>
    </div>

    <!-- virtual-ref -->
    <div class="input-test">
      <ElButton
        v-for="i in 3"
        :key="i"
        type="warning"
        @mouseover="(e: Event) => (buttonRef = e.currentTarget)"
        @click="visible = !visible"
      >
        Click to open tooltip
      </ElButton>

      <ElTooltip
        ref="tooltipRef"
        :visible="visible"
        :popper-options="{
          modifiers: [
            {
              name: 'computeStyles',
              options: {
                adaptive: false,
                enabled: false
              }
            }
          ]
        }"
        :virtual-ref="buttonRef"
        virtual-triggering
        popper-class="singleton-tooltip"
      >
        <template #content>
          <span> Some content </span>
        </template>
      </ElTooltip>
    </div>

    <!-- test -->
    <div class="input-test">
      <div
        v-fixed="{
          content: 'v-fixed test 789 456 123',
          class: '',
          style: 'color: #000'
        }"
        class="input-fixed"
      >
        v-fixed test
      </div>

      <CustomButton label="測試Popover" @click="openPopover" />

      <CustomButton label="測試Sweetalert2 info" @click="showAlert('info')" />
      <CustomButton label="測試Sweetalert2 warning" @click="showAlert('warning')" />
      <CustomButton label="測試Sweetalert2 success" @click="showAlert('success')" />
      <CustomButton label="測試Sweetalert2 error" @click="showAlert('error')" />
      <CustomButton label="測試Sweetalert2 question" @click="showAlert('question')" />

      <CustomTooltip>
        <CustomButton label="滑鼠移入 Tooltip" type="primary" />
        <template #content>
          <div>Tooltip 內容1</div>
        </template>
      </CustomTooltip>

      <CustomTooltip trigger="click">
        <CustomButton label="滑鼠點擊 Tooltip" type="success" />
        <template #content>
          <div>Tooltip 內容2</div>
        </template>
      </CustomTooltip>

      <CustomPopover>
        <div>顯示內容1 Popover</div>
        <template #reference>
          <CustomButton label="滑鼠點擊 Popover" />
        </template>
      </CustomPopover>

      <CustomPopover :width="300" title="內容2標題" trigger="hover" placement="right">
        <div>顯示內容2 Popover --------------</div>
        <template #reference>
          <CustomButton label="滑鼠移入 Popover" />
        </template>
      </CustomPopover>
    </div>

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
    flex: 1;
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

<style>
.singleton-tooltip {
  transition: transform 0.3s var(--el-transition-function-fast-bezier);
}
</style>
