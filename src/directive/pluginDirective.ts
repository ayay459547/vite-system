import type { App } from 'vue'

// element plus
import { vLoading } from 'element-plus'

// vue use
import {
  // vIntersectionObserver,
  // vResizeObserver,
  // vOnLongPress,
  // vInfiniteScroll,
  // vScrollLock,
  // vScroll,

  vOnClickOutside,
  vElementSize,
  vElementVisibility,
  vOnKeyStroke,
  vElementHover
} from '@vueuse/components'

// 文字懸浮
import { vFixed } from './fixed'

/**
 * @description 自訂模板語法
 * @see https://vuejs.org/guide/reusability/custom-directives
 */

const pluginDirective = {
  install(app: App): void {
    // https://element-plus.org/en-US/component/loading.html#loading
    app.directive('loading', vLoading)

    // https://vueuse.org/core/useIntersectionObserver/#directive-usage
    // app.directive('intersection-observer', vIntersectionObserver)
    // https://vueuse.org/core/useResizeObserver/#directive-usage
    // app.directive('resize-observer', vResizeObserver)
    // https://vueuse.org/core/onLongPress/#directive-usage
    // app.directive('on-long-press', vOnLongPress)
    // https://vueuse.org/core/useInfiniteScroll/#directive-usage
    // app.directive('infinite-scroll', vInfiniteScroll)
    // https://vueuse.org/core/useScrollLock/#directive-usage
    // app.directive('scroll-lock', vScrollLock)
    // https://vueuse.org/core/useScroll/#directive-usage
    // app.directive('scroll', vScroll)

    // https://vueuse.org/core/onClickOutside/#directive-usage
    app.directive('on-click-outside', vOnClickOutside)
    // https://vueuse.org/core/useElementSize/#directive-usage
    app.directive('element-size', vElementSize)
    // https://vueuse.org/core/useElementVisibility/#directive-usage
    app.directive('element-visibility', vElementVisibility)
    // https://vueuse.org/core/onKeyStroke/#directive-usage
    app.directive('on-key-stroke', vOnKeyStroke)
    // https://vueuse.org/core/useElementHover/#directive-usage
    app.directive('element-hover', vElementHover)

    app.directive('fixed', vFixed)
  }
}

export default pluginDirective
