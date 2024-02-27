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
        { label: 'orderNo-01', value: 'orderNo-01' },
        { label: 'orderNo-02', value: 'orderNo-02' },
        { label: 'orderNo-03', value: 'orderNo-03' },
        { label: 'orderNo-04', value: 'orderNo-04' },
        { label: 'orderNo-05', value: 'orderNo-05' }
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
        { label: 'processNo-001', value: 'processNo-001' },
        { label: 'processNo-002', value: 'processNo-002' },
        { label: 'processNo-003', value: 'processNo-003' }
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
