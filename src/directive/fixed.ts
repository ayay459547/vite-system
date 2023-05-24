// import VFixed from '@/components/VFixed.vue'
import { createApp } from 'vue'
import vClickOutside from 'click-outside-vue3'
import VFixed from '@/components/feature/VFixed.vue'

const el = document.createElement('div')
el.style.display = 'none'
document.body.appendChild(el)

const app = createApp(VFixed)
app.use(vClickOutside)
app.mount(el)

/**
 * 事件監聽事件
 * @param {Object} options
 *                 text: 文字內容
 *                 textClass: class 類型(string, object, array)
 *                 textStyle: style 類型(string, object)
 */
export function handler (el: Element, options: {
  text: string
  textClass?: string | Record<string, any> | any[]
  textStyle?: string | Record<string, any>
}) {
  const clientRect = el.getBoundingClientRect()
  console.log(options)

  const pos = {
    left: clientRect.left,
    top: clientRect.top,
    width: clientRect.width,
    height: clientRect.height
  }
  console.log(pos)
  console.log('VFixed', VFixed)

  // const fixedApp = (app._component as any).data()
  const fixedApp = (app._component as any).methods
  fixedApp.open(
    {
      left: clientRect.left,
      top: clientRect.top,
      width: clientRect.width,
      height: clientRect.height
    },
    options
  )
}