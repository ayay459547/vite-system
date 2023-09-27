<script setup lang="ts">
import { CustomCharts } from '@/components'

const options = () => {
  return {
    graphic: {
      elements: [
        {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: 'HOME',
            fontSize: 80,
            fontWeight: 'bold',
            lineDash: [0, 200],
            lineDashOffset: 0,
            fill: 'transparent',
            stroke: '#000',
            lineWidth: 1
          },
          keyframeAnimation: {
            duration: 5000,
            loop: false,
            keyframes: [
              {
                percent: 0.7,
                style: {
                  fill: 'transparent',
                  lineDashOffset: 200,
                  lineDash: [200, 0]
                }
              },
              {
                percent: 0.8,
                style: { fill: 'transparent' }
              },
              {
                percent: 1,
                style: { fill: 'black' }
              }
            ]
          }
        }
      ]
    }
  }
}

</script>

<template>
  <div class="home">
    <div class="home-title">
      <CustomCharts :options="options"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  padding: 16px;

  &-title {
    width: 100%;
    height: 120px;
  }
}
</style>