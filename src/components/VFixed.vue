<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'

import throttle from '@/lib/lib_throttle'
import debounce from '@/lib/lib_debounce'

export interface ElAttr {
  left?: number
  top?: number
  width?: number
  height?: number
}

export interface Options {
  text?: string
  class?: string | Record<string, any> | any[]
  style?: string | Record<string, any>
}

export default defineComponent({
  name: 'vFixed',
  props: {
    elAttr: {
      typs: Object as PropType<ElAttr>,
      default () {
        return {
          left: 0,
          top: 0,
          width: 0,
          height: 0
        }
      }
    },
    options: {
      typs: Object as PropType<Options>,
      default () {
        return {
          text: '',
          class: '',
          style: ''
        }
      }
    }
  },
  data () {
    return {
      timer: null,
      isShow: false,
      elRect: { left: 0, top: 0, width: 0, height: 0 },
      mousePos: { left: 0, top: 0 },
      throttleOnWheelChange: throttle(this.close, 150, { isNoLeading: true }) as (payload: WheelEvent) => void,
      // eslint-disable-next-line no-undef
      debounceSetMousePos: debounce(this.setMousePos, 100) as EventListenerOrEventListenerObject
    }
  },
  computed: {
    bindStyle ({ elAttr, options }) {
      const { left, top, width, height } = elAttr
      const { style } = options
      const padding = 6

      if (typeof style === 'object') {
        return {
          ...style,
          left: `${left - padding}px`,
          top: `${top - padding + 2}px`,
          width: `${padding * 2 + width}px`,
          height: `${padding + height}px`
        }
      } else {
        return `
          left: ${left - padding}px;
          top: ${top - padding + 2}px;
          width: ${padding * 2 + width}px;
          height: ${padding + height}px;
        ` + style
      }
    }
  },
  methods: {
    open () {
      this.isShow = true
      this.openTimer()
    },
    close () {
      this.isShow = false
      this.mousePos.left = 0
      this.mousePos.top = 0
      this.closeTimer()
    },
    // 滑鼠超出範圍 關閉fixed
    setMousePos (e: MouseEvent) {
      this.mousePos.left = e.clientX
      this.mousePos.top = e.clientY
    },
    openTimer (tolerance = 10) {
      this.timer = setInterval(() => {
        const { left, top, width, height } = this.elRect
        const { left: mouseLeft, top: mouseTop} = this.mousePos

        if (
          mouseLeft + tolerance < left ||
          mouseLeft > left + width + tolerance ||
          mouseTop + tolerance < top ||
          mouseTop > top + height + tolerance
        ) {
          this.close()
        }
      }, 480)
    },
    closeTimer () {
      clearInterval(this.timer)
    }
  },
  mounted () {
    this.open()
    window.addEventListener('mousemove', this.debounceSetMousePos)

    setTimeout(() => {
      const tempEl = this.$refs.fixed as Element | null
      if (tempEl) {
        const clientRect = tempEl.getBoundingClientRect()
        this.elRect.left = clientRect.left
        this.elRect.top = clientRect.top
        this.elRect.width = clientRect.width
        this.elRect.height = clientRect.height
      }
    }, 100)
  },
  unmounted () {
    window.removeEventListener('mousemove', this.debounceSetMousePos)
  }
})
</script>

<template>
  <Transition name="fixed">
    <div
      v-show="isShow"
      ref="fixed"
      class="fixed-wrapper"
      :class="options.class"
      :style="bindStyle"
      @wheel="throttleOnWheelChange"
    >
      <span class="fixed-text">{{ options.text }}</span>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.fixed {
  &-wrapper {
    width: fit-content;
    height: fit-content;
    color: #fff;
    background-color: lighten($system-bg-color, 5%);
    border-radius: 6px;
    padding: 0px 8px;
    cursor: default;
    position: fixed;
    z-index: var(--i-z-index-v-fixed);
    white-space: nowrap;
    min-width: fit-content;
    // pointer-events: none;
    @extend %flex-center;
  }
}
</style>
