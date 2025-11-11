import { isEmpty } from '@/lib/lib_utils' // 工具

const list = [
  { value: 'vue', link: 'https://github.com/vuejs/vue' },
  { value: 'element', link: 'https://github.com/ElemeFE/element' },
  { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
  { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
  { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
  { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
  { value: 'babel', link: 'https://github.com/babel/babel' }
]

const isRequired = true

export const columnSetting = {
  input: {
    label: '輸入',
    filter: { type: 'text', default: '有預設', required: isRequired }
  },
  number: {
    label: '輸入數字',
    filter: { type: 'number', default: '', required: isRequired }
  },
  autocomplete: {
    label: '搜尋',
    filter: {
      type: 'autocomplete', default: '', required: isRequired,
      fetchSuggestions: (queryString: string, cb: (data: any[]) => void) => {
        if (isEmpty(queryString)) {
          cb(list)
          return
        }

        const regexp = new RegExp(queryString)
        const results = list.filter(item => {
          return regexp.test(`${item.value}${item.link}`)
        })

        cb(results)
      }
    }
  },
  operator: {
    label: '條件',
    filter: {
      type: 'operator', default: ['', null],
      operatorType: 'number',
      options: [
        { label: '=', value: 'equal' },
        { label: '>=', value: 'greatthan' },
        { label: '<=', value: 'lessthan' }
      ],
      required: isRequired
    }
  },
  passowrd: {
    label: '密碼',
    filter: { type: 'password', default: null, validate: ['password'], required: isRequired }
  },
  phone: {
    label: '手機',
    filter: { type: 'text', default: null, validate: ['phone'], required: false }
  },
  date: {
    label: '選擇日期',
    filter: { type: 'date', default: null, required: isRequired
    }
  },
  daterange: {
    label: '選擇日期區間',
    filter: { type: 'daterange', default: [], required: isRequired }
  },
  time: {
    label: '選擇時間',
    filter: { type: 'time', default: '', required: isRequired }
  },
  timerange: {
    label: '選擇時間區間',
    filter: { type: 'timerange', default: ['', ''], required: isRequired }
  },
  select: {
    label: '選擇框',
    filter: {
      type: 'select', default: undefined, required: isRequired,
      options: new Array(20).fill('value').map((value, index) => {
        return {
          label: `${value}-${index}`,
          value: `options-${index}`,
          options: (index % 3 === 0) ? new Array(5).fill('value').map((value, index) => {
            return { label: `sub-${value}-${index}`, value: `sub-options-${index}` }
          }) : []
        }
      })
    }
  },
  selectv2: {
    label: '選擇框v2',
    filter: {
      type: 'select-v2', default: '', required: isRequired,
      options: new Array(20).fill('value').map((value, index) => {
        return {
          label: `${value}-${index}`,
          value: `options-${index}`,
          options: (index % 3 === 0) ? new Array(5).fill('value').map((value, index) => {
            return { label: `sub-${value}-${index}`, value: `sub-options-${index}` }
          }) : []
        }
      })
    }
  },
  selectTree: {
    label: '選擇框Tree',
    filter: {
      type: 'select-tree', default: '', required: isRequired,
      options: new Array(20).fill('value').map((value, index) => {
        return {
          label: `${value}-${index}`,
          value: `options-${index}`,
          options: (index % 3 === 0) ? new Array(5).fill('value').map((value, index) => {
            return { label: `sub-${value}-${index}`, value: `sub-options-${index}` }
          }) : []
        }
      })
    }
  },
  checkbox: {
    label: '單選',
    filter: { type: 'checkbox', default: false, required: isRequired, options: [] }
  },
  checkboxMultiple: {
    label: '多選',
    filter: {
      type: 'checkbox', default: [], required: isRequired,
      options: [
        { label: 'checkbox1', value: '0' },
        { label: 'checkbox2', value: '1' },
        { label: 'checkbox3', value: '2' },
        { label: 'checkbox4', value: '3' }
      ]
    }
  },
  radio: {
    label: '單選',
    filter: {
      type: 'radio', default: null, required: isRequired,
      options: [
        { label: 'radio1', value: '0', border: true },
        { label: 'radio2', value: '1', border: true },
        { label: 'radio3', value: '2', border: false }
      ]
    }
  }
}
