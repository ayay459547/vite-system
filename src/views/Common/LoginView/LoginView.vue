<script setup lang="ts">
import { ref, inject } from 'vue'
import { ElForm } from 'element-plus'

import type { UseHook } from '@/types/types_hook' // 全域功能類型
import { useFormSetting } from '@/lib/lib_columns'
import { isEmpty } from '@/lib/lib_utils' // 工具
import { CustomIcon, CustomImage } from '@/components/feature' // 系統組件
import { CustomInput } from '@/components/input' // 系統組件輸入
import { defaultModuleType } from '@/declare/declare_i18n'

import LogoImage from '@/assets/images/logo.png?url'
import { loginSystem } from './api'

const useHook = inject('useHook') as UseHook
const { i18nTranslate, swal } = useHook({
  i18nModule: defaultModuleType
})

const emit = defineEmits(['login'])

const isLoading = ref(false)

const userLogin = ($event: Event) => {
  // 移除 form 原有事件處理
  // console.log('userLogin', $event)
  $event.preventDefault()

  validateForm().then(async () => {
    const { account, password } = form

    isLoading.value = true

    const { status, msg, data: userId } = await loginSystem(account, password)
    if (status !== 'success') {
      swal({
        icon: 'error',
        title: i18nTranslate('error-getData', defaultModuleType),
        text: msg ?? i18nTranslate('warning-contactIT', defaultModuleType),
        showCancelButton: false
      })
    }

    if (!isEmpty(userId)) {
      emit('login', userId)
    }

    isLoading.value = false
  }).catch(() => {
    isLoading.value = false
  })
}

const columnSetting = {
  account: {
    label: '帳號',
    i18nLabel: 'input-account',
    fitler: {
      type: 'text',
      default: 'admin',
      required: true
    }
  },
  password: {
    label: '密碼',
    i18nLabel: 'input-password',
    fitler: {
      // type: 'password',
      showPassword: true,
      default: '',
      required: false
    }
  }
}

interface Form {
  account: string
  password: string
}

const {
  columns: formColumn,
  forms: form,
  validate: validateForm,
  reset: resetForm
} = useFormSetting<Form>(columnSetting, 'fitler')
</script>

<template>
  <div
    v-loading="isLoading"
    element-loading-text="Loading..."
    element-loading-background="rgba(236, 245, 255, 0.8)"
    class="login-wrapper"
  >
    <div class="login-container">
      <div class="login-container-before"></div>
      <div class="login-container-after"></div>
      <div class="login-form">
        <div class="login-logo">
          <CustomImage :src="LogoImage" alt="demo" />
        </div>

        <ElForm
          class="fill-x flex-column i-ga-xl"
          autocomplete="on"
          @submit.prevent="userLogin"
        >
          <CustomInput
            v-model="form.account"
            v-bind="formColumn.account"
            :label="i18nTranslate('input-account', defaultModuleType)"
            name="username"
            autocomplete="username"
            @keyup.enter="userLogin"
            @clear="resetForm"
          >
            <template #prefix>
              <CustomIcon name="user" />
            </template>
          </CustomInput>

          <CustomInput
            v-model="form.password"
            v-bind="formColumn.password"
            :label="i18nTranslate('input-password', defaultModuleType)"
            name="password"
            autocomplete="current-password"
            @keyup.enter="userLogin"
            @clear="resetForm"
          >
            <template #prefix>
              <CustomIcon name="unlock-keyhole" />
            </template>
          </CustomInput>

          <button
            native-type="submit"
            class="login-button"
            type="submit"
            @click="userLogin"
          >
            {{ i18nTranslate('login', defaultModuleType) }}
          </button>
        </ElForm>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$gradient-color: var(--i-color-login-move);

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
    z-index: var(--i-z-index-login);
    background-color: var(--i-color-login-wrapper);
    @extend %flex-center;
  }

  &-container {
    width: 40%;
    height: 80%;
    border-radius: 6px;
    transition-duration: 0.3s;
    position: relative;
    overflow: hidden;
    box-shadow: 2px 2px 8px 1px var(--i-color-login-container);

    @media (max-width: 1200px) {
      width: 50%;
    }
    @media (max-width: 992px) {
      width: 70%;
    }

    @media (max-height: 600px) {
      height: 90%;
    }
    @media (max-width: 576px) {
      width: 99%;
      height: 99%;
    }

    &-before,
    &-after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      animation: animate 6s linear infinite;
    }
    &-before {
      top: -50%;
      left: -50%;
      background: linear-gradient(0deg, transparent, $gradient-color, $gradient-color);
      transform-origin: bottom right;
    }
    &-after {
      top: 50%;
      left: 50%;
      background: linear-gradient(180deg, transparent, $gradient-color, $gradient-color);
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

  &-form {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(165deg, var(--i-color-login-form-start), 65%, var(--i-color-login-form-end));
    padding: 36px;
    gap: 28px;
    position: absolute;
    top: 2px;
    left: 2px;
    z-index: 1;
    overflow: auto;

    @media (max-width: 992px) {
      padding: 24px 36px;
    }

    @media (max-height: 600px) {
      gap: 12px;
    }
  }

  &-logo {
    width: 160px;
    height: 120px;
    display: block;

    @media (max-width: 992px) {
      width: 120px;
    }

    @media (max-width: 576px) {
      width: 100px;
    }

    & > img {
      object-fit: cover;
      width: 100%;
    }
  }

  &-button {
    width: 100%;
    padding: 16px;
    border: none;
    background-color: var(--i-color-login-button);
    color: inherit;
    border-radius: 6px;
    transition-duration: 0.3s;
    cursor: pointer;

    &:hover {
      background-color: var(--i-color-login-button-hover);
    }
  }
}
</style>

<style lang="scss">
@use '@/assets/styles/utils' as utils;

$light-color: (
  'login-wrapper': #ecf5ff,
  'login-container': #a6d2ff,
  'login-form-start': #d9ecff,
  'login-form-end': #e5f2ff,
  'login-move': #79bbff,
  'login-button': #79bbff,
  'login-button-hover': #a0cfff
);

$dark-color: (
  'login-wrapper': #646464,
  'login-container': #9f9f9f,
  'login-form-start': #000000,
  'login-form-end': #9f9f9f,
  'login-move': #adadad,
  'login-button': #808080,
  'login-button-hover': #6c6c6c
);

@mixin set-css-vars($color-map) {
  // var(--i-color-login-wrapper)
  @each $type, $color in $color-map {
    @include utils.set-css-var-value(('color', $type), $color);
  }
}

// 顏色設定
html {
  @include set-css-vars($light-color);
}
html.dark {
  @include set-css-vars($dark-color);
}
</style>
