<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import type { Placement } from 'element-plus'
import { ElTooltip } from 'element-plus'

export default defineComponent({
  name: 'vFixed',
  components: {
    ElTooltip
  },
  props: {
    content: {
      type: String as PropType<string>,
      required: false,
      default: '',
      description: '文字'
    },
    placement: {
      type: String as PropType<Placement>,
      required: false,
      default: 'top',
      description: '出現位置'
    },
    offset: {
      type: Number as PropType<number>,
      required: false,
      default: 6,
      description: '偏移量'
    },
    el: {
      type: Object as PropType<Element>,
      required: false,
      default() {
        return document.querySelector('body > div')
      },
      description: 'hover Element'
    },
    elStyle: {
      type: [String, Object] as PropType<string | Record<string, any>>,
      required: false,
      default: '',
      description: 'style'
    },
    elClass: {
      type: [String, Object, Array] as PropType<string | Record<string, any> | any[]>,
      required: false,
      default: '',
      description: 'class'
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  computed: {
    virtualTriggering ({ el }) {
      const elType = Object.prototype.toString.call(el)
      return elType === '[object HTMLDivElement]'
    },
    isVisible: {
      get () {
        return this.isShow
      },
      set (v: boolean) {
        this.isShow = v
      }
    }
  },
  methods: {
    open() {
      this.isShow = true
    },
    close() {
      this.isShow = false
    }
  },
  mounted() {
    this.open()
  },
  unmounted() {
    this.close()
  }
})
</script>

<template>
  <div class="__i_v-fixed__ v-fixed">
    <ElTooltip
      ref="tooltipRef"
      v-model:visible="isVisible"
      :placement="placement"
      :offset="6"
      :effect="'light'"
      :show-after="200"
      :persistent="false"
      :virtual-ref="el"
      :virtual-triggering="virtualTriggering"
    >
      <div></div>
      <template #content>
        <div :style="elStyle" :class="elClass">
          <span class="v-fixed-content">{{ content }}</span>
        </div>
      </template>
    </ElTooltip>
  </div>
</template>

<style lang="scss" scoped>
.v-fixed {
  width: fit-content;

  &-content {
    font-size: 1.3em;
  }
}
</style>
