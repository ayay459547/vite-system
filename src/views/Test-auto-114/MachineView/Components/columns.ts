export const workReportColumnSetting = {
  sequence: {
    label: '生產順序',
    table: {
      width: 100,
      align: 'center'
    }
  },
  orderNo: {
    label: '插單單號',
    table: {
      minWidth: 180,
      required: true
    },
    form: {
      type: 'select',
      default: null,
      validate: [],
      options: [
        { label: 'PF0462103WO56S-ENG', value: 'PF0462103WO56S-ENG' },
        { label: 'PF0462103WO491-01', value: 'PF0462103WO491-01' },
        { label: 'PF0462103WO549-02', value: 'PF0462103WO549-02' },
        { label: 'PF0462103WO555-03', value: 'PF0462103WO555-03' },
        { label: 'PF0462103WO522-04', value: 'PF0462103WO522-04' }
      ],
      hiddenLabel: true,
      required: true
    }
  },
  processNo: {
    label: '站點編號',
    table: {
      minWidth: 180,
      required: true
    },
    form: {
      type: 'select',
      default: null,
      validate: [],
      options: [
        { label: 'CP-0200', value: 'CP-0200' },
        { label: 'CP-0210', value: 'CP-0210' },
        { label: 'CP-0280', value: 'CP-0280' }
      ],
      hiddenLabel: true,
      required: true
    }
  },
  LAST_UPDATE_TIMESTAMP: {
    label: '最後更新時間',
    table: {
      minWidth: 180
    },
    form: {
      default: null,
      validate: [],
      hiddenLabel: true,
      required: true
    }
  },
  updateBy: {
    label: '最後更新者',
    table: {
      minWidth: 180
    },
    form: {
      default: null,
      validate: [],
      hiddenLabel: true,
      required: true
    }
  }
}
