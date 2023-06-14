import { createApp } from 'vue'
import debounce from '@/lib/debounce'
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
export function createHandler (this: Element, options: {
  text: string
  class?: string | Record<string, any> | any[]
  style?: string | Record<string, any>
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
  console.log(fixedMap)

  if (!fixedMap.has(this)) {
    fixedMap.set(this, {
      app,
      el: newEl
    })
  }
}

export const debounceCreateHandler = debounce(createHandler, 100)

export function removeHandler (this: Element) {
  const temp = fixedMap.get(this)

  if (temp) {
    const { app, el } = temp
    app.unmount()
    el.remove()

    fixedMap.delete(this)
  }

}