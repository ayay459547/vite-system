<script lang="ts">
import { h } from 'vue'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'

import { isEmpty, getUuid } from '@/lib/lib_utils'
import { object_filter } from '@/lib/lib_object'

import { version, props as qrCodeProps } from './SimpleQRcodeInfo'

export default {
  props: qrCodeProps,
  // emits: [],
  setup(props) {
    const scopedId = getUuid('__i-qrcode__')

    const qrProps = object_filter<any>(
      {
        text: props.text,
        bgSrc: props.bgSrc,
        logoSrc: props.logoSrc,
        size: props.size
      },
      (prop: any) => !isEmpty(prop)
    )

    const SimpleQRcode = () =>
      h(
        'div',
        {
          class: ['__qrcode-wrapper', `SimpleQRcode_${version}`, `${scopedId}`],
          style: {
            minWidth: `${props.size}px`,
            minHeight: `${props.size}px`
          }
        },
        [h(vueQr, { ...qrProps }, null)]
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
