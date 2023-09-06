<script setup lang="ts">
import type { Hook } from '@/declare/hook'
import type { WritableComputedRef, PropType } from 'vue'
import { ref, computed, watch, inject } from 'vue'
import { CustomButton } from '@/components'

export type WidthSize = 'fill' | 'large'| 'default'| 'small'
export type HeightSize = 'fill' | 'large'| 'default'| 'small'
export type ModelValue = boolean

const hook: Hook = inject('hook')
const { i18nTranslate } = hook()

const props = defineProps({
  modelValue: {
    type: Boolean as PropType<ModelValue>,
    default: false
  },
  title: {
    type: String as PropType<string>,
    default: ''
  },
  clickOutside: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  widthSize: {
    type: String as PropType<WidthSize>,
    default: 'default'
  },
  heightSize: {
    type: String as PropType<HeightSize>,
    default: 'default'
  },
  hiddenFooter: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  hiddenSubmit: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  hiddenCancel: {
    type: Boolean as PropType<boolean>,
    default: false
  }
})

const emit = defineEmits([
  'update:modelValue',
  'cancel',
  'submit'
])

const wrapperIsShow = ref(false)
const containerIsShow = ref(false)

const tempValue: WritableComputedRef<ModelValue> = computed({
  get: () => props.modelValue,
  set: (value: ModelValue) => emit('update:modelValue', value)
})

watch(tempValue, (newValue) => {
  if (newValue) {
    openModal()
  } else {
    closeModal()
  }
})

const openModal = () => {
  wrapperIsShow.value = true

  setTimeout(() => {
    containerIsShow.value = true
  }, 100)
}

const closeModal = () => {
  containerIsShow.value = false

  setTimeout(() => {
    wrapperIsShow.value = false
  }, 200)
}

const close = () => {
  tempValue.value = false
}

const cancel = () => {
  tempValue.value = false
  emit('cancel')
}

const submit = () => {
  emit('submit')
}

const clickOutside = () => {
  if (!props.clickOutside) return

  if (wrapperIsShow.value && containerIsShow.value) {
    tempValue.value = false
  }
}

</script>

<template>
  <div v-show="wrapperIsShow" style="display: contents;">
    <div :class="containerIsShow ? 'is-show': 'is-close'" class="modal-wrapper">
      <Transition name="modal">
        <div
          v-show="containerIsShow"
          v-click-outside="clickOutside"
          class="modal-container"
          :class="[
            `width-${props.widthSize}`,
            `height-${props.heightSize}`
          ]"
        >
          <div class="modal-header">
            <slot name="header">
              <h3>{{ props.title }}</h3>
            </slot>
            <CustomButton
              icon-name="close"
              text
              @click="close"
            />
          </div>

          <div class="modal-body">
            <div v-if="tempValue" style="width: 100%; height: 100%">
              <slot>Body</slot>
            </div>
          </div>

          <div v-if="!props.hiddenFooter" class="modal-footer">
            <slot name="footer">
              <div class="modal-footer-btn">
                <CustomButton
                  v-if="!props.hiddenCancel"
                  :label="i18nTranslate('cancel')"
                  icon-name="angle-left"
                  icon-move="translate"
                  @click="cancel"
                />
                <CustomButton
                  v-if="!props.hiddenSubmit"
                  type="success"
                  :label="i18nTranslate('confirm')"
                  icon-name="check"
                  icon-move="scale"
                  @click="submit"
                />
              </div>
            </slot>
          </div>
          <div v-else class="modal-footer-hidden">

          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.modal {
  &-wrapper {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: $modal-index;
    left: 0;
    top: 0;
    transition-duration: 0.3s;

    &.is-close {
      background-color: #00000000;
    }
    &.is-show {
      background-color: #00000066;
    }

    @extend %flex-center;
  }
  &-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border: 1px solid #fff;
    transition-duration: 0.3s;
    min-width: 400px;
    min-height: 300px;
    border-radius: 6px;
    &.width {
      &-fill {
        width: 100%;
      }
      &-large {
        width: 85%;
        @media (max-width: 992px) {
          width: 90%;
        }
        @media (max-width: 576px) {
          width: 95%;
        }
      }
      &-default {
        width: 65%;
        @media (max-width: 992px) {
          width: 70%;
        }
        @media (max-width: 576px) {
          width: 90%;
        }
      }
      &-small {
        width: 650px;
        @media (max-width: 992px) {
          width: 65%;
        }
        @media (max-width: 576px) {
          width: 85%;
        }
      }
    }
    &.height {
      &-fill {
        height: 100%;
      }
      &-large {
        height: 85%;
      }
      &-default {
        height: 65%;
      }
      &-small {
        height: 500px;
      }

      &-large,
      &-default,
      &-small {
        @media (max-height: 576px) {
          height: 90%;
        }
      }
    }
  }

  &-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
    height: 40px;
    border-bottom: 1px solid #d6d6d6;
  }

  &-body {
    width: 100%;
    flex: 1;
    overflow: auto;
  }

  &-footer {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 8px;
    border-top: 1px solid #d6d6d6;

    &-hidden {
      width: 100%;
      height: 24px;
      border-top: 1px solid #d6d6d6;
    }

    &-btn {
      display: flex;
      gap: 12px;
    }
  }
}
</style>