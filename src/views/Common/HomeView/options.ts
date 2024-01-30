const system = (import.meta as any).env.VITE_API_SYSTEM_TYPE

export const textOptions = {
  graphic: {
    elements: [
      {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: system,
          fontSize: 80,
          fontWeight: 'bold',
          lineDash: [0, 200],
          lineDashOffset: 0,
          fill: 'transparent',
          stroke: '#49648d',
          lineWidth: 3
        },
        keyframeAnimation: {
          duration: 1000,
          loop: false,
          keyframes: [
            {
              percent: 0.7,
              style: {
                fill: 'transparent',
                lineDashOffset: 0,
                lineDash: [200, 0]
              }
            },
            {
              percent: 0.8,
              style: { fill: 'transparent' }
            },
            {
              percent: 1,
              style: { fill: '#48648f' }
            }
          ]
        }
      }
    ]
  }
}
