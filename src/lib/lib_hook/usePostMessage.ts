export type MessageData = {
  key: string // 定義傳遞何種事件的資料
  content: any // 事件傳遞的資料
}
export type OnGetMessage = (content: any) => any
/**
 * @description PostMessage 處理傳遞事件用的物件
 * @param key 事件鍵值，定義傳遞何種事件的資料，需要與外層協議
 * @param sendMessage 主動傳遞content給外層
 * @param waitMessage 開始監聽來自外層的事件傳遞，以callback處理傳遞的content
 * @param unwaitMessage 結束監聽事件傳遞
 */
export type MessageController = {
  key: string
  waitMessage: (callback: OnGetMessage) => void
  unwaitMessage: () => void
  sendMessage: (content?: any) => void
}

/**
 * @author Howard
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage
 * @description 以 PostMessage 與外層間傳遞資料
 * @param {String} key 與外層協定的事件鍵值
 * @returns {MessageController} MessageController 處理傳遞事件用的物件
 */
export const usePostMessage = (key: string): MessageController => {
  const mode = (import.meta as any).env.MODE
  const url = mode !== 'development' ? window.location.origin : 'http://localhost:8080'
  console.log('🥦 usePostMessage => ', { url })

  // 根據輸入的onGetMessage建立callback，提供給 add/removeEventListener 使用
  const createWaitCallback = (onGetMessage: OnGetMessage) => {
    const callback = (event: MessageEvent<MessageData>) => {
      if(event.origin !== url) return // 過濾錯誤來源的message
      if(event.data.key !== key) return // 忽略其他事件傳遞的資訊

      console.log('✅ getMessage =>', event.data?.content)
      onGetMessage(event.data?.content)
    }
    return callback
  }

  // 紀錄是否正在監聽，以及目前監聽使用的callback
  const waitInfo = {
    isWaiting: false,
    curWaitCallback: createWaitCallback(() => {})
  }
  // 開始監聽事件
  const waitMessage = (onGetMessage: OnGetMessage) => {
    if(waitInfo.isWaiting) unwaitMessage()
    waitInfo.isWaiting = true
    const newCallback = createWaitCallback(onGetMessage)
    waitInfo.curWaitCallback = newCallback

    console.log('✅ waitMessage =>', key)
    window.addEventListener('message', newCallback)
  }
  // 結束監聽事件
  const unwaitMessage = () => {
    if(!waitInfo.isWaiting) return
    waitInfo.isWaiting = false
    window.removeEventListener('message', waitInfo.curWaitCallback)
  }
  // 主動送出資料
  const sendMessage = (content?: any) => {
    const data = { key, content }
    console.log('✅ sendMessage => ', data)
    window.parent.postMessage(data, url)
  }

  // 將送出要求跟接收回傳資料封裝成一個 Promise, 開發中
  // const requestMessage = (onGetMessage: OnGetMessage, sendContent?: any) => {
  //   return new Promise(resolve => {
  //     const callback = (getContent) => {
  //       const result = onGetMessage(getContent)
  //       resolve(result)
  //     }
  //     setTimeout(() => {
  //       sendMessage({ message: 'getUserId' })
  //     }, 1000)
  //   })
  // }

  return {
    key,
    waitMessage,
    unwaitMessage,
    sendMessage
  }
}
