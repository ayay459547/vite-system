// import VFixed from '@/components/VFixed.vue'
import { createApp } from 'vue'
import vClickOutside from 'click-outside-vue3'
import VFixed from '@/components/feature/VFixed.vue'

const fixedMap = new Map()
/**
 * 事件監聽事件
 * @param {Object} options
 *                 text: 文字內容
 *                 textClass: class 類型(string, object, array)
 *                 textStyle: style 類型(string, object)
 */
export function createhandler (this: Element, options: {
  text: string
  textClass?: string | Record<string, any> | any[]
  textStyle?: string | Record<string, any>
}) {
  const clientRect = this.getBoundingClientRect()

  const newEl = document.createElement('div')
  this.appendChild(newEl)

  const app = createApp(VFixed, {
    elAttr: {
      left: clientRect.left,
      top: clientRect.top,
      width: clientRect.width,
      height: clientRect.height
    },
    options
  })

  app.use(vClickOutside).mount(newEl)

  fixedMap.set(this, {
    app,
    el: newEl
  })
}

export function removehandler (this: Element) {
  const { app, el } = fixedMap.get(this)
  app.unmount()
  el.remove()

  fixedMap.delete(this)
}