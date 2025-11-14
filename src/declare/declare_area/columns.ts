export const columnSetting = {
  areaId: {
    label: '區域編號',
    i18nLabel: 'area-no',
    table: {
      width: 200,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  areaName: {
    label: '區域名稱',
    i18nLabel: 'area-name',
    table: {
      width: 200,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  areaCategory: {
    label: '區域類別',
    i18nLabel: 'area-category',
    table: {
      minWidth: 200,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      type: 'select',
      default: '',
      options: [
        { label: 'ALL', value: '' },
        { label: 'APS', value: 'APS' },
        { label: 'WMS', value: 'WMS' }
      ],
      isCondition: true
    }
  },
  parentNo: {
    label: '所屬區域編號',
    i18nLabel: 'area-parentId',
    table: {
      minWidth: 200,
      sortable: false
    },
    filter: {
      width: 250,
      isValidate: false,
      default: null,
      isCondition: true
    }
  },
  lastUpdateDate: {
    label: '最後更新時間',
    i18nLabel: 'last-updateTime',
    table: {
      minWidth: 350,
      sortable: false
    },
    filter: {
      width: 300,
      placement: 'top-end',
      isValidate: false,
      default: null,
      type: 'daterange',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      isCondition: true
    }
  }
}

// 跳轉設定
const fromPage = 'nav1-1'
export const linkSetting = {
  areaId: {
    fromPage,
    options: [
      {
        toPage: 'nav1-1'
        // description: '區域所屬機台',
        // i18nDescription: 'link-area-machine'
      }
    ]
  }
}
