import type { App } from 'vue'
import { createApp } from 'vue'
// import debounce from '@/lib/lib_debounce.ts'
import vClickOutside from 'click-outside-vue3'
import VFixed from '@/components/VFixed.vue'
import type { Placement } from 'element-plus'
import { awaitTime } from '@/lib/lib_utils.ts'

const mouseenter = 'mouseenter'
const mouseleave = 'mouseleave'

export const vFixed = {
  // updated (el: Element, { value: options }) {
  //   el.addEventListener(mouseenter, createHandler.bind(el, options))
  //   el.addEventListener(mouseleave, removeHandler.bind(el, options))
  // },
  mounted(el: Element, { value: options }) {
    el.addEventListener(mouseenter, createHandler.bind(el, options))
    el.addEventListener(mouseleave, removeHandler.bind(el, options))
  },
  unmounted(el: Element, { value: options }) {
    el.removeEventListener(mouseenter, createHandler.bind(el, options))
    el.removeEventListener(mouseleave, removeHandler.bind(el, options))
  }
}

const fixedSet = new Set<{
  app: App
  vm: any
  el: Element
}>()

type Options = {
  content: string
  placement: Placement
  offset: number
  style?: string | Record<string, any>
  class?: string | Record<string, any> | any[]
}
/**
 * 事件監聽事件
 * @param {Object} options
 *  content: 文字
 *  placement 出現位置
 *  offset 偏移量
 *  class: class 類型(string, object, array)
 *  style: style 類型(string, object)
 */
function createHandler(this: Element, options: Options) {
  const {
    content = '',
    placement = 'top',
    offset = 6,
    style: elStyle = '',
    class: elClass = ''
  } = options

  const bodyEl = document.createElement('body')
  const fixedEl = document.createElement('div')
  bodyEl.appendChild(fixedEl)

  const app = createApp(VFixed, {
    content,
    placement,
    offset,
    el: this,
    elStyle,
    elClass
  })

  const vm = app.use(vClickOutside).mount(fixedEl)

  fixedSet.add({
    app,
    vm,
    el: fixedEl
  })
}

function removeHandler(this: Element) {
  if (fixedSet.size > 0) {
    const tempSize = fixedSet.size

    // 隔一段時間如果都沒有要再用在清除
    setTimeout(() => {
      if (tempSize === fixedSet.size) {
        clearFixedApp()
      }
    }, 500)
  }
}

const clearFixedApp = async () => {
  fixedSet.forEach(async element => {
    const { app, vm, el } = element
    vm.close()

    await awaitTime(300)
    app.unmount()
    el.remove()
  })
  fixedSet.clear()

  await awaitTime(500)
  const els = document.querySelectorAll('.__i_v-fixed__')
  if (els.length > 0) {
    els.forEach(el => {
      el.remove()
    })
  }
}
