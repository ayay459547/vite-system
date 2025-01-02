import { ref } from 'vue'

export const fake_useWebSocket = (url: string, options: any) => {
  console.log({ url, options })

  const status = ref('CLOSED')
  const data = ref({})

  status.value = 'CONNECTING'

  const open = () => {
    // 沒有排程且引擎從未排程：
    status.value = 'OPEN'
    data.value = JSON.stringify({
      isScheduling: false
    })

    // 排程中：
    setTimeout(() => {
      data.value = JSON.stringify({
        isScheduling: true,
        progressRate: 10,
        startTime: '2024-12-13 14:20:45',
        schedulingProgressTime: 1
      })
    }, 3000)
    setTimeout(() => {
      data.value = JSON.stringify({
        isScheduling: true,
        progressRate: 30,
        startTime: '2024-12-13 14:20:45',
        schedulingProgressTime: 2
      })
    }, 4000)
    setTimeout(() => {
      data.value = JSON.stringify({
        isScheduling: true,
        progressRate: 65,
        startTime: '2024-12-13 14:20:45',
        schedulingProgressTime: 3
      })
    }, 5000)
    setTimeout(() => {
      data.value = JSON.stringify({
        isScheduling: true,
        progressRate: 80,
        startTime: '2024-12-13 14:20:45',
        schedulingProgressTime: 4
      })
    }, 6000)
    setTimeout(() => {
      data.value = JSON.stringify({
        isScheduling: true,
        progressRate: 92,
        startTime: '2024-12-13 14:20:45',
        schedulingProgressTime: 5
      })
    }, 7000)

    // 沒有排程：
    setTimeout(() => {
      data.value = JSON.stringify({
        isScheduling: false,
        startTime: '2024-12-13 14:20:45',
        completeTime: '2024-12-13 14:21:10',
        schedulingProgressTime: 6
      })
    }, 8000)
  }

  const close = () => {}

  return { status, data, close, open }
}
