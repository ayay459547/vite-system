<script setup lang="ts">
import type { WritableComputedRef, PropType } from 'vue'
import { ref, computed, watch } from 'vue'
import { CustomButton } from '@/components'

const props = defineProps({
  modelValue: {
    type: Boolean as PropType<boolean>,
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
    type: String as PropType<'large'| 'default'| 'small'>,
    default: 'default'
  },
  heightSize: {
    type: String as PropType<'large'| 'default'| 'small'>,
    default: 'default'
  }
})

const emit = defineEmits([
  'update:modelValue',
  'cancel',
  'submit'
])

const containerIsShow = ref(false)

const tempValue: WritableComputedRef<boolean> = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

watch(tempValue, (newValue) => {
  if (!newValue) return

  setTimeout(() => {
    containerIsShow.value = true
  }, 100)
})

const closeModal = () => {
  containerIsShow.value = false

  setTimeout(() => {
    tempValue.value = false
  }, 200)
}

const cancel = () => {
  closeModal()
  emit('cancel')
}

const submit = () => {
  emit('submit')
}

const clickOutside = () => {
  if (!props.clickOutside) return

  closeModal()
}

</script>

<template>
  <div v-show="tempValue" class="modal-wrapper">
    <Transition name="bounce">
      <div
        v-click-outside="clickOutside"
        v-show="containerIsShow"
        class="modal-container"
        :class="[`width-${props.widthSize}`, `height-${props.heightSize}`]"
      >
        <div class="modal-header">
          <slot name="header">
            <h3>{{ props.title }}</h3>
          </slot>
          <CustomButton
            icon-name="close"
            text
            @click="closeModal"
          />
        </div>

        <div class="modal-body">
          <slot>Body</slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            <div class="modal-footer-btn">
              <CustomButton
                label="取消"
                icon-name="angle-left"
                icon-move="translate"
                @click="cancel"
              />
              <CustomButton
                type="success"
                label="確認"
                icon-name="check"
                icon-move="scale"
                @click="submit"
              />
            </div>
          </slot>
        </div>
      </div>
    </Transition>
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
    background-color: #00000066;

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
    &.width {
      &-large {
        width: 80%;
        @media (max-width: 992px) {
          width: 90%;
        }
        @media (max-width: 576px) {
          width: 95%;
        }
      }
      &-default {
        width: 50%;
        @media (max-width: 992px) {
          width: 70%;
        }
        @media (max-width: 576px) {
          width: 90%;
        }
      }
      &-small {
        width: 500px;

        @media (max-width: 576px) {
          width: 85%;
        }
      }
    }
    &.height {
      &-large {
        height: 80%;
      }
      &-default {
        height: 50%;
      }
      &-small {
        height: 400px;
      }

      &-large,
      &-default,
      &-small {
        @media (max-height: 576px) {
          height: 85%;
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

    &-btn {
      display: flex;
      gap: 12px;
    }
  }
}
</style>