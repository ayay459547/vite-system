<script setup lang="ts">
import { useRouter } from 'vue-router'
import { inject } from 'vue'
import type { Hook } from '@/declare/hook'
import { swal } from '@/lib/utils'
import { getFormColumns } from '@/lib/columns'

const router = useRouter()

const hook: Hook = inject('hook')
const { loading } = hook()

const login = () => {
  loading(true, '驗證登入中')

  validateForm().then(() => {
    loading(true, '登入中')
    router.push({ name: 'home' })

    setTimeout(() => {
      loading(false)

      swal({
        icon: 'success',
        title: '登入成功',
        text: '歡迎使用',
        showCancelButton: false
      })
    }, 500)
  }).catch(() => {
    setTimeout(() => {
      loading(false)

      swal({
        icon: 'warning',
        title: '登入失敗',
        text: '請確認帳號密碼是否正確',
        showCancelButton: false
      })
    }, 500)

  })

}

const columnSetting = {
  account: {
    label: '帳號',
    fitler: {
      default: '',
      required: true
    }
  },
  passowrd: {
    label: '密碼',
    fitler: {
      default: '',
      required: true
    }
  }
}

const {
  columns: filterColumn,
  forms: filterForm,
  validate: validateForm
} = getFormColumns(columnSetting, 'fitler')

</script>

<template>
  <div class="login-wrapper">
    <div class="login-container card">
      <h1>登入</h1>

      <div>
        <FormInput
          v-model="filterForm.account"
          v-bind="filterColumn.account"
        />
        <FormInput
          v-model="filterForm.passowrd"
          v-bind="filterColumn.passowrd"
        />
      </div>

      <CustomButton
        label="登入"
        @click="login"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  &-wrapper {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: $login-index;
    background-color: #d8dfe2;
    @extend %flex-center;
  }
  &-container {
    width: 80%;
    height: 80%;
    background-color: #d8dfe2;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 6px;
  }
}
</style>