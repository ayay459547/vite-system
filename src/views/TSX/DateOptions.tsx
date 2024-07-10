import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DateOptions',
  // props: {}
  // emits: []
  // props, ctx
  setup() {
    const minList = [
      { min: 5, text: '5分鐘'},
      { min: 30, text: '30分鐘'}
    ]

    // 1-23 小時
    const hourList = []
    for(let i = 1; i < 24; i++) {
      hourList.push({
        min: i * 60,
        text: `${i}小時`
      })
    }

    // 1-30 天
    const dayList = []
    for(let i = 1; i <= 30; i++) {
      dayList.push({
        min: i * 60 * 24,
        text: `${i}天`
      })
    }

    const menuList = [
      ...minList,
      ...hourList,
      ...dayList
    ]

    return () => (
      <div class={'border-info flex-column i-pa-md i-ga-xs'}>
        {
          menuList.map(menuItem => {
            const { min, text } = menuItem
            return <div>{ `${min} => ${text}` }</div>
          })
        }
      </div>
    )
  }
})