<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import GlobalView from '@/components/GlobalView.vue'
import { CustomTooltip, SimpleQRcode } from '@/components' // 系統組件

import logo from '@/assets/images/Vue-logo?url'
import qrcode from '@/assets/images/Vue-logo.png?url'
import menuLogo from'@/assets/images/Vue-logo.png?url'

export default defineComponent({
  name: 'AppView',
  components: {
    GlobalView,
    CustomTooltip,
    SimpleQRcode
  },
  setup() {
    const router = useRouter()
    const toHome = () => {
      router.push({ name: 'locatehome' })
    }

    return {
      toHome,
      bgimg: logo,
      qrcodeImg: qrcode,
      menuLogoImage: menuLogo
    }
  }
})
</script>

<template>
  <div class="app-container">
    <GlobalView>
      <template #logo="{ env }">
        <div class="menu-logo" @click="toHome">
          <img class="vue-img" src="@/assets/images/Vue-logo.png" alt="vue" />
          <h2 class="vue-text">{{ env.customer }}</h2>
        </div>
      </template>

      <template #version="{ env }">
        <CustomTooltip
          :width="200"
          trigger="click"
          placement="top-start"
          class="menu-footer-tip"
          popper-class="menu-footer-popper"
        >
          <template #content>
            <div class="tip-list">
              <h3 class="tip-item system">{{ env.system }}</h3>

              <SimpleQRcode text="https://vuejs.org/" :size="250" :logoSrc="qrcodeImg" />

              <span class="tip-item build-version">{{ env.buildVersion }}</span>
            </div>
          </template>
          <template #default>
            <div class="menu-footer">
              <div class="gear-img">
                <img src="@/assets/images/Vue-logo.png" alt="menu-logo" />
              </div>
              <div class="gear-ipasp flex-row align-center content-between">
                <span>{{ `${env.version}` }}</span>
              </div>
            </div>
          </template>
        </CustomTooltip>
      </template>
    </GlobalView>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .menu {
    &-logo {
      // width: 100%;
      min-width: fit-content;
      height: 58px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 16px;
      padding: 0 8px;
      cursor: pointer;

      .ipasp {
        &-img {
          width: 40px;
        }
        &-text {
          font-size: 1.6em;
          font-weight: 600;
          text-shadow: 2px 2px 4px #00000050;
        }
      }
    }

    &-footer {
      padding: 4px;
      border-radius: 6px;
      margin: 2px;
      transition-duration: 0.3s;
      width: fit-content;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 12px;
      font-size: 1.3em;
      font-weight: 600;

      &-tip {
        display: contents;
      }

      &:hover {
        color: #bbc5d3;
      }
    }
  }
}
.tip-ipasp {
  transition: 0.3s color;
  color: var(--i-color-menu);

  &:hover {
    color: var(--i-color-menu-hover);
  }
}
.gear {
  &-img {
    width: 52px;
    padding: 2px;
    border-radius: 8px;

    & > img {
      width: 100%;
      object-fit: cover;
    }
  }

  &-ipasp {
    gap: 80px;
  }
}

.tip-img {
  width: 32px;
  height: 32px;

  & > img {
    width: 100%;
    object-fit: cover;
  }
}

.tip {
  &-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    color: var(--el-text-color-primary);
    background-color: var(--el-bg-color);
    padding: 6px 0 12px;
    font-size: 1.5em;
    font-weight: 600;
  }
  &-item {
    display: flex;
    align-items: center;
    margin: 0 20px;

    &.system{
      width: 100%;
      text-align: center;
    }
    &.build-version {
      font-size: 0.7em;
      opacity: 0.5;
      display: inline-block;
      padding-top: 12px;
    }
  }
}

.locatehome {
  color: #535353;
  transition-duration: 0.3s;

  &:hover {
    color: #409eff;
  }
}
</style>

<style>
.menu-footer-popper {
  z-index: 10000 !important;
}
</style>