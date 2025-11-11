<script setup lang="ts">
// import { Handle as FlowHandle, Position } from '@vue-flow/core'

import { FlowHandle } from '@/components/chart'
import { Position } from '@/lib/lib_vueFlow'
import { useTeleport } from './useTeleport'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const { animation, transition, teleport, onClick } = useTeleport(props.id)

function changeAnimation() {
  animation.value = animation.value === 'fade' ? 'shrink' : 'fade'
}
</script>

<template>
  <teleport :disabled="!teleport" :to="teleport">
    <transition :name="animation">
      <div v-if="!transition" class="teleportable">
        <FlowHandle type="target" :position="Position.Top" />

        [Node {{ id }}]

        <div class="buttons">
          <div
            v-if="teleport !== '#port'"
            class="button"
            @click.prevent="onClick('#port')"
          >
            Teleport To Sidebar
          </div>

          <div
            v-if="teleport !== null"
            class="button"
            @click.prevent="onClick(null)"
          >
            Teleport To Main Graph
          </div>

          <div class="button" @click.prevent="changeAnimation">
            Animation: {{ animation }}
          </div>
        </div>

        <FlowHandle type="source" :position="Position.Bottom" />
      </div>
    </transition>
  </teleport>
</template>
