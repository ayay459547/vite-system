<script setup lang="ts">
import { ref, inject } from 'vue'

import type { UseHook } from '@/declare/hook'
import { useFormSetting } from '@/lib/lib_columns'
import { isEmpty } from '@/lib/lib_utils'
import { CustomIcon, CustomInput, CustomImage } from '@/components'
import { defaultModuleType } from '@/i18n/i18n_setting'

import LogoImage from '@/assets/images/Vue-logo.png?url'
import { loginSystem } from './api'

const useHook: UseHook = inject('useHook')
const { i18nTranslate, swal } = useHook({
  i18nModule: defaultModuleType
})
const emit = defineEmits(['login'])

const isLoading = ref(false)

const login = ($event: MouseEvent | KeyboardEvent) => {
  // 移除 form 原有事件處理
  $event.preventDefault()

  validateForm()
    .then(async () => {
      const { account, password } = form

      isLoading.value = true

      const { status, msg, data: userId } = await loginSystem(account, password)
      if (status !== 'success') {
        swal({
          icon: 'error',
          title: i18nTranslate('error-getData', 'system'),
          text: msg ?? i18nTranslate('warning-contactIT', 'system'),
          showCancelButton: false
        })
      }

      if (!isEmpty(userId)) {
        emit('login', userId)
      }

      isLoading.value = false
    })
    .catch(() => {
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
  password: {
    label: '密碼',
    fitler: {
      default: 'admin',
      showPassword: true,
      required: true,
      placeholder: ''
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
  validate: validateForm
} = useFormSetting<Form>(columnSetting, 'fitler')

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
    element-loading-background="rgba(236, 245, 255, 0.8)"
    class="login-wrapper"
  >
    <img class="login-img-lg" src="@/assets/images/common/login-lg.svg" alt="login" />

    <div class="login-container">
      <div class="login-form">
        <img class="login-img-xs" src="@/assets/images/common/login-xs.svg" alt="login" />

        <div class="login-logo">
          <CustomImage :src="LogoImage" alt="vue" />
          <!-- <img src="@/assets/images/Vue-logo.png" alt="vue" /> -->
        </div>

        <CustomInput
          v-model="form.account"
          v-bind="formColumn.account"
          :label="i18nTranslate('account', defaultModuleType)"
          @keyup.enter="login"
        >
          <template #prefix>
            <CustomIcon name="user" />
          </template>
        </CustomInput>

        <form style="display: contents" @submit="login">
          <CustomInput
            v-model="form.password"
            v-bind="formColumn.password"
            :label="i18nTranslate('password', defaultModuleType)"
          >
            <template #prefix>
              <CustomIcon name="unlock-keyhole" />
            </template>
          </CustomInput>
        </form>

        <button class="login-button" @click="login">
          {{ i18nTranslate('login', defaultModuleType) }}
        </button>
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
    transform: translateX(50%);
    overflow: hidden;
    box-shadow: 2px 2px 8px 1px var(--i-color-login-container);

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
      background: linear-gradient(0deg, transparent, $gradient-color, $gradient-color);
      transform-origin: bottom right;
    }
    &::after {
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

    @media (max-height: 800px) {
      visibility: hidden;
    }
  }

  &-form {
    width: calc(100% - 6px);
    height: calc(100% - 6px);
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(165deg, var(--i-color-login-form-start), 65%, var(--i-color-login-form-end));
    padding: 36px;
    gap: 28px;
    position: absolute;
    top: 3px;
    left: 3px;
    z-index: 1;
    overflow: auto;

    @media (max-width: 992px) {
      padding: 24px 36px;
    }
  }

  &-logo {
    width: 140px;
    height: 140px;
    display: block;

    @media (max-width: 992px) {
      width: 120px;
    }

    @media (max-width: 576px) {
      width: 100px;
    }

    @media (max-height: 600px) {
      display: none;
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
  // var(--i-color-system-bg)
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
