import type { PropType } from 'vue'

export const version = '__GanttChart_1.0.0__'

export declare namespace Types {
  type Type = string
  type List = Array<
    [
      number, // 開始時間
      number, // 結束時間
      string, // 標題
      any // 資料
    ]
  >
}

export declare namespace Props {
  type Left = number
  type DataZoomX = number
  type DateFormatX = string
  type IntervalX = number
  type MinX = string
  type MaxX = string
  type GanttData = Array<{
    type: Types.Type
    list: Types.List
  }>
  type BarTextCallback = (value: any, title: string) => string
  type BarColorCallback = (value: any) => string
  type TooltipCallback = (value: any, start: string, end: string, title: string) => string
  type TooltipPositionCallback = (x: number, y: number) => { x: number, y: number }
}
export const props = {
  left: {
    type: Number as PropType<Props.Left>,
    default: 150,
    description: '給左邊 type 的空間'
  },
  dataZoomX: {
    type: Number as PropType<Props.DataZoomX>,
    default: 100,
    description: 'x軸預設百分比'
  },
  dateFormatX: {
    type: String as PropType<Props.DateFormatX>,
    default: 'YYYY-MM-DD',
    description: '決定 x 軸上方的日期顯示'
  },
  intervalX: {
    type: Number as PropType<Props.IntervalX>,
    default() {
      return 1000 * 60 * 60 * 24
    },
    description: 'x軸 時間增加毫秒'
  },
  minX: {
    type: String as PropType<Props.MinX>,
    default: null,
    description: 'x軸 最小時間 YYYY-MM-DD hh:mm'
  },
  maxX: {
    type: String as PropType<Props.MaxX>,
    default: null,
    description: 'x軸 最大時間 YYYY-MM-DD hh:mm'
  },
  ganttData: {
    type: Array as PropType<Props.GanttData>,
    default() {
      return [
        {
          type: 'type1',
          list: [
            [1496902000000, 1496912000000, 'title1', 'MEF-N1237551'],
            [1496922000000, 1496925000000, 'title2', 'MEF-N1237552'],
            [1496930000000, 1496934000000, 'title3', 'MEF-N1237553']
          ]
        },
        {
          type: 'type2',
          list: [
            [1496925100000, 1496936000000, 'title11', 'MEF-N1237551'],
            [1496937000000, 1496938000000, 'title12', 'MEF-N1237552'],
            [1496939000000, 1496942000000, 'title13', 'MEF-N1237553']
          ]
        },
        {
          type: 'type3',
          list: [
            [1496926100000, 1496936100000, 'title31', 'MEF-N1237551'],
            [1496938100000, 1496939500000, 'title32', 'MEF-N1237552'],
            [1496940100000, 1496942000000, 'title33', 'MEF-N1237553']
          ]
        }
      ]
    }
  },
  barTextCallback: {
    type: Function as PropType<Props.BarTextCallback>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    default: (value: any, title: string) => {
      return title
    },
    description: '自訂甘特圖的條狀 顯示的文字 有給value值 標題'
  },
  barColorCallback: {
    type: Function as PropType<Props.BarColorCallback>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    default: (value: any) => {
      return '#3073ac'
    },
    description: '自訂甘特圖的條狀 顯示的顏色 有給value值'
  },
  tooltipCallback: {
    type: Function as PropType<Props.TooltipCallback>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    default: (value: any, start: string, end: string, title: string) => {
      return `
        <div 
          class="gantt-tooltip" 
          style="display: flex; flex-direction: column; gap: 8px;"
        >
          <div style="font-size: 1.2em;">${title}</div>
          <div>${start}</div>
          <div>${end}</div>
        </div>
      `
    },
    description: `
      自訂滑鼠移入時 顯示的東西
      有給 value 值 開始時間 結束時間 標題
    `
  },
  tooltipPositionCallback: {
    type: Function as PropType<Props.TooltipPositionCallback>,
    default: (x: number, y: number) => {
      return { x, y }
    },
    description: '自訂滑鼠移入時 顯示的位置'
  }
}

export declare namespace Emits {
  type TypeClick = ([number, string]) => void
  type ItemClick = (params: any) => void
}

export declare namespace Expose {
  type Init = () => void
}
