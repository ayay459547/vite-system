export const workReportColumnSetting = {
  processId: {
    label: '製程編號',
    table: {
      minWidth: 180,
      required: true
    },
    form: {
      type: 'select',
      default: null,
      validate: [],
      options: [],
      remote: true,
      remoteShowSuffix: true,
      filterable: true,
      remoteMethod: () => {},
      hiddenLabel: true,
      required: true
    }
  },
  machineId: {
    label: '機台編號',
    table: {
      minWidth: 180,
      required: true
    },
    form: {
      type: 'select',
      default: null,
      validate: [],
      options: [],
      remote: true,
      remoteShowSuffix: true,
      filterable: true,
      remoteMethod: () => {},
      hiddenLabel: true,
      required: true,
      clearable: false
    }
  },
  sequence: {
    label: '生產順序',
    table: {
      width: 100,
      align: 'center'
    },
    form: {
      default: null
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

export const switchSequenceColumnSetting = {
  sequence: {
    label: '生產順序',
    table: {
      width: 100,
      align: 'center'
    }
  },
  process_Id: {
    label: '站點編號',
    table: {
      minWidth: 160,
      required: true
    },
    form: {
      type: 'select',
      default: null,
      validate: [],
      options: [],
      remote: true,
      remoteShowSuffix: true,
      filterable: true,
      remoteMethod: () => {},
      hiddenLabel: true,
      required: true
    }
  },
  erpNo: {
    label: '插單單號',
    table: {
      minWidth: 160,
      required: false
    }
  },
  LAST_UPDATE_TIMESTAMP: {
    label: '最後更新時間',
    table: {
      minWidth: 160
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
      minWidth: 160
    },
    form: {
      default: null,
      validate: [],
      hiddenLabel: true,
      required: true
    }
  }
}
