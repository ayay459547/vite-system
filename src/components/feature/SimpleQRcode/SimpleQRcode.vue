<script lang="ts">
import { h } from 'vue'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'

import { isEmpty, getUuid } from '@/lib/lib_utils'

import {
  version,
  props as qrCodeProps
} from './SimpleQRcodeInfo'

export default {
  props: qrCodeProps,
  // emits: [],
  setup (props) {
    const scopedId = getUuid('__i-qrcode__')

    const qrProps = ({
      text: props.text,
      bgSrc: props.bgSrc,
      logoSrc: props.logoSrc
    } as any).$filter((prop: any) => !isEmpty(prop))

    const SimpleQRcode = () => h(
      'div',
      {
        class: [
          '__qrcode-wrapper',
          `SimpleQRcode_${version}`,
          `${scopedId}`
        ],
        style: {
          minWith: props.width,
          minHeight: props.height
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
.__qrcode {
  &-wrapper {
    width: fit-content;
    height: fit-content;
  }
}
</style>
