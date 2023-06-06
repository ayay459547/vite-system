// 去除 chrome 的touch事件警告
// https://stackoverflow.com/questions/46094912/added-non-passive-event-listener-to-a-scroll-blocking-touchstart-event

(function () {
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
  };
}())