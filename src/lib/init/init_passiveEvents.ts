/**
 * 使用 addEventListener 綁定事件
 * 取消預設事件 passive = false 以優化效能
 * @see https://chromestatus.com/feature/5745543795965952
 *
 * 代碼參考
 * @see https://stackoverflow.com/questions/46094912/added-non-passive-event-listener-to-a-scroll-blocking-touchstart-event
 */
export const passiveEvents = function () {
  if (typeof EventTarget !== 'undefined') {
    const func = EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener = function (type, fn, capture) {
      (this as any).func = func
      if (typeof capture !== 'boolean') {
        capture = capture || {}
        capture.passive = false
      }
      (this as any).func(type, fn, capture)
    }
  }
}
passiveEvents()
