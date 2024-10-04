<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import GlobalView from '@/components/GlobalView.vue'
import { CustomTooltip, SimpleQRcode } from '@/components'

import qrcode from '@/assets/images/chan.jpg?url'

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
      qrcodeImg: qrcode
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
          <h2 class="vue-text">{{ env.system }}</h2>
        </div>
      </template>

      <template #version="{ env }">
        <CustomTooltip
          :width="200"
          trigger="hover"
          placement="top"
          class="menu-footer-tip"
          popper-class="menu-footer-popper"
        >
          <template #content>
            <div class="tip-list">
              <SimpleQRcode
                text="https://github.com/ayay459547/"
                :size="250"
                :logoSrc="qrcodeImg"
              />
            </div>
          </template>
          <template #default>
            <div class="menu-footer">
              <span>{{ `${env.system}` }}</span>
              <span>{{ `${env.version}` }}</span>
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
}

.menu {
  &-logo {
    width: fit-content;
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    padding: 0 8px;
    cursor: pointer;

    .vue {
      &-img {
        width: 40px;
      }
      &-text {
        font-size: 1.6em;
        font-weight: 600;
      }
    }
  }

  &-footer {
    color: #ddd;
    padding: 8px;
    border-radius: 6px;
    letter-spacing: 2px;
    display: flex;
    gap: 16px;
  }
}

.header {
  &-right {
    color: #535353;
    transition-duration: 0.3s;

    &:hover {
      color: #409eff;
    }
  }
}
</style>

<style>
.menu-footer-popper {
  z-index: 10000 !important;
}
</style>
