
import { initials } from './fakeData'

export const columnSetting = {
  select: {
    label: '選擇框',
    filter: {
      type: 'select',
      default: null,
      required: true,
      options: initials.flatMap(item => {
        return Array.from({ length: 10 }).map((_, idx) => ({
          value: `Option ${idx + 1 + 10} ${item}`,
          label: `${initials[idx % 10]}${idx + 1 + 10} ${item}`
        }))
      })
    }
  },
  selectV2: {
    label: '選擇框V2',
    filter: {
      type: 'select-v2',
      default: null,
      required: true,
      options: initials.flatMap(item => {
        return Array.from({ length: 1000 }).map((_, idx) => ({
          value: `Option ${idx + 1 + 10} ${item}`,
          label: `${initials[idx % 10]}${idx + 1 + 10} ${item}`
        }))
      })
    }
  }
}