
type TimeUnit = [string, string]

export type TimeInfo = {
  orderId: string
  startTime: string
  endTime: string
  checkOutTime: string
  checkInTime: string
  moveInTime: string
  moveOutTime: string
  detailTime: Record<string, Array<TimeUnit>>
}

export const orderDetailTime: TimeInfo = {
  orderId: 'order_123',
  moveInTime: '2025-03-10 08:00',
  checkInTime: '2025-03-10 08:00',
  startTime: '2025-03-10 08:30',
  checkOutTime: '2025-03-14 19:00',
  moveOutTime: '2025-03-14 19:00',
  endTime: '2025-03-14 18:30',
  detailTime: {
    loadingTime: [
      [ '2025-03-10 08:30', '2025-03-10 10:00']
    ],
    changeLineTime: [ ],
    workingTime: [
      [ '2025-03-10 10:00', '2025-03-10 12:00'],
      [ '2025-03-10 14:00', '2025-03-10 18:00'],
      [ '2025-03-11 08:00', '2025-03-11 12:00'],
      [ '2025-03-11 14:00', '2025-03-11 18:00'],
      [ '2025-03-12 08:00', '2025-03-12 18:00'],
      [ '2025-03-13 08:00', '2025-03-13 18:00'],
      [ '2025-03-14 08:00', '2025-03-14 16:00']
    ],
    unloadTime: [
      [ '2025-03-14 16:00', '2025-03-14 18:30' ]
    ]
  }
}



export const machineStateTime = [{
  machineId: 'machine_A',
  machineName: '機台A',
  // shutdown: [
  //   {
  //     note: 'MachineStateReason1',
  //     start: '2025-03-10 16:00',
  //     end: '2025-03-10 18:00'
  //   }
  // ],
  maintenance: [
    {
      note: 'MachineStateReason1',
      start: '2025-03-10 12:00',
      end: '2025-03-10 14:00'
    },
    {
      note: 'MachineStateReason1',
      start: '2025-03-11 12:00',
      end: '2025-03-11 14:00'
    }
  ]
}]
// type TimeUnit = {
//   start: string
//   end: string
// }

// export type TimeInfo = {
//   orderId: string
//   startTime: string
//   endTime: string
//   detailTime: Record<string, Array<TimeUnit>>
// }

// export const testTime: TimeInfo = {
//   orderId: 'order_123',
//   startTime: '2025-03-10 08:30',
//   endTime: '2025-03-14 18:30',
//   detailTime: {
//     loadingTime: [
//       {
//         start: '2025-03-10 08:30',
//         end: '2025-03-10 10:00'
//       }
//     ],
//     // changeLineTime: [
//     //   { start: '', end: ''}
//     // ],
//     workingTime: [
//       {
//         start: '2025-03-10 10:00',
//         end: '2025-03-10 18:00'
//       },
//       {
//         start: '2025-03-11 08:00',
//         end: '2025-03-11 18:00'
//       },
//       {
//         start: '2025-03-12 08:00',
//         end: '2025-03-12 18:00'
//       },
//       {
//         start: '2025-03-13 08:00',
//         end: '2025-03-13 18:00'
//       },
//       {
//         start: '2025-03-14 08:00',
//         end: '2025-03-14 16:00'
//       }
//     ],
//     unloadTime: [
//       {
//         start: '2025-03-14 16:00',
//         end: '2025-03-14 18:30'
//       }
//     ]
//   }
// }
