import type { PropType } from 'vue'
import type { FitViewParams, PanelPositionType } from '@vue-flow/core'

export const version = '__FlowControls_1.0.0__'

export interface Types {}

export interface Props {
  showZoom: boolean
  showFitView: boolean
  showInteractive: boolean
  fitViewParams: FitViewParams
  position: PanelPositionType
}

/**
 * https://vueflow.dev/gushowZoome/components/background.html
 */
export const props = {
  showZoom: {
    type: Boolean as PropType<Props['showZoom']>,
    required: false,
    default: undefined,
    description: 'Show zoom btn'
  },
  showFitView: {
    type: Boolean as PropType<Props['showFitView']>,
    required: false,
    default: undefined,
    description: 'Show fit-view btn'
  },
  showInteractive: {
    type: Boolean as PropType<Props['showInteractive']>,
    required: false,
    default: undefined,
    description: 'Show lock interactive btn'
  },
  fitViewParams: {
    type: Number as PropType<Props['fitViewParams']>,
    required: false,
    default: undefined,
    description: 'Params to use on fit-view button click'
  },
  position: {
    type: String as PropType<Props['position']>,
    required: false,
    default: undefined,
    description: 'position'
  }
}

export interface Emits {
  onZoomIn?: () => any
  onZoomOut?: () => any
  onFitView?: () => any
  onInteractionChange?: (active: boolean) => any
}

export interface Expose {}
