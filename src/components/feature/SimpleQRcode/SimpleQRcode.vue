<script lang="ts">
import { h, defineComponent } from 'vue'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'

import { isEmpty, getUuid } from '@/lib/lib_utils'
import { object_filter } from '@/lib/lib_object'

import { version, props as qrCodeProps } from './SimpleQRcodeInfo'

export default defineComponent({
  name: 'SimpleQRcode',
  props: qrCodeProps,
  // emits: [],
  setup(props) {
    const scopedId = getUuid(version)

    const qrProps = object_filter<any>({
        text: props.text,
        bgSrc: props.bgSrc,
        logoSrc: props.logoSrc,
        size: props.size
      }, (prop: any) => !isEmpty(prop))

    const SimpleQRcode = () => {
      return h(
        'div',
        {
          class: ['qrcode-wrapper', scopedId],
          style: {
            minWidth: `${props.size}px`,
            minHeight: `${props.size}px`
          }
        },
        [h(vueQr, { ...qrProps }, null)]
      )
    }

    return SimpleQRcode
  }
})
</script>

<style lang="scss">
div[class*="__SimpleQRcode"].qrcode {
  &-wrapper {
    width: fit-content;
    height: fit-content;
  }
}
</style>
