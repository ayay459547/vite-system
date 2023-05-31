<script setup lang="ts">
import { useRouter } from 'vue-router'
import { inject } from 'vue'
import type { Hook } from '@/declare/hook'
import { getFormSetting } from '@/lib/columns'
import { useAuthStore } from '@/stores/auth'
import { FormInput, CustomIcon } from '@/components'

const router = useRouter()

const authStore = useAuthStore()

const hook: Hook = inject('hook')
const { loading, swal } = hook()

const login = () => {
  loading(true, '驗證登入中')

  validateForm().then(() => {
    loading(true, '登入中')

    authStore.setToken('TEST123456789')
    router.push({ name: 'home' })

    setTimeout(() => {
      loading(false)

      swal({
        icon: 'success',
        title: '登入成功',
        text: '歡迎使用',
        showCancelButton: false
      })
    }, 480)
  }).catch(() => {
    setTimeout(() => {
      loading(false)

      swal({
        icon: 'warning',
        title: '登入失敗',
        text: '請確認帳號密碼是否正確',
        showCancelButton: false
      })
    }, 480)

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
      type: 'password',
      default: '',
      required: true
    }
  }
}

interface Form {
  account: string
  passowrd: string
}

const {
  columns: formColumn,
  forms: form,
  validate: validateForm
} = getFormSetting<Form>(columnSetting, 'fitler')

</script>

<template>
  <div class="login-wrapper">
    <img
      class="login-img-lg"
      src="@/assets/images/login-lg.svg"
      alt="login"
    />

    <div class="login-container card">

      <div class="login-form">
        <img
          class="login-img-xs"
          src="@/assets/images/login-xs.svg"
          alt="login"
        />

        <h1>登入</h1>

        <FormInput
          v-model="form.account"
          v-bind="formColumn.account"
        >
          <template #prefix>
            <CustomIcon name="user"/>
          </template>
        </FormInput>
        <FormInput
          v-model="form.passowrd"
          v-bind="formColumn.passowrd"
          show-password
          @keyup.enter="login"
        >
          <template #prefix>
            <CustomIcon name="unlock-keyhole"/>
          </template>
        </FormInput>

        <button class="login-button" @click="login">登入</button>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.login-form) {
  .el-input__wrapper {
    height: 48px !important;
  }
  .el-input__inner {
    font-size: 1.2em;
  }
}
.login {
  &-wrapper {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: $login-index;
    background-color: #ecf5ff;
    @extend %flex-center;
  }

  &-container {
    width: 40%;
    height: 80%;
    border-radius: 6px;
    transition-duration: 0.3s;
    position: relative;
    transform: translateX(50%);
    overflow: hidden;

    @media (max-width: 1200px) {
      transform: translateX(40%);
      width: 50%;
    }
    @media (max-width: 992px) {
      transform: translateX(0);
      width: 70%;
    }
    @media (max-width: 576px) {
      width: 99%;
      height: 99%;
    }

    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      animation: animate 6s linear infinite;
    }
    &::before {
      top: -50%;
      left: -50%;
      background: linear-gradient(0deg, transparent, #79bbff, #79bbff);
      transform-origin: bottom right;
    }
    &::after {
      top: 50%;
      left: 50%;
      background: linear-gradient(180deg, transparent, #79bbff, #79bbff);
      transform-origin: top left;
    }
  }
  @keyframes animate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  &-img-lg {
    position: absolute;
    left: 32px;
    bottom: 10%;
    width: 40%;
    transition-duration: 0.3s;
    visibility: visible;

    @media (max-width: 992px) {
      visibility: hidden;
    }
  }

  &-img-xs {
    position: absolute;
    bottom: 16px;
    right: 16px;
    width: 30%;
    transition-duration: 0.3s;
    visibility: hidden;

    @media (max-width: 992px) {
      visibility: visible;
    }

    @media (max-width: 576px) {
      width: 50%;
      visibility: visible;
    }
  }

  &-form {
    width: calc(100% - 6px);
    height: calc(100% - 6px);
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #d9ecff;
    padding: 64px;
    gap: 28px;
    position: absolute;
    top: 3px;
    left: 3px;
    z-index: 1;

    @media (max-width: 992px) {
      padding: 56px;
    }
    @media (max-width: 576px) {
      padding: 48px;
    }
  }
  &-button {
    width: 100%;
    padding: 16px;
    border: none;
    background-color: #a0cfff;
    color: inherit;
    border-radius: 6px;
    transition-duration: 0.3s;
    cursor: pointer;

    &:hover {
      background-color: #409EFF;
      color: #fff;
    }
  }
}
</style>