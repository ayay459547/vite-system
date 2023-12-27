<script lang="ts">
import { type PropType, h } from 'vue'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'

import { isEmpty, getUuid } from '@/lib/lib_utils'

export default {
  props: {
    text: {
      type: String as PropType<string>,
      required: true,
      description: 'text'
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
      default: null,
      description: '背景圖片 src'
    },
    logoSrc: {
      type: String as PropType<string>,
      required: false,
      default: null,
      description: '中心logo src'
    }
  },
  // emits: [],
  setup (props) {
    const scopedId = getUuid('__i-qrcode__')

    const qrProps = ({
      text: props.text,
      bgSrc: props.bgSrc,
      logoSrc: props.logoSrc
    } as any).$filter(prop => !isEmpty(prop))

    const SimpleQRcode = () => h(
      'div',
      {
        class: `__i-qrcode__ ${scopedId}`,
        style: {
          minWith: props.width,
          minHieght: props.hieght
        }
      },
      [
        h(vueQr, { ...qrProps }, null)
      ]
    )

    return SimpleQRcode
  }
}

</script>

<style lang="scss">
.__i-qrcode__ {
  width: fit-content;
  height: fit-content;
}
</style>
