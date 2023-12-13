import type { TableData } from './api'

export const fakeTableData: TableData[] = [
  {
    id: 1,
    machineNo: 'M_A1',
    machineName: '機台_A1',
    machineLocation: '區域A',
    machineStatusRemarks: '待機',
    leadTime: '00:00:00',
    productionCapacity: '1',
    groupName: 'G_A',
    children: [
      {
        id: 11,
        operationMethodCode: 'No1',
        operationMethod: '編號1',
        productivity: 1,
        machineTime: 1
      },
      {
        id: 12,
        operationMethodCode: 'No2',
        operationMethod: '編號2',
        productivity: 10,
        machineTime: 15
      },
      {
        id: 13,
        operationMethodCode: 'No5',
        operationMethod: '編號5',
        productivity: 14,
        machineTime: 32
      },
      {
        id: 14,
        operationMethodCode: 'No6',
        operationMethod: '編號6',
        productivity: 71,
        machineTime: 88
      }
    ]
  },
  {
    id: 111,
    machineNo: 'M_B1',
    machineName: '機台_B1',
    machineLocation: '區域B',
    machineStatusRemarks: '待機',
    leadTime: '00:00:00',
    productionCapacity: '10',
    groupName: 'G_B',
    children: [
      {
        id: 211,
        operationMethodCode: 'No89',
        operationMethod: '編號89',
        productivity: 0,
        machineTime: 66
      },
      {
        id: 212,
        operationMethodCode: 'No56',
        operationMethod: '編號56',
        productivity: 0,
        machineTime: 43
      },
      {
        id: 213,
        operationMethodCode: 'No112',
        operationMethod: '編號112',
        productivity: 6,
        machineTime: 32
      },
      {
        id: 214,
        operationMethodCode: 'No174',
        operationMethod: '編號174',
        productivity: 1,
        machineTime: 1
      }
    ]
  },
  {
    id: 2,
    machineNo: 'M_A13',
    machineName: '機台_A13',
    machineLocation: '區域A',
    machineStatusRemarks: '待機',
    leadTime: '00:00:00',
    productionCapacity: '5',
    groupName: 'G_A',
    children: [
      {
        id: 25,
        operationMethodCode: 'No214',
        operationMethod: '編號214',
        productivity: 1,
        machineTime: 1
      },
      {
        id: 26,
        operationMethodCode: 'No71',
        operationMethod: '編號71',
        productivity: 14,
        machineTime: 1
      }
    ]
  },
  {
    id: 3,
    machineNo: 'M_A22',
    machineName: '機台_A22',
    machineLocation: '區域A',
    machineStatusRemarks: '待機',
    leadTime: '00:00:00',
    productionCapacity: '4',
    groupName: 'G_A',
    children: [
      {
        id: 37,
        operationMethodCode: 'No451',
        operationMethod: '編號451',
        productivity: 14,
        machineTime: 21
      }
    ]
  },
  {
    id: 4,
    machineNo: 'M_B6',
    machineName: '機台_B6',
    machineLocation: '區域B',
    machineStatusRemarks: '生產中',
    leadTime: '00:00:00',
    productionCapacity: '1',
    groupName: 'G_B',
    children: [
      {
        id: 48,
        operationMethodCode: 'No1',
        operationMethod: '編號1',
        productivity: 1,
        machineTime: 1
      },
      {
        id: 49,
        operationMethodCode: 'No5',
        operationMethod: '編號5',
        productivity: 1,
        machineTime: 1
      },
      {
        id: 50,
        operationMethodCode: 'No65',
        operationMethod: '編號65',
        productivity: 1,
        machineTime: 1
      },
      {
        id: 51,
        operationMethodCode: 'No7',
        operationMethod: '編號7',
        productivity: 1,
        machineTime: 1
      },
      {
        id: 53,
        operationMethodCode: 'No8',
        operationMethod: '編號8',
        productivity: 1,
        machineTime: 1
      }
    ]
  }
]
