import { langOptions } from '@/declare/declare_i18n'

export const getColumnSetting = () => {
  const columnSetting = {
    i18nKey: {
      label: '系統設定名稱',
      i18nLabel: 'translation-systemDefault',
      table: {
        minWidth: 180,
        required: true
      },
      form: {
        type: 'select-v2',
        filterable: true,
        default: '',
        validate: [],
        options: [],
        required: true,
        hiddenErrorMessage: true,
        hiddenLabel: true
      }
    }
  }

  langOptions.forEach(option => {
    const { label, value } = option

    columnSetting[value] = {
      label,
      table: {
        minWidth: 180,
        required: true
      },
      form: {
        type: 'text',
        default: '',
        validate: [],
        required: true,
        hiddenErrorMessage: true,
        hiddenLabel: true
      }
    }
  })

  return {...columnSetting}
}
