<script setup lang="ts">
import type { Hook } from '@/declare/hook'
import { inject, ref } from 'vue'
import { getFormSetting } from '@/lib/lib_columns'
import { isEmpty } from '@/lib/lib_utils'

import { CustomIcon, CustomInput } from '@/components'
import { loginSystem } from './api'

const hook: Hook = inject('hook')
const { i18nTranslate } = hook()

const emit = defineEmits(['login'])

const isLoading = ref(false)

const login = () => {
  validateForm().then(async () => {
    const { account, passowrd } = form
    isLoading.value = true
    const userId = await loginSystem(account, passowrd)

    if (!isEmpty(userId)) {
      emit('login', userId)
    } else {
      isLoading.value = false
    }
  }).catch(() => {
    isLoading.value = false
  })

}

const columnSetting = {
  account: {
    label: '帳號',
    fitler: {
      type: 'text',
      default: 'admin',
      required: true
    }
  },
  passowrd: {
    label: '密碼',
    fitler: {
      type: 'password',
      default: '123',
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

const svg = `
  <path class="path" d="
    M 30 15
    L 28 17
    M 25.61 25.61
    A 15 15, 0, 0, 1, 15 30
    A 15 15, 0, 1, 1, 27.99 7.5
    L 15 15
  " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
`

</script>

<template>
  <div
    v-loading="isLoading"
    element-loading-text="Loading..."
    :element-loading-spinner="svg"
    element-loading-svg-view-box="-10, -10, 50, 50"
    element-loading-background="rgba(122, 122, 122, 0.8)"
    class="login-wrapper"
  >
    <img
      class="login-img-lg"
      src="@/assets/images/common/login-lg.svg"
      alt="login"
    />

    <div class="login-container card-primary">

      <div class="login-form">
        <img
          class="login-img-xs"
          src="@/assets/images/common/login-xs.svg"
          alt="login"
        />

        <h1>登入</h1>

        <CustomInput
          v-model="form.account"
          v-bind="formColumn.account"
          @keyup.enter="login"
        >
          <template #prefix>
            <CustomIcon name="user"/>
          </template>
        </CustomInput>

        <CustomInput
          v-model="form.passowrd"
          v-bind="formColumn.passowrd"
          show-password
          @keyup.enter="login"
        >
          <template #prefix>
            <CustomIcon name="unlock-keyhole"/>
          </template>
        </CustomInput>

        <button class="login-button" @click="login">{{ i18nTranslate('login') }}</button>
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
