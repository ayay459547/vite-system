<script lang="ts">
import { type PropType, defineComponent } from 'vue'
import { mapStores } from 'pinia'

import type { Navigation } from '@/declare/routes'
import { CustomIcon, CustomButton, CustomTooltip } from '@/components'
import { useRoutesStore } from '@/stores/stores_routes'

export default defineComponent({
  name: 'FeatureTree',
  components: {
    CustomButton,
    CustomIcon,
    CustomTooltip
  },
  props: {
    tree: {
      type: Array as PropType<Navigation[]>,
      default() {
        return []
      }
    },
    level: {
      type: Number as PropType<number>,
      default: 1
    }
  },
  inject: ['search'],
  data() {
    return {
      // 當前節點
      isListOpen: {},
      // 子節點使用
      isOpen: false,
      bindStyle: {},
      baseHeight: 62
    }
  },
  computed: {
    routes({ tree }) {
      return tree
    },
    routesLength() {
      return this.getLength(this.routes)
    },
    searchText() {
      return (this.search as any).text ?? ''
    },
    ...mapStores(useRoutesStore)
  },
  methods: {
    // 判斷是否有子路由
    hasLeaves(route: Navigation) {
      return Object.prototype.hasOwnProperty.call(route, 'leaves')
    },
    // 取的總數計算高度
    getLength(routes: Navigation[]) {
      return routes.reduce((res: number, curr: Navigation) => {
        if (curr.leaves && curr.leaves.length > 0) {
          res += this.getLength(curr.leaves)
        }

        return res + 1
      }, 0)
    },
    // 選單縮放
    changeOpen(routeName: string) {
      const el = this.$refs[`feature-tree-${routeName}`]

      if (el) {
        this.isListOpen[routeName] = !this.isListOpen[routeName] ?? false
        el[0].changeOpenTree()
      }
    },
    changeOpenTree() {
      if (this.isOpen) {
        this.closeTree()
      } else {
        this.openTree()
      }
    },
    openTree() {
      const el = this.$refs.currentRef

      if (el) {
        this.isOpen = true
        const height = this.routesLength * this.baseHeight
        this.bindStyle = {
          'max-height': `${height}px`
        }
      }
    },
    closeTree() {
      const el = this.$refs.currentRef

      if (el) {
        this.isOpen = false
        this.bindStyle = {
          'max-height': '0px'
        }
      }
    },
    newWindow(route: Navigation): void {
      const routeData = this.$router.resolve({
        name: route.name,
        query: { isModal: 'true' }
      })
      window.open(
        routeData.href,
        route.title,
        `
          toolbar=no,
          menubar=no,
          width=1200,
          height=800,
          left=80,
          top=80
        `
      )
    },
    newPage(route: Navigation): void {
      const routeData = this.$router.resolve({
        name: route.name
      })
      window.open(routeData.href, '_blank')
    },
    // 搜尋
    isMatch(title: string): boolean {
      if (this.searchText.length > 0) {
        const regexp = new RegExp(this.searchText)

        return regexp.test(title)
      }
      return false
    }
  },
  created() {},
  mounted() {
    this.routes.forEach((route: Navigation) => {
      this.changeOpen(route.name)
    })
  }
})
</script>

<template>
  <ul ref="currentRef" :class="['tree-list', `level-${level}`]" :style="bindStyle">
    <li v-for="route in routes" :key="route.name" class="tree-item">
      <div
        :class="['tree-item-block', `level-${level}`, isMatch(route.title) ? '__match' : '']"
        @click="changeOpen(route.name)"
      >
        <div class="tree-item-title">
          <div :class="['tree-item-icon', isListOpen[route.name] ? 'is-open' : 'is-close']">
            <CustomIcon v-if="hasLeaves(route)" name="caret-right" />
          </div>
          <span>{{ route.title }}</span>
        </div>

        <div v-if="!hasLeaves(route)" class="tree-item-operations-lg">
          <CustomButton label="另開視窗" icon-name="window-restore" @click="newWindow(route)" />
          <CustomButton label="新開分頁" icon-name="up-right-from-square" @click="newPage(route)" />
        </div>

        <div v-if="!hasLeaves(route)" class="tree-item-operations-xs">
          <CustomTooltip>
            <CustomButton icon-name="plus" />
            <template #content>
              <span>{{ '新增選項' }}</span>
            </template>
          </CustomTooltip>

          <CustomTooltip>
            <CustomButton icon-name="window-restore" @click="newWindow(route)" />
            <template #content>
              <span>{{ '另開視窗' }}</span>
            </template>
          </CustomTooltip>

          <CustomTooltip>
            <CustomButton icon-name="up-right-from-square" @click="newPage(route)" />
            <template #content>
              <span>{{ '新開分頁' }}</span>
            </template>
          </CustomTooltip>
        </div>
      </div>

      <template v-if="hasLeaves(route)">
        <FeatureTree :ref="`feature-tree-${route.name}`" :tree="route.leaves" :level="level + 1" />
      </template>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
$base-left: 24px;

.tree {
  &-list {
    width: 100%;
    height: fit-content;
    transition-duration: 0.3s;
    overflow: hidden;
    cursor: default;
  }

  &-item {
    &-block {
      padding: 12px;
      background-color: var(--el-bg-color);
      display: flex;
      justify-content: space-between;
      transition-duration: 0.2s;
      &.level-1 {
        padding-left: $base-left;
      }
      &.level-2 {
        padding-left: calc($base-left + 24px);
      }
      &.level-3 {
        padding-left: calc($base-left + 48px);
      }

      &:hover {
        background-color: #ebeef5;
      }
      &.__match {
        background-color: var(--el-color-warning-light-7);

        &:hover {
          background-color: var(--el-color-warning-light-8);
        }
      }
    }

    &-icon {
      width: 24px;
      height: 24px;
      color: #324157;
      transition-duration: 0.3s;
      @extend %flex-center;
      &.is-open {
        transform: rotateZ(90deg);
      }
      &.is-close {
        transform: rotateZ(0deg);
      }
    }

    &-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    &-operations {
      &-lg {
        display: flex;
        gap: 12px;
      }
      &-xs {
        display: none;
        gap: 12px;
      }
      @media (max-width: 992px) {
        &-lg {
          display: none;
        }
        &-xs {
          display: flex;
        }
      }
    }
    width: 100%;
  }
}
</style>
