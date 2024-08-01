import { getMachineList } from './api'
import { message } from '@/lib/lib_utils'

export const columnSetting = {
  dateTimeRange: {
    label: '日期區間',
    i18nLabel: 'timeRange-date',
    form: {
      i18nModule: 'system',
      default: null,
      required: true,
      type: 'datetimerange',
      format: 'YYYY-MM-DD HH:mm',
      valueFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  startDateTime: {
    label: '開始日期',
    i18nLabel: 'startTime-date',
    table: {
      width: 200,
      sortable: false
    },
    filter: {
      isValidate: false,
      default: null,
      type: 'daterange',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD'
    }
  },
  endDateTime: {
    label: '結束日期',
    i18nLabel: 'endTime-date',
    table: {
      width: 200,
      sortable: false
    },
    filter: {
      isValidate: false,
      default: null,
      type: 'daterange',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD'
    }
  },
  machine_Id: {
    label: '機台編號',
    i18nLabel: 'machine-id',
    table: {
      width: 200,
      sortable: false
    },
    form: {
      type: 'autocomplete',
      i18nModule: 'system',
      default: null,
      required: true,
      fetchSuggestions: async (queryString: string, cb: (arg: any) => void) => {
        const { status, msg, data: list } = await getMachineList(queryString)
        if (status !== 'success') {
          message({
            type: 'error',
            message: msg ?? 'Get Machine Error',
            duration: 10000
          })
        }

        cb(
          list.map(item => {
            const { id } = item
            return { label: id, value: id }
          })
        )
      }
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null
    }
  },
  type: {
    label: '類別',
    i18nLabel: 'type-ver2',
    table: {
      width: 200,
      sortable: false
    },
    form: {
      type: 'select',
      default: 'maintain',
      required: true,
      i18nModule: 'system',
      options: [
        { i18nLabel: 'maintain', label: '保養維護', value: 'maintain' },
        { i18nLabel: 'overtime-weekday', label: '平日加班', value: 'overtime' },
        { i18nLabel: 'overtime-holiday', label: '假日加班', value: 'holiday_overtime' }
      ]
    },
    filter: {
      width: 250,
      isValidate: false,
      type: 'select',
      default: '',
      i18nModule: 'system',
      options: [
        { i18nLabel: 'all', label: '全部', value: '' },
        { i18nLabel: 'maintain', label: '保養維護', value: 'maintain' },
        { i18nLabel: 'overtime-weekday', label: '平日加班', value: 'overtime' },
        { i18nLabel: 'overtime-holiday', label: '假日加班', value: 'holiday_overtime' }
      ]
    },
    getValue(data: string) {
      switch (data) {
        case 'maintain':
          return 'maintain'
        case 'overtime':
          return 'overtime-weekday'
        case 'holiday_overtime':
          return 'overtime-holiday'
        default:
          return ''
      }
    }
  },
  note: {
    label: '備註',
    i18nLabel: 'note',
    table: {
      minWidth: 200,
      sortable: false
    },
    form: {
      i18nModule: 'system',
      default: null,
      type: 'textarea',
      rows: 6
    }
  },
  operations: {
    label: '操作',
    i18nLabel: 'operationCommands',
    table: {
      width: 60,
      align: 'center',
      fixed: 'right',
      isOperations: true
    }
  }
}
