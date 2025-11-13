<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import GlobalView from '@/components/GlobalView.vue'
import { CustomTooltip, SimpleQRcode } from '@/components/feature' // 系統組件: 功能

import logo from '@/assets/images/logo.png?url'
import qrcode from '@/assets/images/logo.png?url'
import menuLogo from'@/assets/images/logo.png?url'

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
          <img class="menu-img" src="@/assets/images/logo.png" alt="aat" />
          <span class="menu-text">{{ env.customer }}</span>
        </div>
      </template>

      <template #version="{ env }">
        <CustomTooltip
          :width="200"
          trigger="hover"
          placement="top-start"
          class="menu-footer-tip"
          popper-class="menu-footer-popper"
        >
          <template #content>
            <div class="tip-list">
              <SimpleQRcode text="https://vuejs.org/" :size="250" :logoSrc="qrcodeImg" />

              <span class="tip-item company">{{ env.company }}</span>
              <span class="tip-item phone">(TEL)+888-0-1111-2222</span>
              <span class="tip-item address">(000)XX市XX區XX路一段123號</span>

              <div class="tip-item footer">
                <span class="system">{{ env.system }}</span>
                <span class="build-version">{{ `( ${env.buildVersion} )` }}</span>
              </div>
            </div>
          </template>
          <template #default>
            <div class="menu-footer">
              <div class="gear-img">
                <img src="@/assets/images/logo.png" alt="demo" />
              </div>
              <div class="gear-system flex-row align-center content-between">
                <span>{{ env.version }}</span>
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

      .menu {
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
.tip-system {
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

  &-system {
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
    padding: 0 20px;

    &.footer {
      width: 100%;
      display: flex;
      align-items: flex-end;
      gap: 8px;
      padding-top: 12px;

      .system{
        font-size: 1em;
        opacity: 0.7;
      }
      .build-version {
        font-size: 0.7em;
        opacity: 0.5;
      }
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
