<script lang="ts">
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import type { PropType } from 'vue'
import { h } from 'vue'

export default {
  props: {
    url: {
      type: String as PropType<string>,
      required: true,
      description: 'url'
    },
    width: {
      type: String as PropType<string>,
      required: false,
      default: '200px',
      description: 'style width'
    },
    hieght: {
      type: String as PropType<string>,
      required: false,
      default: '200px',
      description: 'style hieght'
    },
    bgSrc: {
      type: String as PropType<string>,
      required: false,
      description: '背景圖片 src'
    },
    logoSrc: {
      type: String as PropType<string>,
      required: false,
      description: '中心logo src'
    }
  },
  // emits: [],
  setup (props) {
    return () => h(
      'div',
      {
        class: '__qrcode',
        style: {
          minWith: props.width,
          minHieght: props.hieght
        }
      },
      [
        h(vueQr, {
          text: props.url,
          bgSrc: props.bgSrc,
          logoSrc: props.logoSrc
        }, null)
      ]
    )
  }
}

</script>

<style lang="scss">
.__qrcode {
  width: fit-content;
  height: fit-content;
}
</style>