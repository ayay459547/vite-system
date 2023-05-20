<script setup lang="ts">
import type { WritableComputedRef, PropType } from 'vue'
import { ref, computed, watch } from 'vue'
import { CustomButton } from '@/components'

const props = defineProps({
  modelValue: {
    type: Boolean as PropType<boolean>,
    required: true
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
  if (newValue) {
    openModal()
  }
})

const openModal = () => {
  tempValue.value = true

  setTimeout(() => {
    containerIsShow.value = true
  }, 100)
}

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

</script>

<template>
  <div v-if="tempValue" class="modal-wrapper">
    <Transition name="bounce">
      <div
        v-show="containerIsShow"
        v-click-outside="closeModal"
        class="modal-container"
      >
        <div class="modal-header">
          <slot name="header">
            <h3>title</h3>
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
    z-index: 10;
    left: 0;
    top: 0;
    background-color: #00000066;

    @extend %flex-center;
  }
  &-container {
    width: 80%;
    height: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border: 1px solid #fff;
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
    padding: 8px;
    flex: 1;
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