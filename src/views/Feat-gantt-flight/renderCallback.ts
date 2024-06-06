import * as echarts from 'echarts'

export const HEIGHT_RATIO = 0.6
export const DIM_CATEGORY_INDEX = 0
export const DIM_TIME_ARRIVAL = 1
export const DIM_TIME_DEPARTURE = 2
export const DATA_ZOOM_AUTO_MOVE_THROTTLE = 30
export const DATA_ZOOM_X_INSIDE_INDEX = 1
export const DATA_ZOOM_Y_INSIDE_INDEX = 3
export const DATA_ZOOM_AUTO_MOVE_SPEED = 0.2
export const DATA_ZOOM_AUTO_MOVE_DETECT_AREA_WIDTH = 30

export function renderAxisLabelItem(params, api) {
  const y = api.coord([0, api.value(0)])[1]
  if (y < params.coordSys.y + 5) {
    return
  }
  return {
    type: 'group',
    position: [10, y],
    children: [
      {
        type: 'path',
        shape: {
          d: 'M0,0 L0,-20 L30,-20 C42,-20 38,-1 50,-1 L70,-1 L70,0 Z',
          x: 0,
          y: -20,
          width: 90,
          height: 20,
          layout: 'cover'
        },
        style: {
          fill: '#368c6c'
        }
      },
      {
        type: 'text',
        style: {
          x: 24,
          y: -3,
          text: api.value(1),
          textVerticalAlign: 'bottom',
          textAlign: 'center',
          textFill: '#fff'
        }
      },
      {
        type: 'text',
        style: {
          x: 75,
          y: -2,
          textVerticalAlign: 'bottom',
          textAlign: 'center',
          text: api.value(2),
          textFill: '#000'
        }
      }
    ]
  }
}

export function clipRectByRect(params, rect) {
  return echarts.graphic.clipRectByRect(rect, {
    x: params.coordSys.x,
    y: params.coordSys.y,
    width: params.coordSys.width,
    height: params.coordSys.height
  })
}
