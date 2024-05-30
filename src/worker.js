// import { checkInitIdb } from '@/lib/lib_idb'

self.addEventListener('message', async function (e) {
  const postMsg = e.data

  switch(postMsg) {
    case 'idb':
      console.log('[workder]', postMsg)
      break
    default:
      console.log('[workder]', 'none')
      break
  }
  // const storeList = await checkInitIdb()
  // console.log('[workder]', storeList)
  self.postMessage('close')
}, false)

