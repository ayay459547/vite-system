export const columnSetting = {
  machine_Id: {
    label: '機台編號',
    i18nLabel: 'machine-id',
    table: {
      minWidth: 200,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null
    }
  },
  dayOfWeek: {
    label: '星期',
    i18nLabel: 'dayOfWeek',
    table: {
      minWidth: 200,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      type: 'select',
      default: '',
      i18nModule: 'system',
      options: [
        { i18nLabel: 'all', label: '全部', value: '' },
        { i18nLabel: 'sunday-abbreviation', label: '日', value: '7' },
        { i18nLabel: 'monday-abbreviation', label: '一', value: '1' },
        { i18nLabel: 'tuesday-abbreviation', label: '二', value: '2' },
        { i18nLabel: 'wednesday-abbreviation', label: '三', value: '3' },
        { i18nLabel: 'thursday-abbreviation', label: '四', value: '4' },
        { i18nLabel: 'friday-abbreviation', label: '五', value: '5' },
        { i18nLabel: 'saturday-abbreviation', label: '六', value: '6' }
      ]
    },
    getValue(data: number | string): string {
      switch (`${data}`) {
        case '7':
          return 'sunday-abbreviation'
        case '1':
          return 'monday-abbreviation'
        case '2':
          return 'tuesday-abbreviation'
        case '3':
          return 'wednesday-abbreviation'
        case '4':
          return 'thursday-abbreviation'
        case '5':
          return 'friday-abbreviation'
        case '6':
          return 'saturday-abbreviation'
        default:
          return ''
      }
    }
  },
  startTime: {
    label: '開始時間',
    i18nLabel: 'startTime-time',
    table: {
      minWidth: 200,
      sortable: false
    }
  },
  endTime: {
    label: '結束時間',
    i18nLabel: 'endTime-time',
    table: {
      minWidth: 200,
      sortable: false
    }
  }
}
