import type { App } from 'vue'
import { createApp } from 'vue'
// import debounce from '@/lib/lib_debounce'
import vClickOutside from 'click-outside-vue3'
import VFixed from '@/components/VFixed.vue'

const mouseenter = 'mouseenter'
const mouseleave = 'mouseleave'

export const vFixed = {
  // updated (el: Element, { value: options }) {
  //   el.addEventListener(mouseenter, createHandler.bind(el, options))
  //   el.addEventListener(mouseleave, removeHandler.bind(el, options))
  // },
  mounted (el: Element, { value: options }) {
    el.addEventListener(mouseenter, createHandler.bind(el, options))
    el.addEventListener(mouseleave, removeHandler.bind(el, options))
  },
  unmounted (el: Element, { value: options }) {
    el.removeEventListener(mouseenter, createHandler.bind(el, options))
    el.removeEventListener(mouseleave, removeHandler.bind(el, options))
  }
}

const fixedSet = new Set<{
  app: App,
  el: Element
}>()

type Options = {
  text: string
  style?: string | Record<string, any>
  class?: string | Record<string, any> | any[]
}
/**
 * 事件監聽事件
 * @param {Object} options
 *                 text: 文字內容
 *                 class: class 類型(string, object, array)
 *                 style: style 類型(string, object)
 */
function createHandler (this: Element, options: Options) {
  const clientRect = this.getBoundingClientRect()
  const {
    text,
    style: textStyle = '',
    class: textClass = ''
  } = options

  const newEl = document.createElement('div')
  this.appendChild(newEl)

  const app = createApp(VFixed, {
    elAttr: {
      left: clientRect.left,
      top: clientRect.top,
      width: clientRect.width,
      height: clientRect.height
    },
    options: {
      text,
      style: textStyle,
      class: textClass
    }
  })

  app.use(vClickOutside).mount(newEl)

  fixedSet.add({
    app,
    el: newEl
  })

}

function removeHandler (this: Element) {
  if (fixedSet.size > 0) {
    const tempSize = fixedSet.size

    // 隔一段時間如果都沒有要再用在清除
    setTimeout(() => {
      if (tempSize === fixedSet.size) {
        clearFixedApp()
      }
    }, 3000)
  }
}

const clearFixedApp = () => {
  fixedSet.forEach(element => {
    const { app, el } = element
    app.unmount()
    el.remove()
  })
  fixedSet.clear()
}